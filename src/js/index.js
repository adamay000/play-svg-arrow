import svg from './models/svg.js';
import Point from './models/point.js';
import Line from './models/line.js';

import Pen from './modules/pen/index.js';
import AnimateOnPath from './modules/animate-on-path/index.js';

(function() {

  svg.initialize('svg');

  var pen = new Pen()
    , aop
    , loop = true
    , duration = 2000
    , input = document.getElementById('input');

  pen.setPointInterval(10);
  pen.onDrawStart = function() {

    if (aop) {
      aop.destroy();
      aop = null;
    }

  };
  pen.onDrawEnd = function(line) {

    var path = document.createElementNS(svg.xmlns, 'path');
    path.setAttributeNS(null, 'stroke', '#cccccc');
    path.setAttributeNS(null, 'stroke-width', 1);
    path.setAttributeNS(null, 'fill', 'none');
    path.setAttributeNS(null, 'd', line.getPath());
    pen.__clear();
    aop = new AnimateOnPath(path, input.value, {
      duration: duration,
      loop: loop,
      callback: function() {}
    });
    aop.start();

  };
  pen.enable();

  //var line = new Line();
  //
  //var size = 400;
  //for (let i = 0; i < 10; i++) {
  //
  //  let x = Math.random() * size * 2 - size
  //    , y = Math.random() * size - size / 2;
  //  line.append(new Point(x, y));
  //
  //}

  //line.append(new Point(-300, -150));
  //line.append(new Point(-100, 0));
  //line.append(new Point(-200, 50));
  //line.append(new Point(0, 10));
  //line.append(new Point(300, -100));
  //line.append(new Point(100, 0));
  //line.append(new Point(200, 100));

  //var path = document.createElementNS(svg.xmlns, 'path');
  //path.setAttributeNS(null, 'stroke', '#cccccc');
  //path.setAttributeNS(null, 'stroke-width', 1);
  //path.setAttributeNS(null, 'fill', 'none');
  //path.setAttributeNS(null, 'd', line.getPath());
  //path.setAttributeNS(null, 'd', line.getCurvedPath());
  //svg.world.appendChild(path);
  //
  //var aop = new AnimateOnPath(path, 'Animate text along the line', {
  //  duration: 2000
  //});
  //aop.start();
  //window.aop = aop;
  //
  //setTimeout(function() {
  //  console.log('destroy');
  //  aop.destroy();
  //  aop = null;
  //}, 3000);
  //
  //window.pen = new Pen();
  //

  Array.prototype.forEach.call(document.querySelectorAll('.button a, input'), function(el) {

    el.addEventListener('mousedown', function(event) {
      event.stopPropagation();
    });

  });

  document.getElementById('button-start-pause').addEventListener('click', function() {
    aop && aop.start() || aop.pause();
  });
  //document.getElementById('button-start').addEventListener('click', function() {
  //  aop && aop.start();
  //});
  //document.getElementById('button-pause').addEventListener('click', function() {
  //  aop && aop.pause();
  //});
  document.getElementById('button-restart').addEventListener('click', function() {
    aop && aop.restart();
  });
  document.getElementById('button-stop').addEventListener('click', function() {
    aop && aop.stop();
  });
  document.getElementById('button-loop').addEventListener('click', function() {
    this.className ?
      (this.className = '')
    : (this.className = 'off');

    loop = !this.className;
    aop && aop.setLoop(loop);
  });
  document.getElementById('button-normal').addEventListener('click', function() {
    duration = 2000;
    aop && aop.setDuration(duration);
  });
  document.getElementById('button-slower').addEventListener('click', function() {
    duration *= 1.2;
    aop && aop.setDuration(duration);
  });
  document.getElementById('button-faster').addEventListener('click', function() {
    duration /= 1.2;
    aop && aop.setDuration(duration);
  });

})();