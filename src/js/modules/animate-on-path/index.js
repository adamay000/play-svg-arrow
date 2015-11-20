import svg from '../../models/svg.js';

class AnimateOnPath {

  constructor(pathElement, message, params = {}) {

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

  createMessage() {

    var self = this;
    this.__message.forEach(function(str) {

      var text = document.createElementNS(svg.xmlns, 'text');
      text.style.opacity = 1;
      text.style.fontSize = self.__textSize;
      text.innerHTML = str;
      svg.world.appendChild(text);

      self.__texts.push(text);

    });

  }

  render() {

    var self = this
      , currentLength = this.__totalLength * this.__progress;

    this.__texts.forEach(function(text, idx) {

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

  start() {

    if (this.__isRunning || this.__progress >= 1) {

      return;

    }

    this.__isRunning = true;
    this.__lastTimeStamp = timestamp();

    this.animate();

  }

  restart() {

    this.stop();
    this.start();

  }

  pause() {

    if (!this.__isRunning) {

      return;

    }

    this.__isRunning = false;

  }

  stop() {

    this.__isRunning = false;
    this.__progress = 0;
    this.render();

  }

  animate() {

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

  setProgress(progress) {

    this.__progress = progress;

  }

}

function timestamp() {

  return +new Date();

}

export default AnimateOnPath;