import $ from 'jquery'
import 'slick-carousel'

export default class MemberSlider {
  constructor(elem) {
    this.$elem = $(elem)
    this.setSlider()
  }
  setSlider() {
    this.$elem.slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      infinite: true,
      fade: false,
      pauseOnFocus: false,
      pauseOnHover: false,
      arrows: true
    })
  }
}