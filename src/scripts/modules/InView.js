export default class InView {
  constructor(elem, opts) {
    this.elm = elem
    this.flg = false
    this.threshold = opts.threshold || 0.8
    this.init()
    this.bindEvents()
  }
  init() {
    const w = window.innerWidth
    if (w < 750) this.threshold = 0.8
    this.w = window.innerWidth
    this.h = window.innerHeight
  }
  bindEvents() {
    window.addEventListener('load', () => {
      this.InViewChecker()
    })
    window.addEventListener('scroll', () => {
      this.InViewChecker()
    })
  }
  InViewChecker() {
    const top = this.elm.getBoundingClientRect().top
    if (top < this.threshold * this.h && !this.flg) {
      this.flg = true
      this.elm.classList.add('is-show')
    }
  }
}