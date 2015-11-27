import svg from '../../models/svg.js';

class Drawer {

  constructor() {

    this.__size = 2;
    this.__stroke = '#a9a9a9';
    this.__fill = 'none';

    this.__line = '#cccccc';

    this.__group = document.createElementNS(svg.xmlns, 'g');

    this.clear();

    svg.world.appendChild(this.__group);

  }

  clear() {

    var child = null;
    while (child = this.__group.firstChild) {

      this.__group.removeChild(child);

    }

    this.__points = [];
    this.__path = document.createElementNS(svg.xmlns, 'path');
    this.__path.setAttributeNS(null, 'stroke', this.__line);
    this.__path.setAttributeNS(null, 'stroke-width', 1);
    this.__path.setAttributeNS(null, 'fill', 'none');
    this.__group.appendChild(this.__path);

  }

  addPoint(point) {

    console.log('add', point);

    this.__points.push(point);

    var circle = document.createElementNS(svg.xmlns, 'circle');
    circle.setAttributeNS(null, 'cx', point.x);
    circle.setAttributeNS(null, 'cy', point.y);
    circle.setAttributeNS(null, 'r', this.__size);
    circle.setAttributeNS(null, 'stroke', this.__stroke);
    circle.setAttributeNS(null, 'fill', this.__fill);
    circle.setAttributeNS(null, 'stroke-width', 1);

    this.__group.appendChild(circle);

  }

  setPath(path) {

    this.__path.setAttributeNS(null, 'd', path);

  }

}

export default Drawer;