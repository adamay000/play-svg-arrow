(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _svg = require('./models/svg.js');

var _svg2 = _interopRequireDefault(_svg);

var _point = require('./models/point.js');

var _point2 = _interopRequireDefault(_point);

var _line = require('./models/line.js');

var _line2 = _interopRequireDefault(_line);

var _index = require('./modules/animate-on-path/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {

  _svg2.default.initialize('svg');

  var line = new _line2.default();

  var size = 400;
  for (var i = 0; i < 10; i++) {

    var x = Math.random() * size * 2 - size,
        y = Math.random() * size - size / 2;
    line.append(new _point2.default(x, y));
  }

  //line.append(new Point(-300, -150));
  //line.append(new Point(-100, 0));
  //line.append(new Point(-200, 50));
  //line.append(new Point(0, 10));
  //line.append(new Point(300, -100));
  //line.append(new Point(100, 0));
  //line.append(new Point(200, 100));

  var path = document.createElementNS(_svg2.default.xmlns, 'path');
  path.setAttributeNS(null, 'stroke', '#cccccc');
  path.setAttributeNS(null, 'stroke-width', 1);
  path.setAttributeNS(null, 'fill', 'none');
  path.setAttributeNS(null, 'd', line.getPath());
  path.setAttributeNS(null, 'd', line.getCurvedPath());
  _svg2.default.world.appendChild(path);

  var aop = new _index2.default(path, 'Animate text along the line', {
    duration: 2000
  });
  aop.start();
  window.aop = aop;

  document.getElementById('button-start').addEventListener('click', aop.start.bind(aop));
  document.getElementById('button-restart').addEventListener('click', aop.restart.bind(aop));
  document.getElementById('button-pause').addEventListener('click', aop.pause.bind(aop));
  document.getElementById('button-stop').addEventListener('click', aop.stop.bind(aop));
})();

},{"./models/line.js":2,"./models/point.js":3,"./models/svg.js":4,"./modules/animate-on-path/index.js":5}],2:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _point = require('./point.js');

var _point2 = _interopRequireDefault(_point);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Line = (function () {
  function Line() {
    _classCallCheck(this, Line);

    this.__points = [];
    this.defaultCurveLevel = 50;
  }

  _createClass(Line, [{
    key: 'append',
    value: function append(point) {

      this.__points.push(point);

      return this.__points.length;
    }
  }, {
    key: 'prepend',
    value: function prepend(point) {

      this.__points.unshift(point);

      return this.__points.length;
    }
  }, {
    key: 'getPoints',
    value: function getPoints() {

      return this.__points;
    }
  }, {
    key: 'getPath',
    value: function getPath() {

      return this.__points.map(function (point) {
        return 'L ' + point.xy;
      }).join(' ').replace(/L/, 'M');
    }
  }, {
    key: 'getCurvedPath',
    value: function getCurvedPath(curveLevel) {

      var curveLevel = curveLevel || this.defaultCurveLevel;

      if (this.__points.length < 3) {

        return this.getPath();
      }

      var points = this.__points,
          lastIdx = points.length - 1;

      var curve = this.__points.map(function (point, idx) {

        if (idx === lastIdx) {

          return '';
        }

        var prevPoint = idx === 0 ? point : points[idx - 1],
            nextPoint = points[idx + 1],
            nextNextPoint = idx === lastIdx - 1 ? nextPoint : points[idx + 2],
            prevVector = idx === 0 ? new _point2.default(0, 0) : prevPoint.getVector(nextPoint).normalize(),
            nextVector = idx === lastIdx - 1 ? new _point2.default(0, 0) : nextNextPoint.getVector(point).normalize();

        return 'C ' + (prevPoint.x + prevVector.x * curveLevel) + ',' + (prevPoint.y + prevVector.y * curveLevel) + ' ' + (point.x + nextVector.x * curveLevel) + ',' + (point.y + nextVector.y * curveLevel) + ' ' + point.xy;
      }).join(' ');

      return 'M ' + this.__points[0].xy + ' ' + curve + ' ';
    }
  }]);

  return Line;
})();

exports.default = Line;

},{"./point.js":3}],3:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Point = (function () {
  function Point() {
    var x = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
    var y = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

    _classCallCheck(this, Point);

    this.x = x;
    this.y = y;
  }

  _createClass(Point, [{
    key: "clone",
    value: function clone() {

      return new Point(this.x, this.y);
    }
  }, {
    key: "getVector",
    value: function getVector(point) {

      var x = point.x - this.x,
          y = point.y - this.y;

      return new Point(x, y);
    }
  }, {
    key: "normalize",
    value: function normalize() {

      var len = _getDistance(0, 0, this.x, this.y),
          x = this.x / len,
          y = this.y / len;

      return new Point(x, y);
    }
  }, {
    key: "getDistance",
    value: function getDistance(point) {

      return _getDistance(point.x, point.y, this.x, this.y);
    }
  }, {
    key: "xy",
    get: function get() {

      return this.x + "," + this.y;
    }
  }]);

  return Point;
})();

function _getDistance(x1, y1, x2, y2) {

  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

exports.default = Point;

},{}],4:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Svg = (function () {
  function Svg() {
    _classCallCheck(this, Svg);

    this.xmlns = 'http://www.w3.org/2000/svg';
  }

  _createClass(Svg, [{
    key: 'initialize',
    value: function initialize(id) {

      this.__dom = document.getElementById(id);

      // Create wrapper group to make (0, 0) always be center of the screen
      this.world = document.createElementNS(this.xmlns, 'g');
      this.__dom.appendChild(this.world);

      this.setSvgSize();

      window.addEventListener('resize', this.onResize.bind(this));
    }
  }, {
    key: 'setSvgSize',
    value: function setSvgSize(width, height) {

      this.width = width || window.innerWidth;
      this.height = height || window.innerHeight;

      this.__dom.style.width = this.width + 'px';
      this.__dom.style.height = this.height + 'px';

      this.world.setAttributeNS(null, 'transform', 'translate(' + this.width / 2 + ', ' + this.height / 2 + ')');
    }
  }, {
    key: 'onResize',
    value: function onResize() {

      this.setSvgSize();
    }
  }]);

  return Svg;
})();

exports.default = new Svg();

},{}],5:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _svg = require('../../models/svg.js');

var _svg2 = _interopRequireDefault(_svg);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AnimateOnPath = (function () {
  function AnimateOnPath(pathElement, message) {
    var params = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    _classCallCheck(this, AnimateOnPath);

    this.__pathElement = pathElement;
    this.__totalLength = pathElement.getTotalLength();
    this.__message = message.split('');
    this.__texts = [];

    this.__isRunning = false;
    this.__progress = 0;
    this.__lastTimeStamp = 0;
    this.__duration = params.duration || 1000;

    this.__textSize = params.textSize || 13;
    this.__letterSpacing = params.letterSpacing || 4;
    this.__textLength = this.__textSize + this.__letterSpacing;

    this.createMessage();
  }

  _createClass(AnimateOnPath, [{
    key: 'createMessage',
    value: function createMessage() {

      var self = this;
      this.__message.forEach(function (str) {

        var text = document.createElementNS(_svg2.default.xmlns, 'text');
        text.style.opacity = 1;
        text.style.fontSize = self.__textSize;
        text.innerHTML = str;
        _svg2.default.world.appendChild(text);

        self.__texts.push(text);
      });
    }
  }, {
    key: 'render',
    value: function render() {

      var self = this,
          currentLength = this.__totalLength * this.__progress;

      this.__texts.forEach(function (text, idx) {

        var textAtLength = currentLength - idx * self.__textLength;

        if (textAtLength <= 0) {

          text.style.opacity = 0;
          return;
        }

        text.style.opacity = 1;

        var point = self.__pathElement.getPointAtLength(textAtLength);
        //, lastPoint = self.__pathElement.getPointAtLength(textAtLength - 1)
        //, angle = Math.atan2(point.y - lastPoint.y, point.x - lastPoint.x) * 180 / Math.PI;
        text.setAttributeNS(null, 'x', point.x);
        text.setAttributeNS(null, 'y', point.y);
        //text.setAttributeNS(null, 'transform', `translate(${point.x}, ${point.y}) rotate(${angle}, ${self.__textSize / 2}, ${self.__textSize / 2})`);
      });
    }
  }, {
    key: 'start',
    value: function start() {

      if (this.__isRunning || this.__progress >= 1) {

        return;
      }

      this.__isRunning = true;
      this.__lastTimeStamp = timestamp();

      this.animate();
    }
  }, {
    key: 'restart',
    value: function restart() {

      this.stop();
      this.start();
    }
  }, {
    key: 'pause',
    value: function pause() {

      if (!this.__isRunning) {

        return;
      }

      this.__isRunning = false;
    }
  }, {
    key: 'stop',
    value: function stop() {

      this.__isRunning = false;
      this.__progress = 0;
      this.render();
    }
  }, {
    key: 'animate',
    value: function animate() {

      if (!this.__isRunning) {

        return;
      }

      var changed = timestamp() - this.__lastTimeStamp;
      this.__lastTimeStamp = timestamp();

      this.__progress += changed / this.__duration;
      this.__progress > 1 && (this.__progress = 1);

      this.render();

      if (this.__progress === 1) {

        this.pause();
        return;
      }

      requestAnimationFrame(this.animate.bind(this));
    }
  }, {
    key: 'setProgress',
    value: function setProgress(progress) {

      this.__progress = progress;
    }
  }]);

  return AnimateOnPath;
})();

function timestamp() {

  return +new Date();
}

exports.default = AnimateOnPath;

},{"../../models/svg.js":4}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvaW5kZXguanMiLCJzcmMvanMvbW9kZWxzL2xpbmUuanMiLCJzcmMvanMvbW9kZWxzL3BvaW50LmpzIiwic3JjL2pzL21vZGVscy9zdmcuanMiLCJzcmMvanMvbW9kdWxlcy9hbmltYXRlLW9uLXBhdGgvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ01BLENBQUMsWUFBVzs7QUFFVixnQkFBSSxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRXRCLE1BQUksSUFBSSxHQUFHLG9CQUFVLENBQUM7O0FBRXRCLE1BQUksSUFBSSxHQUFHLEdBQUcsQ0FBQztBQUNmLE9BQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7O0FBRTNCLFFBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLElBQUk7UUFDbkMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQztBQUN4QyxRQUFJLENBQUMsTUFBTSxDQUFDLG9CQUFVLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0dBRTlCOzs7Ozs7Ozs7O0FBQUEsQUFVRCxNQUFJLElBQUksR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLGNBQUksS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ3ZELE1BQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUMvQyxNQUFJLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxjQUFjLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDN0MsTUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQzFDLE1BQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztBQUMvQyxNQUFJLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUM7QUFDckQsZ0JBQUksS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFNUIsTUFBSSxHQUFHLEdBQUcsb0JBQWtCLElBQUksRUFBRSw2QkFBNkIsRUFBRTtBQUMvRCxZQUFRLEVBQUUsSUFBSTtHQUNmLENBQUMsQ0FBQztBQUNILEtBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUNaLFFBQU0sQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDOztBQUVqQixVQUFRLENBQUMsY0FBYyxDQUFDLGNBQWMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ3ZGLFVBQVEsQ0FBQyxjQUFjLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUMzRixVQUFRLENBQUMsY0FBYyxDQUFDLGNBQWMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ3ZGLFVBQVEsQ0FBQyxjQUFjLENBQUMsYUFBYSxDQUFDLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Q0FFdEYsQ0FBQSxFQUFHLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUM5Q0MsSUFBSTtBQUVSLFdBRkksSUFBSSxHQUVNOzBCQUZWLElBQUk7O0FBSU4sUUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7QUFDbkIsUUFBSSxDQUFDLGlCQUFpQixHQUFHLEVBQUUsQ0FBQztHQUU3Qjs7ZUFQRyxJQUFJOzsyQkFTRCxLQUFLLEVBQUU7O0FBRVosVUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRTFCLGFBQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7S0FFN0I7Ozs0QkFFTyxLQUFLLEVBQUU7O0FBRWIsVUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRTdCLGFBQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7S0FFN0I7OztnQ0FFVzs7QUFFVixhQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7S0FFdEI7Ozs4QkFFUzs7QUFFUixhQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQVMsS0FBSyxFQUFFO0FBQ3ZDLHNCQUFZLEtBQUssQ0FBQyxFQUFFLENBQUc7T0FDeEIsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0tBRWhDOzs7a0NBRWEsVUFBVSxFQUFFOztBQUV4QixVQUFJLFVBQVUsR0FBRyxVQUFVLElBQUksSUFBSSxDQUFDLGlCQUFpQixDQUFDOztBQUV0RCxVQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTs7QUFFNUIsZUFBTyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7T0FFdkI7O0FBRUQsVUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLFFBQVE7VUFDdEIsT0FBTyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDOztBQUVoQyxVQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFTLEtBQUssRUFBRSxHQUFHLEVBQUU7O0FBRWpELFlBQUksR0FBRyxLQUFLLE9BQU8sRUFBRTs7QUFFbkIsaUJBQU8sRUFBRSxDQUFDO1NBRVg7O0FBRUQsWUFBSSxTQUFTLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxLQUFLLEdBQUcsTUFBTSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7WUFDL0MsU0FBUyxHQUFHLE1BQU0sQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO1lBQzNCLGFBQWEsR0FBRyxHQUFHLEtBQUssT0FBTyxHQUFHLENBQUMsR0FBRyxTQUFTLEdBQUcsTUFBTSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7WUFDakUsVUFBVSxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsb0JBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsU0FBUyxFQUFFO1lBQ3JGLFVBQVUsR0FBRyxHQUFHLEtBQUssT0FBTyxHQUFHLENBQUMsR0FBRyxvQkFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsYUFBYSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQzs7QUFFcEcsdUJBQVksU0FBUyxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQSxVQUFJLFNBQVMsQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUEsVUFBSSxLQUFLLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFBLFVBQUksS0FBSyxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQSxTQUFJLEtBQUssQ0FBQyxFQUFFLENBQUc7T0FFNUwsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQzs7QUFFYixvQkFBWSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsU0FBSSxLQUFLLE9BQUk7S0FFN0M7OztTQXhFRyxJQUFJOzs7a0JBNEVLLElBQUk7Ozs7Ozs7Ozs7Ozs7SUM5RWIsS0FBSztBQUVULFdBRkksS0FBSyxHQUVpQjtRQUFkLENBQUMseURBQUcsQ0FBQztRQUFFLENBQUMseURBQUcsQ0FBQzs7MEJBRnBCLEtBQUs7O0FBSVAsUUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDWCxRQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztHQUVaOztlQVBHLEtBQUs7OzRCQWVEOztBQUVOLGFBQU8sSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FFbEM7Ozs4QkFFUyxLQUFLLEVBQUU7O0FBRWYsVUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQztVQUNwQixDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDOztBQUV6QixhQUFPLElBQUksS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztLQUV4Qjs7O2dDQUVXOztBQUVWLFVBQUksR0FBRyxHQUFHLFlBQVcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztVQUN2QyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxHQUFHO1VBQ2hCLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQzs7QUFFckIsYUFBTyxJQUFJLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FFeEI7OztnQ0FFVyxLQUFLLEVBQUU7O0FBRWpCLGFBQU8sWUFBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtLQUVyRDs7O3dCQW5DUTs7QUFFUCxhQUFVLElBQUksQ0FBQyxDQUFDLFNBQUksSUFBSSxDQUFDLENBQUMsQ0FBRztLQUU5Qjs7O1NBYkcsS0FBSzs7O0FBZ0RYLFNBQVMsWUFBVyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTs7QUFFbkMsU0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztDQUUvRDs7a0JBRWMsS0FBSzs7Ozs7Ozs7Ozs7OztJQ3REZCxHQUFHO0FBRVAsV0FGSSxHQUFHLEdBRU87MEJBRlYsR0FBRzs7QUFJTCxRQUFJLENBQUMsS0FBSyxHQUFHLDRCQUE0QixDQUFDO0dBRTNDOztlQU5HLEdBQUc7OytCQVFJLEVBQUUsRUFBRTs7QUFFYixVQUFJLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDOzs7QUFBQyxBQUd6QyxVQUFJLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztBQUN2RCxVQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRW5DLFVBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQzs7QUFFbEIsWUFBTSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0tBRTdEOzs7K0JBRVUsS0FBSyxFQUFFLE1BQU0sRUFBRTs7QUFFeEIsVUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLElBQUksTUFBTSxDQUFDLFVBQVUsQ0FBQztBQUN4QyxVQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sSUFBSSxNQUFNLENBQUMsV0FBVyxDQUFDOztBQUUzQyxVQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7QUFDM0MsVUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDOztBQUU3QyxVQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsV0FBVyxpQkFBZSxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsVUFBSyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsT0FBSSxDQUFDO0tBRWxHOzs7K0JBRVU7O0FBRVQsVUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0tBRW5COzs7U0F0Q0csR0FBRzs7O2tCQTBDTSxJQUFJLEdBQUcsRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQ3hDbEIsYUFBYTtBQUVqQixXQUZJLGFBQWEsQ0FFTCxXQUFXLEVBQUUsT0FBTyxFQUFlO1FBQWIsTUFBTSx5REFBRyxFQUFFOzswQkFGekMsYUFBYTs7QUFJZixRQUFJLENBQUMsYUFBYSxHQUFHLFdBQVcsQ0FBQztBQUNqQyxRQUFJLENBQUMsYUFBYSxHQUFHLFdBQVcsQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUNsRCxRQUFJLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDbkMsUUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7O0FBRWxCLFFBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO0FBQ3pCLFFBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDO0FBQ3BCLFFBQUksQ0FBQyxlQUFlLEdBQUcsQ0FBQyxDQUFDO0FBQ3pCLFFBQUksQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUM7O0FBRTFDLFFBQUksQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDLFFBQVEsSUFBSSxFQUFFLENBQUM7QUFDeEMsUUFBSSxDQUFDLGVBQWUsR0FBRyxNQUFNLENBQUMsYUFBYSxJQUFJLENBQUMsQ0FBQztBQUNqRCxRQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQzs7QUFFM0QsUUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO0dBRXRCOztlQXBCRyxhQUFhOztvQ0FzQkQ7O0FBRWQsVUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2hCLFVBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFVBQVMsR0FBRyxFQUFFOztBQUVuQyxZQUFJLElBQUksR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLGNBQUksS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ3ZELFlBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQztBQUN2QixZQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDO0FBQ3RDLFlBQUksQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDO0FBQ3JCLHNCQUFJLEtBQUssQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRTVCLFlBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO09BRXpCLENBQUMsQ0FBQztLQUVKOzs7NkJBRVE7O0FBRVAsVUFBSSxJQUFJLEdBQUcsSUFBSTtVQUNYLGFBQWEsR0FBRyxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7O0FBRXpELFVBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFVBQVMsSUFBSSxFQUFFLEdBQUcsRUFBRTs7QUFFdkMsWUFBSSxZQUFZLEdBQUcsYUFBYSxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDOztBQUUzRCxZQUFJLFlBQVksSUFBSSxDQUFDLEVBQUU7O0FBRXJCLGNBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQztBQUN2QixpQkFBTztTQUVSOztBQUVELFlBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQzs7QUFFdkIsWUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUM7OztBQUFDLEFBRzlELFlBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDeEMsWUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7O09BR3hDLENBQUMsQ0FBQztBQUh1QyxLQUszQzs7OzRCQUVPOztBQUVOLFVBQUksSUFBSSxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsVUFBVSxJQUFJLENBQUMsRUFBRTs7QUFFNUMsZUFBTztPQUVSOztBQUVELFVBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO0FBQ3hCLFVBQUksQ0FBQyxlQUFlLEdBQUcsU0FBUyxFQUFFLENBQUM7O0FBRW5DLFVBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztLQUVoQjs7OzhCQUVTOztBQUVSLFVBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNaLFVBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztLQUVkOzs7NEJBRU87O0FBRU4sVUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUU7O0FBRXJCLGVBQU87T0FFUjs7QUFFRCxVQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztLQUUxQjs7OzJCQUVNOztBQUVMLFVBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO0FBQ3pCLFVBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDO0FBQ3BCLFVBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztLQUVmOzs7OEJBRVM7O0FBRVIsVUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUU7O0FBRXJCLGVBQU87T0FFUjs7QUFFRCxVQUFJLE9BQU8sR0FBRyxTQUFTLEVBQUUsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDO0FBQ2pELFVBQUksQ0FBQyxlQUFlLEdBQUcsU0FBUyxFQUFFLENBQUM7O0FBRW5DLFVBQUksQ0FBQyxVQUFVLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7QUFDN0MsVUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLEtBQUssSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUEsQUFBQyxDQUFDOztBQUU3QyxVQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7O0FBRWQsVUFBSSxJQUFJLENBQUMsVUFBVSxLQUFLLENBQUMsRUFBRTs7QUFFekIsWUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQ2IsZUFBTztPQUVSOztBQUVELDJCQUFxQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7S0FHaEQ7OztnQ0FFVyxRQUFRLEVBQUU7O0FBRXBCLFVBQUksQ0FBQyxVQUFVLEdBQUcsUUFBUSxDQUFDO0tBRTVCOzs7U0E5SUcsYUFBYTs7O0FBa0puQixTQUFTLFNBQVMsR0FBRzs7QUFFbkIsU0FBTyxDQUFDLElBQUksSUFBSSxFQUFFLENBQUM7Q0FFcEI7O2tCQUVjLGFBQWEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IHN2ZyBmcm9tICcuL21vZGVscy9zdmcuanMnO1xuaW1wb3J0IFBvaW50IGZyb20gJy4vbW9kZWxzL3BvaW50LmpzJztcbmltcG9ydCBMaW5lIGZyb20gJy4vbW9kZWxzL2xpbmUuanMnO1xuXG5pbXBvcnQgQW5pbWF0ZU9uUGF0aCBmcm9tICcuL21vZHVsZXMvYW5pbWF0ZS1vbi1wYXRoL2luZGV4LmpzJztcblxuKGZ1bmN0aW9uKCkge1xuXG4gIHN2Zy5pbml0aWFsaXplKCdzdmcnKTtcblxuICB2YXIgbGluZSA9IG5ldyBMaW5lKCk7XG5cbiAgdmFyIHNpemUgPSA0MDA7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgMTA7IGkrKykge1xuXG4gICAgbGV0IHggPSBNYXRoLnJhbmRvbSgpICogc2l6ZSAqIDIgLSBzaXplXG4gICAgICAsIHkgPSBNYXRoLnJhbmRvbSgpICogc2l6ZSAtIHNpemUgLyAyO1xuICAgIGxpbmUuYXBwZW5kKG5ldyBQb2ludCh4LCB5KSk7XG5cbiAgfVxuXG4gIC8vbGluZS5hcHBlbmQobmV3IFBvaW50KC0zMDAsIC0xNTApKTtcbiAgLy9saW5lLmFwcGVuZChuZXcgUG9pbnQoLTEwMCwgMCkpO1xuICAvL2xpbmUuYXBwZW5kKG5ldyBQb2ludCgtMjAwLCA1MCkpO1xuICAvL2xpbmUuYXBwZW5kKG5ldyBQb2ludCgwLCAxMCkpO1xuICAvL2xpbmUuYXBwZW5kKG5ldyBQb2ludCgzMDAsIC0xMDApKTtcbiAgLy9saW5lLmFwcGVuZChuZXcgUG9pbnQoMTAwLCAwKSk7XG4gIC8vbGluZS5hcHBlbmQobmV3IFBvaW50KDIwMCwgMTAwKSk7XG5cbiAgdmFyIHBhdGggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoc3ZnLnhtbG5zLCAncGF0aCcpO1xuICBwYXRoLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzdHJva2UnLCAnI2NjY2NjYycpO1xuICBwYXRoLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzdHJva2Utd2lkdGgnLCAxKTtcbiAgcGF0aC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnZmlsbCcsICdub25lJyk7XG4gIHBhdGguc2V0QXR0cmlidXRlTlMobnVsbCwgJ2QnLCBsaW5lLmdldFBhdGgoKSk7XG4gIHBhdGguc2V0QXR0cmlidXRlTlMobnVsbCwgJ2QnLCBsaW5lLmdldEN1cnZlZFBhdGgoKSk7XG4gIHN2Zy53b3JsZC5hcHBlbmRDaGlsZChwYXRoKTtcblxuICB2YXIgYW9wID0gbmV3IEFuaW1hdGVPblBhdGgocGF0aCwgJ0FuaW1hdGUgdGV4dCBhbG9uZyB0aGUgbGluZScsIHtcbiAgICBkdXJhdGlvbjogMjAwMFxuICB9KTtcbiAgYW9wLnN0YXJ0KCk7XG4gIHdpbmRvdy5hb3AgPSBhb3A7XG5cbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2J1dHRvbi1zdGFydCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYW9wLnN0YXJ0LmJpbmQoYW9wKSk7XG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdidXR0b24tcmVzdGFydCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYW9wLnJlc3RhcnQuYmluZChhb3ApKTtcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2J1dHRvbi1wYXVzZScpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYW9wLnBhdXNlLmJpbmQoYW9wKSk7XG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdidXR0b24tc3RvcCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYW9wLnN0b3AuYmluZChhb3ApKTtcblxufSkoKTsiLCJpbXBvcnQgUG9pbnQgZnJvbSAnLi9wb2ludC5qcyc7XG5cbmNsYXNzIExpbmUge1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgdGhpcy5fX3BvaW50cyA9IFtdO1xuICAgIHRoaXMuZGVmYXVsdEN1cnZlTGV2ZWwgPSA1MDtcblxuICB9XG5cbiAgYXBwZW5kKHBvaW50KSB7XG5cbiAgICB0aGlzLl9fcG9pbnRzLnB1c2gocG9pbnQpO1xuXG4gICAgcmV0dXJuIHRoaXMuX19wb2ludHMubGVuZ3RoO1xuXG4gIH1cblxuICBwcmVwZW5kKHBvaW50KSB7XG5cbiAgICB0aGlzLl9fcG9pbnRzLnVuc2hpZnQocG9pbnQpO1xuXG4gICAgcmV0dXJuIHRoaXMuX19wb2ludHMubGVuZ3RoO1xuXG4gIH1cblxuICBnZXRQb2ludHMoKSB7XG5cbiAgICByZXR1cm4gdGhpcy5fX3BvaW50cztcblxuICB9XG5cbiAgZ2V0UGF0aCgpIHtcblxuICAgIHJldHVybiB0aGlzLl9fcG9pbnRzLm1hcChmdW5jdGlvbihwb2ludCkge1xuICAgICAgcmV0dXJuIGBMICR7cG9pbnQueHl9YDtcbiAgICB9KS5qb2luKCcgJykucmVwbGFjZSgvTC8sICdNJyk7XG5cbiAgfVxuXG4gIGdldEN1cnZlZFBhdGgoY3VydmVMZXZlbCkge1xuXG4gICAgdmFyIGN1cnZlTGV2ZWwgPSBjdXJ2ZUxldmVsIHx8IHRoaXMuZGVmYXVsdEN1cnZlTGV2ZWw7XG5cbiAgICBpZiAodGhpcy5fX3BvaW50cy5sZW5ndGggPCAzKSB7XG5cbiAgICAgIHJldHVybiB0aGlzLmdldFBhdGgoKTtcblxuICAgIH1cblxuICAgIHZhciBwb2ludHMgPSB0aGlzLl9fcG9pbnRzXG4gICAgICAsIGxhc3RJZHggPSBwb2ludHMubGVuZ3RoIC0gMTtcblxuICAgIHZhciBjdXJ2ZSA9IHRoaXMuX19wb2ludHMubWFwKGZ1bmN0aW9uKHBvaW50LCBpZHgpIHtcblxuICAgICAgaWYgKGlkeCA9PT0gbGFzdElkeCkge1xuXG4gICAgICAgIHJldHVybiAnJztcblxuICAgICAgfVxuXG4gICAgICB2YXIgcHJldlBvaW50ID0gaWR4ID09PSAwID8gcG9pbnQgOiBwb2ludHNbaWR4IC0gMV1cbiAgICAgICAgLCBuZXh0UG9pbnQgPSBwb2ludHNbaWR4ICsgMV1cbiAgICAgICAgLCBuZXh0TmV4dFBvaW50ID0gaWR4ID09PSBsYXN0SWR4IC0gMSA/IG5leHRQb2ludCA6IHBvaW50c1tpZHggKyAyXVxuICAgICAgICAsIHByZXZWZWN0b3IgPSBpZHggPT09IDAgPyBuZXcgUG9pbnQoMCwgMCkgOiBwcmV2UG9pbnQuZ2V0VmVjdG9yKG5leHRQb2ludCkubm9ybWFsaXplKClcbiAgICAgICAgLCBuZXh0VmVjdG9yID0gaWR4ID09PSBsYXN0SWR4IC0gMSA/IG5ldyBQb2ludCgwLCAwKSA6IG5leHROZXh0UG9pbnQuZ2V0VmVjdG9yKHBvaW50KS5ub3JtYWxpemUoKTtcblxuICAgICAgcmV0dXJuIGBDICR7cHJldlBvaW50LnggKyBwcmV2VmVjdG9yLnggKiBjdXJ2ZUxldmVsfSwke3ByZXZQb2ludC55ICsgcHJldlZlY3Rvci55ICogY3VydmVMZXZlbH0gJHtwb2ludC54ICsgbmV4dFZlY3Rvci54ICogY3VydmVMZXZlbH0sJHtwb2ludC55ICsgbmV4dFZlY3Rvci55ICogY3VydmVMZXZlbH0gJHtwb2ludC54eX1gO1xuXG4gICAgfSkuam9pbignICcpO1xuXG4gICAgcmV0dXJuIGBNICR7dGhpcy5fX3BvaW50c1swXS54eX0gJHtjdXJ2ZX0gYDtcblxuICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgTGluZTsiLCJjbGFzcyBQb2ludCB7XG5cbiAgY29uc3RydWN0b3IoeCA9IDAsIHkgPSAwKSB7XG5cbiAgICB0aGlzLnggPSB4O1xuICAgIHRoaXMueSA9IHk7XG5cbiAgfVxuXG4gIGdldCB4eSgpIHtcblxuICAgIHJldHVybiBgJHt0aGlzLnh9LCR7dGhpcy55fWA7XG5cbiAgfVxuXG4gIGNsb25lKCkge1xuXG4gICAgcmV0dXJuIG5ldyBQb2ludCh0aGlzLngsIHRoaXMueSk7XG5cbiAgfVxuXG4gIGdldFZlY3Rvcihwb2ludCkge1xuXG4gICAgdmFyIHggPSBwb2ludC54IC0gdGhpcy54XG4gICAgICAsIHkgPSBwb2ludC55IC0gdGhpcy55O1xuXG4gICAgcmV0dXJuIG5ldyBQb2ludCh4LCB5KTtcblxuICB9XG5cbiAgbm9ybWFsaXplKCkge1xuXG4gICAgdmFyIGxlbiA9IGdldERpc3RhbmNlKDAsIDAsIHRoaXMueCwgdGhpcy55KVxuICAgICAgLCB4ID0gdGhpcy54IC8gbGVuXG4gICAgICAsIHkgPSB0aGlzLnkgLyBsZW47XG5cbiAgICByZXR1cm4gbmV3IFBvaW50KHgsIHkpO1xuXG4gIH1cblxuICBnZXREaXN0YW5jZShwb2ludCkge1xuXG4gICAgcmV0dXJuIGdldERpc3RhbmNlKHBvaW50LngsIHBvaW50LnksIHRoaXMueCwgdGhpcy55KVxuXG4gIH1cblxufVxuXG5mdW5jdGlvbiBnZXREaXN0YW5jZSh4MSwgeTEsIHgyLCB5Mikge1xuXG4gIHJldHVybiBNYXRoLnNxcnQoTWF0aC5wb3coeDIgLSB4MSwgMikgKyBNYXRoLnBvdyh5MiAtIHkxLCAyKSk7XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgUG9pbnQ7IiwiY2xhc3MgU3ZnIHtcblxuICBjb25zdHJ1Y3RvcigpIHtcblxuICAgIHRoaXMueG1sbnMgPSAnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnO1xuXG4gIH1cblxuICBpbml0aWFsaXplKGlkKSB7XG5cbiAgICB0aGlzLl9fZG9tID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuXG4gICAgLy8gQ3JlYXRlIHdyYXBwZXIgZ3JvdXAgdG8gbWFrZSAoMCwgMCkgYWx3YXlzIGJlIGNlbnRlciBvZiB0aGUgc2NyZWVuXG4gICAgdGhpcy53b3JsZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLnhtbG5zLCAnZycpO1xuICAgIHRoaXMuX19kb20uYXBwZW5kQ2hpbGQodGhpcy53b3JsZCk7XG5cbiAgICB0aGlzLnNldFN2Z1NpemUoKTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLm9uUmVzaXplLmJpbmQodGhpcykpO1xuXG4gIH1cblxuICBzZXRTdmdTaXplKHdpZHRoLCBoZWlnaHQpIHtcblxuICAgIHRoaXMud2lkdGggPSB3aWR0aCB8fCB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICB0aGlzLmhlaWdodCA9IGhlaWdodCB8fCB3aW5kb3cuaW5uZXJIZWlnaHQ7XG5cbiAgICB0aGlzLl9fZG9tLnN0eWxlLndpZHRoID0gdGhpcy53aWR0aCArICdweCc7XG4gICAgdGhpcy5fX2RvbS5zdHlsZS5oZWlnaHQgPSB0aGlzLmhlaWdodCArICdweCc7XG5cbiAgICB0aGlzLndvcmxkLnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKCR7dGhpcy53aWR0aCAvIDJ9LCAke3RoaXMuaGVpZ2h0IC8gMn0pYCk7XG5cbiAgfVxuXG4gIG9uUmVzaXplKCkge1xuXG4gICAgdGhpcy5zZXRTdmdTaXplKCk7XG5cbiAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBTdmcoKTsiLCJpbXBvcnQgc3ZnIGZyb20gJy4uLy4uL21vZGVscy9zdmcuanMnO1xuXG5jbGFzcyBBbmltYXRlT25QYXRoIHtcblxuICBjb25zdHJ1Y3RvcihwYXRoRWxlbWVudCwgbWVzc2FnZSwgcGFyYW1zID0ge30pIHtcblxuICAgIHRoaXMuX19wYXRoRWxlbWVudCA9IHBhdGhFbGVtZW50O1xuICAgIHRoaXMuX190b3RhbExlbmd0aCA9IHBhdGhFbGVtZW50LmdldFRvdGFsTGVuZ3RoKCk7XG4gICAgdGhpcy5fX21lc3NhZ2UgPSBtZXNzYWdlLnNwbGl0KCcnKTtcbiAgICB0aGlzLl9fdGV4dHMgPSBbXTtcblxuICAgIHRoaXMuX19pc1J1bm5pbmcgPSBmYWxzZTtcbiAgICB0aGlzLl9fcHJvZ3Jlc3MgPSAwO1xuICAgIHRoaXMuX19sYXN0VGltZVN0YW1wID0gMDtcbiAgICB0aGlzLl9fZHVyYXRpb24gPSBwYXJhbXMuZHVyYXRpb24gfHwgMTAwMDtcblxuICAgIHRoaXMuX190ZXh0U2l6ZSA9IHBhcmFtcy50ZXh0U2l6ZSB8fCAxMztcbiAgICB0aGlzLl9fbGV0dGVyU3BhY2luZyA9IHBhcmFtcy5sZXR0ZXJTcGFjaW5nIHx8IDQ7XG4gICAgdGhpcy5fX3RleHRMZW5ndGggPSB0aGlzLl9fdGV4dFNpemUgKyB0aGlzLl9fbGV0dGVyU3BhY2luZztcblxuICAgIHRoaXMuY3JlYXRlTWVzc2FnZSgpO1xuXG4gIH1cblxuICBjcmVhdGVNZXNzYWdlKCkge1xuXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHRoaXMuX19tZXNzYWdlLmZvckVhY2goZnVuY3Rpb24oc3RyKSB7XG5cbiAgICAgIHZhciB0ZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHN2Zy54bWxucywgJ3RleHQnKTtcbiAgICAgIHRleHQuc3R5bGUub3BhY2l0eSA9IDE7XG4gICAgICB0ZXh0LnN0eWxlLmZvbnRTaXplID0gc2VsZi5fX3RleHRTaXplO1xuICAgICAgdGV4dC5pbm5lckhUTUwgPSBzdHI7XG4gICAgICBzdmcud29ybGQuYXBwZW5kQ2hpbGQodGV4dCk7XG5cbiAgICAgIHNlbGYuX190ZXh0cy5wdXNoKHRleHQpO1xuXG4gICAgfSk7XG5cbiAgfVxuXG4gIHJlbmRlcigpIHtcblxuICAgIHZhciBzZWxmID0gdGhpc1xuICAgICAgLCBjdXJyZW50TGVuZ3RoID0gdGhpcy5fX3RvdGFsTGVuZ3RoICogdGhpcy5fX3Byb2dyZXNzO1xuXG4gICAgdGhpcy5fX3RleHRzLmZvckVhY2goZnVuY3Rpb24odGV4dCwgaWR4KSB7XG5cbiAgICAgIHZhciB0ZXh0QXRMZW5ndGggPSBjdXJyZW50TGVuZ3RoIC0gaWR4ICogc2VsZi5fX3RleHRMZW5ndGg7XG5cbiAgICAgIGlmICh0ZXh0QXRMZW5ndGggPD0gMCkge1xuXG4gICAgICAgIHRleHQuc3R5bGUub3BhY2l0eSA9IDA7XG4gICAgICAgIHJldHVybjtcblxuICAgICAgfVxuXG4gICAgICB0ZXh0LnN0eWxlLm9wYWNpdHkgPSAxO1xuXG4gICAgICB2YXIgcG9pbnQgPSBzZWxmLl9fcGF0aEVsZW1lbnQuZ2V0UG9pbnRBdExlbmd0aCh0ZXh0QXRMZW5ndGgpO1xuICAgICAgICAvLywgbGFzdFBvaW50ID0gc2VsZi5fX3BhdGhFbGVtZW50LmdldFBvaW50QXRMZW5ndGgodGV4dEF0TGVuZ3RoIC0gMSlcbiAgICAgICAgLy8sIGFuZ2xlID0gTWF0aC5hdGFuMihwb2ludC55IC0gbGFzdFBvaW50LnksIHBvaW50LnggLSBsYXN0UG9pbnQueCkgKiAxODAgLyBNYXRoLlBJO1xuICAgICAgdGV4dC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAneCcsIHBvaW50LngpO1xuICAgICAgdGV4dC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAneScsIHBvaW50LnkpO1xuICAgICAgLy90ZXh0LnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKCR7cG9pbnQueH0sICR7cG9pbnQueX0pIHJvdGF0ZSgke2FuZ2xlfSwgJHtzZWxmLl9fdGV4dFNpemUgLyAyfSwgJHtzZWxmLl9fdGV4dFNpemUgLyAyfSlgKTtcblxuICAgIH0pO1xuXG4gIH1cblxuICBzdGFydCgpIHtcblxuICAgIGlmICh0aGlzLl9faXNSdW5uaW5nIHx8IHRoaXMuX19wcm9ncmVzcyA+PSAxKSB7XG5cbiAgICAgIHJldHVybjtcblxuICAgIH1cblxuICAgIHRoaXMuX19pc1J1bm5pbmcgPSB0cnVlO1xuICAgIHRoaXMuX19sYXN0VGltZVN0YW1wID0gdGltZXN0YW1wKCk7XG5cbiAgICB0aGlzLmFuaW1hdGUoKTtcblxuICB9XG5cbiAgcmVzdGFydCgpIHtcblxuICAgIHRoaXMuc3RvcCgpO1xuICAgIHRoaXMuc3RhcnQoKTtcblxuICB9XG5cbiAgcGF1c2UoKSB7XG5cbiAgICBpZiAoIXRoaXMuX19pc1J1bm5pbmcpIHtcblxuICAgICAgcmV0dXJuO1xuXG4gICAgfVxuXG4gICAgdGhpcy5fX2lzUnVubmluZyA9IGZhbHNlO1xuXG4gIH1cblxuICBzdG9wKCkge1xuXG4gICAgdGhpcy5fX2lzUnVubmluZyA9IGZhbHNlO1xuICAgIHRoaXMuX19wcm9ncmVzcyA9IDA7XG4gICAgdGhpcy5yZW5kZXIoKTtcblxuICB9XG5cbiAgYW5pbWF0ZSgpIHtcblxuICAgIGlmICghdGhpcy5fX2lzUnVubmluZykge1xuXG4gICAgICByZXR1cm47XG5cbiAgICB9XG5cbiAgICB2YXIgY2hhbmdlZCA9IHRpbWVzdGFtcCgpIC0gdGhpcy5fX2xhc3RUaW1lU3RhbXA7XG4gICAgdGhpcy5fX2xhc3RUaW1lU3RhbXAgPSB0aW1lc3RhbXAoKTtcblxuICAgIHRoaXMuX19wcm9ncmVzcyArPSBjaGFuZ2VkIC8gdGhpcy5fX2R1cmF0aW9uO1xuICAgIHRoaXMuX19wcm9ncmVzcyA+IDEgJiYgKHRoaXMuX19wcm9ncmVzcyA9IDEpO1xuXG4gICAgdGhpcy5yZW5kZXIoKTtcblxuICAgIGlmICh0aGlzLl9fcHJvZ3Jlc3MgPT09IDEpIHtcblxuICAgICAgdGhpcy5wYXVzZSgpO1xuICAgICAgcmV0dXJuO1xuXG4gICAgfVxuXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuYW5pbWF0ZS5iaW5kKHRoaXMpKTtcblxuXG4gIH1cblxuICBzZXRQcm9ncmVzcyhwcm9ncmVzcykge1xuXG4gICAgdGhpcy5fX3Byb2dyZXNzID0gcHJvZ3Jlc3M7XG5cbiAgfVxuXG59XG5cbmZ1bmN0aW9uIHRpbWVzdGFtcCgpIHtcblxuICByZXR1cm4gK25ldyBEYXRlKCk7XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgQW5pbWF0ZU9uUGF0aDsiXX0=
