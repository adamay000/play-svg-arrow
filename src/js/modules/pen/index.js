import svg from '../../models/svg.js';
import Point from '../../models/point.js';
import Line from '../../models/line.js';

import Drawer from './drawer.js';

class Pen {

  constructor() {

    this.__drawer = new Drawer();

    this.__enabled = false;
    this.__dragging = false;

    this.__line = new Line();
    this.__lastPoint = null;

    this.__minDistance = 100;

    window.addEventListener('mousedown', this.__onMousePress.bind(this));
    window.addEventListener('mousemove', this.__onMouseMove.bind(this));
    window.addEventListener('mouseup', this.__onMouseRelease.bind(this));

  }

  __clear () {

    this.__lastPoint = new Point(9999, 9999);
    this.__line.clear();

    this.__drawer.clear();

  }

  __addPoint(point) {

    if (point.getDistance(this.__lastPoint) > this.__minDistance) {

      this.__line.append(this.__lastPoint = point);

      this.__drawer.addPoint(point);
      //this.__drawer.setPath(this.__line.getCurvedPath());
      this.__drawer.setPath(this.__line.getPath());

    }

  }

  __done() {

    this.onDrawEnd(this.__line);

  }

  onDrawStart() {}

  onDrawEnd() {}

  __onMousePress(event) {

    if (!this.__enabled || this.__dragging) {

      return;

    }

    this.__dragging = true;

    this.onDrawStart();

    this.__clear();
    this.__addPoint(new Point(event.clientX - svg.width / 2, event.clientY - svg.height / 2));

  }

  __onMouseRelease(event) {

    if (!this.__enabled || !this.__dragging) {

      return;

    }

    this.__dragging = false;

    this.__addPoint(new Point(event.clientX - svg.width / 2, event.clientY - svg.height / 2));
    this.__done();

  }

  __onMouseMove(event) {

    if (!this.__enabled || !this.__dragging) {

      return;

    }

    this.__addPoint(new Point(event.clientX - svg.width / 2, event.clientY - svg.height / 2));

  }

  enable() {

    this.__enabled = true;

  }

  disable() {

    this.__enabled = false;

  }

  setPointInterval(minDistance) {

    this.__minDistance = minDistance;

  }

}

export default Pen;