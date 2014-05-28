
$(function(){

  if (window.File && window.FileReader && window.FileList && window.Blob) {
    // Great success! All the File APIs are supported.
  } else {
    alert('The File APIs are not fully supported in this browser.');
  }

  var canvasjq = $('canvas.sprite');
  var scaleInput = $('input[name=scale]');
  var fileInput = $('input[name=spriteFile]');
  var scale = scaleInput.val();
  var points = [];

  var denormalizeCoord = function (n) {
    return n * scale;
  };

  var denormalizePoint = function (p) {
    return { x: denormalizeCoord(p.x), y: denormalizeCoord(p.y) };
  }; 

  var drawPointsOnCanvas = function (ctx) {

    if (!points || points.length < 2) {
        return;
    }

    ctx.fillStyle = "red";
    var start = points[0];
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);

    for (var i = 1; i < points.length; i++) {

      var p = points[i];
      ctx.lineTo(p.x, p.y);
    }

    ctx.stroke();
  };

  var drawSpriteOnCanvas = function (file) {
    var ctx = canvasjq[0].getContext('2d');
    var img = new Image;
    img.src = URL.createObjectURL(file);
    img.onload = function() {
      canvasjq
      .attr('width', img.width * scale)
      .attr('height', img.height * scale);

      ctx.scale(scale, scale);
      ctx.clearRect(0, 0, canvasjq[0].width, canvasjq[0].height);

      ctx.imageSmoothingEnabled = false;
      ctx.ImageSmoothingEnabled = false;
      ctx.webkitImageSmoothingEnabled = false;
      ctx.mozImageSmoothingEnabled = false;

      ctx.drawImage(img, 0, 0);

      drawPointsOnCanvas(ctx);
    }
  };

  var drawSelectedSprite = function () {
    var file = fileInput[0].files.length ? fileInput[0].files[0] : null;
    if (file) {
      drawSpriteOnCanvas(file);
    }
  };

  var getMouseCoords = function (canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    var point = {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };

    return normalizePoint(point);
  };

  var reset = function () {
    points.splice(0, points.length);
    $('.points').html(JSON.stringify(points));
    scale = 5;
    var ctx = canvasjq[0].getContext('2d');
    ctx.clearRect(0, 0, canvasjq[0].width, canvasjq[0].height);
  };

  fileInput
  .change(function (evt) {
    reset();
    drawSelectedSprite();
  });

  scaleInput.on('input', function () {
    scale = $(this).val();
    drawSelectedSprite();
  });

  $('button.reset').click(function () {
    reset(); 
    return true;
  });

  var normalizeCoord = function(n) {
    return n / scale;  
  };

  var normalizePoint = function (p) {
    return { x: normalizeCoord(p.x), y: normalizeCoord(p.y) };
  } 

  var formatPointsRegular = function () {
    var pointsRounded = points.map(function (p) {
      return {
        x: +p.x.toFixed(2),
        y: +p.y.toFixed(2),
      };
    });

    return JSON.stringify(pointsRounded, null, 2);
  };
  
  var formatPointsPhaser = function () {
    var pointsRounded = points.map(function (p) {
      return [ +p.x.toFixed(2), +p.y.toFixed(2) ];
    });

    var result = pointsRounded.reduce(function(a, b) {
          return a.concat(b);
    });

    return JSON.stringify(result, null, 2);
  };

  canvasjq.click(function (evt) {
    var position = getMouseCoords(canvasjq[0], evt);
    points.push(position); 
    $('.points').html(formatPointsPhaser());
    drawSelectedSprite();
  })
  .mousemove(function (evt) {
    var position = getMouseCoords(canvasjq[0], evt);
    $('.currentCoords').html(position.x.toFixed(2) + ', ' + position.y.toFixed(2));
  });

});
