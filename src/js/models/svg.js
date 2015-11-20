class Svg {

  constructor() {

    this.xmlns = 'http://www.w3.org/2000/svg';

  }

  initialize(id) {

    this.__dom = document.getElementById(id);

    // Create wrapper group to make (0, 0) always be center of the screen
    this.world = document.createElementNS(this.xmlns, 'g');
    this.__dom.appendChild(this.world);

    this.setSvgSize();

    window.addEventListener('resize', this.onResize.bind(this));

  }

  setSvgSize(width, height) {

    this.width = width || window.innerWidth;
    this.height = height || window.innerHeight;

    this.__dom.style.width = this.width + 'px';
    this.__dom.style.height = this.height + 'px';

    this.world.setAttributeNS(null, 'transform', `translate(${this.width / 2}, ${this.height / 2})`);

  }

  onResize() {

    this.setSvgSize();

  }

}

export default new Svg();