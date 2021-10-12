export default class HamburgerMenu {
  constructor(elem) {
    this.elem = elem
    this.open = this.elem.querySelector('[data-hamburer-menu-role="open"]')
    this.wrapper = this.elem.querySelector('[data-hamburer-menu-role="wrapper"]')
    this.area = this.elem.querySelector('[data-hamburer-menu-role="area"]')
    this.close = this.elem.querySelector('[data-hamburer-menu-role="close"]')
    this.list = this.elem.querySelector('[data-hamburer-menu-role="list"]')
    this.triggers = this.list.querySelectorAll('a[href^="#"]')
    this.pathname = location.pathname
    this.showClass = 'is-show'
    this.currentScrollTop = null
    this.init()
  }
  init() {
    window.addEventListener('load', () => {
      this.setHamburgerMenu()
    })
  }
  setHamburgerMenu() {
    let openStyle = () => {
      this.currentScrollTop = window.pageYOffset
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
      document.body.style.top = `-${this.currentScrollTop}px`
    }
    let closeStyle = () => {
      document.body.style.position = ''
      document.body.style.width = ''
      document.body.style.top = ''
      document.body.scrollTop = this.currentScrollTop
      document.documentElement.scrollTop = this.currentScrollTop
    }
    this.open.addEventListener('click', () => {
      openStyle()
      this.wrapper.classList.add(this.showClass)
    })
    this.close.addEventListener('click', () => {
      closeStyle()
      this.wrapper.classList.remove(this.showClass)
    })
    this.area.addEventListener('click', () => {
      closeStyle()
      this.wrapper.classList.remove(this.showClass)
    })

    // 通常のリンク
    Array.prototype.forEach.call(this.triggers, trigger => {
      trigger.addEventListener('click', e => {
        if (trigger.pathname === location.pathname) e.preventDefault()
        closeStyle()
        this.wrapper.classList.remove(this.showClass)
        const href = trigger.getAttribute('href')
        const hash = (href === '#' || href === '') ? 'html' : trigger.hash;
        this.smoothScroll(hash);
        return false;
      })
    })
  }  
  smoothScroll(hash) {
    const targetElement = document.querySelector(hash)
    const rect = targetElement.getBoundingClientRect().top
    const offset = window.pageYOffset || document.documentElement.scrollTop
    const target = rect + offset
    window.scrollTo({
      top: target,
      behavior: 'smooth'
    })
  }
}