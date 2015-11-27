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

    this.__loop = params.loop || false;
    this.__loopedCount = 0;
    this.__callback = params.callback || function(){};

    this.createMessage();

  }

  destroy() {

    this.__texts.forEach(function(text, idx) {

      svg.world.removeChild(text);

    });

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
      for (let i = 0; i < self.__loopedCount && textAtLength < 0; i++) {
        textAtLength = textAtLength + self.__totalLength;
      }

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

      return false;

    }

    this.__isRunning = true;
    this.__lastTimeStamp = timestamp();

    this.animate();

    return true;

  }

  restart() {

    this.stop();
    this.start();

    return true;

  }

  pause() {

    if (!this.__isRunning) {

      return false;

    }

    this.__isRunning = false;

    return true;

  }

  stop() {

    this.__isRunning = false;
    this.__progress = 0;
    this.__loopedCount = 0;
    this.render();

    return true;

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

      if (!this.__loop) {


        this.pause();
        this.__callback();
        return;

      }

      this.__loopedCount++;
      this.setProgress(0);

    }

    requestAnimationFrame(this.animate.bind(this));


  }

  setProgress(progress) {

    this.__progress = progress;

  }

  setLoop(loop) {

    this.__loop = loop;

  }

  setDuration(duration) {

    this.__duration = duration;

  }

}

function timestamp() {

  return +new Date();

}

export default AnimateOnPath;