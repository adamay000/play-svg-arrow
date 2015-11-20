class Point {

  constructor(x = 0, y = 0) {

    this.x = x;
    this.y = y;

  }

  get xy() {

    return `${this.x},${this.y}`;

  }

  clone() {

    return new Point(this.x, this.y);

  }

  getVector(point) {

    var x = point.x - this.x
      , y = point.y - this.y;

    return new Point(x, y);

  }

  normalize() {

    var len = getDistance(0, 0, this.x, this.y)
      , x = this.x / len
      , y = this.y / len;

    return new Point(x, y);

  }

  getDistance(point) {

    return getDistance(point.x, point.y, this.x, this.y)

  }

}

function getDistance(x1, y1, x2, y2) {

  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

}

export default Point;