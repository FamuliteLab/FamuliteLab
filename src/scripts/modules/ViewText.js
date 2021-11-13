export default class ViewText {
  constructor(el) {
    this.el = el
    this.targets = this.el.querySelectorAll('[data-view-text-target]')
    this.init()
  }
  init() {
    this.setSpan()
  }
  wrapCharSpan(str) {
    return [...str].map(char => {
      if(' ' === char) {
        char = '\u00a0'
      }
      return `<span>${char}</span>`
    }).join('');
  }
  setSpan() {
    this.targets.forEach(target => {
      target.innerHTML = this.wrapCharSpan(target.innerText)
      this.anim(target)
    })
  }
  anim(target) {
    const prop = {
      duration: .7,
      easeStrength: .2,
      delay: .07,
    }
    const str = target.querySelectorAll('span')
    if (str.length) {
      for (let i = 0; i < str.length; i++) {
        str[i].style.transition = 'opacity ' + prop.duration + 's cubic-bezier(' + prop.easeStrength + ', 0, 0.11, 1.0)' + prop.delay * i + 's' + ', ' + 'transform ' + prop.duration + 's cubic-bezier(' + prop.easeStrength + ', 0, 0.11, 1.0)' + prop.delay * i + 's'
        setTimeout(() => {
          str[i].classList.add('anim')
        })
      }
    }
  }
}