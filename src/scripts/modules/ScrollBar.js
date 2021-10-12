export default class ScrollBar {
  constructor(elem) {
    this.elem = elem
    this.window = window
    this.bar = this.elem.querySelector('[data-scroll-bar-role="bar"]')
    this.sections = this.elem.querySelectorAll('[data-scroll-bar-role="section"]')
    this.current = null
    this.init()
  }
  init() {
    window.addEventListener('load', () => {
      this.setScrollBar()
    })
    window.addEventListener('resize', () => {
      this.setScrollBar()
    })
    window.addEventListener('orientationchange', () => {
      this.setScrollBar()
    })
    window.addEventListener('scroll', () => {
      this.setScrollBar()
    })
  }
  setScrollBar() {
    let windowTop = -Infinity
    let target = null
    this.current = null

    Array.prototype.forEach.call(this.sections, section => {
      const sectionTop = section.getBoundingClientRect().top
      const position = parseInt(section.getAttribute('data-scroll-bar-position'))
      let windowHeight = null

      if (sectionTop > windowTop && sectionTop <= windowHeight) {
        windowTop = sectionTop
        target = section
      }
    })
      if (!this.bar.classList.contains('is-loaded')) {
        setTimeout(() => {
          this.bar.classList.add('is-loaded')
        }, 500)
      }
    }
  }
