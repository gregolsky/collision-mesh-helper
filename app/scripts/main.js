
$(function(){
   
    if (window.File && window.FileReader && window.FileList && window.Blob) {
      // Great success! All the File APIs are supported.
    } else {
      alert('The File APIs are not fully supported in this browser.');
    }
    
    var canvasjq = $('canvas.sprite');
    var scale = 6;
    var points = [];
    
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
            
            ctx.imageSmoothingEnabled= false;
            ctx.ImageSmoothingEnabled = false;
            ctx.webkitImageSmoothingEnabled = false;
            ctx.mozImageSmoothingEnabled = false;
            
            ctx.drawImage(img, 0, 0);
        }
    };
    
    var getMouseCoords = function (canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    };
    
    var reset = function () {
      points.splice(0, points.length);
      $('.points').html(JSON.stringify(points));
      var ctx = canvasjq[0].getContext('2d');
      ctx.clearRect(0, 0, canvasjq[0].width, canvasjq[0].height);
    };
    
    $('input[name=spriteFile]')
    	.change(function (evt) {
            drawSpriteOnCanvas(evt.target.files[0]);
        });
    
    $('button.reset').click(function () {
       reset(); 
        return true;
    });
    
    var normalizeCoord = function(n) {
      return +(n / scale).toFixed(2);  
    };
    
    canvasjq.click(function (evt) {
           var position = getMouseCoords(canvasjq[0], evt);
           points.push(normalizeCoord(position.x));
           points.push(normalizeCoord(position.y));
           $('.points').html(JSON.stringify(points, null, 2));
        });
});