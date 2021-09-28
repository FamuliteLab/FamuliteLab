export default class Sample {
  constructor(elem) {
    this.elem = elem

    this.init()
  }

  init() {
    console.log('Sample', this.elem);
  }
}