import $ from 'jquery'
import 'slick-carousel'

export default class KvSlider {
  constructor(elem) {
    this.$elem = $(elem)
    this.setSlider()
  }
  setSlider() {
    this.$elem.slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      infinite: true,
      fade: true,
      autoplay: true,
      pauseOnFocus: false,
      pauseOnHover: false,
      arrow: false,
      prevArrow: false,
      nextArrow: false,
      speed: '5000',
      autoplaySpeed: 3000,
      lazyload: 'ondemand'
    })
  }
}