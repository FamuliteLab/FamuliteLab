export default class SampleOptions {
  constructor(elem, opts) {
    this.elem = elem
    this.opts = opts

    this.init()
  }

  init() {
    console.log('SampleOptions', this.opts);
  }
}