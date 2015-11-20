import svg from './models/svg.js';
import Point from './models/point.js';
import Line from './models/line.js';

import AnimateOnPath from './modules/animate-on-path/index.js';

(function() {

  svg.initialize('svg');

  var line = new Line();

  var size = 400;
  for (let i = 0; i < 10; i++) {

    let x = Math.random() * size * 2 - size
      , y = Math.random() * size - size / 2;
    line.append(new Point(x, y));

  }

  //line.append(new Point(-300, -150));
  //line.append(new Point(-100, 0));
  //line.append(new Point(-200, 50));
  //line.append(new Point(0, 10));
  //line.append(new Point(300, -100));
  //line.append(new Point(100, 0));
  //line.append(new Point(200, 100));

  var path = document.createElementNS(svg.xmlns, 'path');
  path.setAttributeNS(null, 'stroke', '#cccccc');
  path.setAttributeNS(null, 'stroke-width', 1);
  path.setAttributeNS(null, 'fill', 'none');
  path.setAttributeNS(null, 'd', line.getPath());
  path.setAttributeNS(null, 'd', line.getCurvedPath());
  svg.world.appendChild(path);

  var aop = new AnimateOnPath(path, 'Animate text along the line', {
    duration: 2000
  });
  aop.start();
  window.aop = aop;

  document.getElementById('button-start').addEventListener('click', aop.start.bind(aop));
  document.getElementById('button-restart').addEventListener('click', aop.restart.bind(aop));
  document.getElementById('button-pause').addEventListener('click', aop.pause.bind(aop));
  document.getElementById('button-stop').addEventListener('click', aop.stop.bind(aop));

})();