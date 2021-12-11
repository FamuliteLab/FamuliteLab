export default class GetWindowHeight {
  constructor(elem) {
    this.elem = elem
    this.window = window
    this.lastInnerWidth = window.innerWidth
    this.lastInnerHeight = window.innerHeight
    this.init()
  }
  init() {
    this.window.addEventListener('load', () => {
      this.setHeight()
    })
    this.window.addEventListener('orientationchange', () => {
      this.setHeight()
    })
    this.window.addEventListener('resize', () => {
      if (this.lastInnerWidth !== this.window.innerWidth && this.lastInnerHeight === this.window.innerHeight) {
        this.setHeight()
        this.lastInnerWidth = this.window.innerWidth
        this.lastInnerHeight = this.window.innerHeight
      }
    })
  }
  setHeight() {
    let vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
  }
}
