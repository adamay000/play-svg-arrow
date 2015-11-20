import Point from './point.js';

class Line {

  constructor() {

    this.__points = [];
    this.defaultCurveLevel = 50;

  }

  append(point) {

    this.__points.push(point);

    return this.__points.length;

  }

  prepend(point) {

    this.__points.unshift(point);

    return this.__points.length;

  }

  getPoints() {

    return this.__points;

  }

  getPath() {

    return this.__points.map(function(point) {
      return `L ${point.xy}`;
    }).join(' ').replace(/L/, 'M');

  }

  getCurvedPath(curveLevel) {

    var curveLevel = curveLevel || this.defaultCurveLevel;

    if (this.__points.length < 3) {

      return this.getPath();

    }

    var points = this.__points
      , lastIdx = points.length - 1;

    var curve = this.__points.map(function(point, idx) {

      if (idx === lastIdx) {

        return '';

      }

      var prevPoint = idx === 0 ? point : points[idx - 1]
        , nextPoint = points[idx + 1]
        , nextNextPoint = idx === lastIdx - 1 ? nextPoint : points[idx + 2]
        , prevVector = idx === 0 ? new Point(0, 0) : prevPoint.getVector(nextPoint).normalize()
        , nextVector = idx === lastIdx - 1 ? new Point(0, 0) : nextNextPoint.getVector(point).normalize();

      return `C ${prevPoint.x + prevVector.x * curveLevel},${prevPoint.y + prevVector.y * curveLevel} ${point.x + nextVector.x * curveLevel},${point.y + nextVector.y * curveLevel} ${point.xy}`;

    }).join(' ');

    return `M ${this.__points[0].xy} ${curve} `;

  }

}

export default Line;