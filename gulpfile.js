const os = require('os')
const fs = require('fs')
const path = require('path')
const rimraf = require('rimraf')

const { src, dest, watch, series, parallel } = require('gulp')

const mode = require('gulp-mode')({ modes: ['production', 'development'] })

const pug = require('gulp-pug')
const pugOrigin = require('pug')
const pugAlias = require('pug-alias')
const data = require('gulp-data')
const htmlhint = require('gulp-htmlhint')

const stylus = require('gulp-stylus')
const styleAlias = require('gulp-style-aliases')
const plumber = require('gulp-plumber')
const autoprefixer = require('gulp-autoprefixer')

const babel = require('gulp-babel')
const webpack = require('webpack')
const webpackStream = require('webpack-stream')
const webpackConfig = mode.production() ? require('./webpack.prod') : require('./webpack.dev')

const directorySync = require('gulp-directory-sync')

const imagemin = require('gulp-imagemin')
const mozjpeg = require('imagemin-mozjpeg')
const pngquant = require('imagemin-pngquant')

const browserSync = require('browser-sync')
const connectSSI = require('connect-ssi')

// path
const basePath = process.cwd(),
      SRC_PATH = './src',
      DIST_PATH = './dist',
      PROD_PATH = './htdocs',
      contentPath = {
        data: SRC_PATH + '/data',
        html: SRC_PATH + '/html',
        scripts: SRC_PATH + '/scripts',
        styles: SRC_PATH + '/styles'
      },
      assetsPath = '/assets'

const OUTPUT_MODE = mode.production() ? 'prod' : 'dev'

// clean
const clean = done => {
  rimraf(DIST_PATH, done)
}

// html
const html = () => {
  return src(`${SRC_PATH}/html/**/!(_)*.pug`)
  .pipe(data(() => {
    // target：dataディレクトリのパス
    const target = `${SRC_PATH}/data`

    // json：最終的に作成されるjsonデータ用
    const json = {}

    // gen：dataディレクトリ配下で階層構造を維持してjsonを取る関数（再帰）
    const gen = (dir) =>
      fs.readdirSync(dir, {withFileTypes: true}).map(dirent => {
        // rel：引数 dir に入ったディレクトリ配下のファイルやディレクトリ名 → sample.json、nest_sample ...etc
        const rel = dirent.name

        // abs：relの絶対パス作成（後々 readFileSync するため）
        const abs = dir + '/' + rel

        // dirent が file形式であれば(ここではdirentがディレクトリでなければと同意)
        if(dirent.isFile()) {
          // fileの拡張子がjsonであれば
          if('.json' === path.extname(rel)) {
            // json内の key をディレクトリとファイル名でネストするため、絶対パスから split
            const keys = abs.replace(target + '/', '').split('/')

            // keys.length が 1 ならjsonファイルのみ
            if(1 === keys.length) {
              // 関数前で定義した空のjsonオブジェクトに中身を JSON.parse する
              // json[{ファイル名から.jsonを抜いたもの}] に ファイルの中身を代入
              // sample.json であれば、json["sample"] に /src/data/sample.json を readFileSync して JSON.parse
              json[keys[0].replace('.json','')] = JSON.parse(fs.readFileSync(abs))

            // keys.length が 1 でないなら（split の中身が複数なので、親にディレクトリを持っている）
            } else {
              // json形式の文字列を作って最後に parse
              // 格納用の変数
              let jsonTxt = ''

              // keys の length が 3以上（ディレクトリの階層が2つ以上ネストされている）ならば
              // 文字列の先頭と後尾に {} をつける
              // jsonファイルそのものにははじめから {} がついており、
              // 最後に一つ上の階層 [keys[0]] に parse をいれるため
              // なぜやっているか説明が難しい。。。
              if(2 < keys.length) {
                jsonTxt += '{\n'
              }
              for(let i = 1; i < keys.length; i++) {
                if(i === keys.length - 1) jsonTxt += fs.readFileSync(abs)
                if(i === keys.length - 2) jsonTxt += '"' + keys[i] + '": '
                if(i <   keys.length - 2) jsonTxt += '"' + keys[i] + '": {\n'
              }
              for(let i = 1; i < keys.length; i++) {
                if(i < keys.length - 2) jsonTxt += '\n}'
              }
              if(2 < keys.length) jsonTxt += '\n}'
              json[keys[0]] = JSON.parse(jsonTxt)
            }
          }
        } else {
          gen(abs)
        }
      })
    gen(target)
    console.log('***\ndata\n***')
    console.log(JSON.stringify(json, null, 2))
    return { data: json }
  }))
  .pipe(pug({
    pug: pugOrigin,
    doctype: 'html',
    pretty: true,
    plugins: [
      pugAlias({
        // as String
        '~src': SRC_PATH,
        '~data': contentPath.data,
        '~html': contentPath.html,
        '~scripts': contentPath.scripts,
        '~styles': contentPath.styles
        // as Function
        // '@': fn => fn.replace(/^@/, 'src/templates')
      })
    ],
    locals: {
      OUTPUT_MODE
    }
  }))
  .pipe(dest(`${DIST_PATH}`))
}

const validateHTML = () => {
  return src(`${DIST_PATH}/**/*.html`)
  .pipe(htmlhint({
    'doctype-first': false
  }))
  .pipe(htmlhint.reporter())
}

// style
const style = () => {
  return src(`${SRC_PATH}/styles/init/**/*.styl`)
  .pipe(plumber())
  .pipe(stylus({
    'include css': true
  }))
  .pipe(autoprefixer({
    cascade: false,
    grid: true
  }))
  .pipe(dest(`${DIST_PATH}${assetsPath}/styles`))
}

// script
const script = () => {
  return webpackStream(webpackConfig, webpack)
  .pipe(babel())
  .pipe(dest(`${DIST_PATH}${assetsPath}/scripts`))
}

// static
const staticFiles = () => {
  return src(`${SRC_PATH}/static/**/*`)
  .pipe(dest(`${DIST_PATH}${assetsPath}`))
}

// min image files
const minFiles = `${DIST_PATH}/**/*.{png,jpg,gif,svg}`
const minOptions = [
  pngquant({
    quality: [0.7, 0.85],
    speed: 1
  }),
  mozjpeg({
    quality: 85,
    progressive: true
  }),
  imagemin.gifsicle(),
  imagemin.svgo({
    plugins: [
      { removeViewBox: false }
    ]
  })
]

const minImageFiles = () => {
  return src(minFiles)
  .pipe(imagemin(minOptions,{ verbose: true }))
  .pipe(dest(`${DIST_PATH}`))
}

// serve
const routesOptions = {}
routesOptions[assetsPath] = `${SRC_PATH}/static`

const serve = done => {
  browserSync({
    server: {
      baseDir: [DIST_PATH],
      routes: routesOptions,
      middleware: [
        connectSSI({
          baseDir: DIST_PATH,
          ext: '.html'
        })
      ]
    },
    port: 3000,
    // open: 'external',
    startPath: '/'
  })
  done()
}

// watch
const watchFiles = () => {
  watch(`${SRC_PATH}/data/**/*.json`, series(parallel(html, style, script), validateHTML))
  watch(`${SRC_PATH}/html/**/*.pug`, series(html, validateHTML))
  watch(`${SRC_PATH}/styles/**/*.styl`, series(style))
  watch(`${SRC_PATH}/scripts/**/*.js`, series(script))
}

// sync
const sync = () => {
  return src('.')
  .pipe(directorySync(
    DIST_PATH,
    PROD_PATH,
    {
      printSummary: true,
      ignore: '.DS_Store'
    }
  ))
}

// tasks
const buildFiles = series(clean, parallel(html, style, script), validateHTML)
// exports
exports.dev = series(buildFiles, serve, watchFiles)
exports.min = minImageFiles
exports.build = series(buildFiles, staticFiles)
exports.prod = series(buildFiles, staticFiles, minImageFiles, sync)
exports.html = html
