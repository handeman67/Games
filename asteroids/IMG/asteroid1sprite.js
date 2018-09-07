// var astroidsprite = new image();
// astroidsprite.src = "/Astroids1/IMG/asteroids.png";
// function sprite(options)
// {
 
//    var that = {};
  
//      frameIndex=0
//      tickCount=0
//    ticksPerFrame = options.tickPerFrame || 0;
//    numberOfFrames;

//    that.context = options.context
//    that.width = options.width;
//    that.height = options.height;
//    that.image = options.image;
//    return that

//    that.render = function ()
//    {
//       //clear the canvas
//       context.clearRect(0, 0, that.width, that.height);

//       //draw the astroid
//       that, context.drawImage(
//          that.image,
//         frameIndex*this.width/numberOfFrames,
//          0,
//          that.width/numberOfFrames,
//          that.height,
//          0,
//          0,
//          that.width/numberOfFrames,
//          that.height,


//       );
//    }

//    that.update = function ()
//    {
   
//       frameIndex
//       tickCount += 1;

//       if (tickCount > ticksPerFrame) {
//          tickCount = 0
//          //if the current frame index in range

//          if (frameIndex < numberOfFrames - 1) {
//             //goTo the next frame
//             //next frame
//             frameIndex += 1;
            
//          } else if (that.loop) {
            
//             frameIndex - 0
            
//          }
//       }
   
//    };

// }
// asteroidImage.addEventListener("load", gameLoop);

// var canvae = document.getElementsById('asteroidSprite.png');
// canvas.width = 100;
// canvas.height = 100;

// var asteroid = sprite({
//    context: canvas.getContext("2D"),
//    width: 100,
//    height: 100,
//    image: astroid
// });
 
// asteroid.render();

// function gameLoop()
// {
//    window.requestAnimationFrame(gameLoop);
//    asteroid.update();
//    asteroid.render();

// }

//////////////////////

(function () {
   // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
   // http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
   // requestAnimationFrame polyfill by Erik MÃ¶ller. fixes from Paul Irish and Tino Zijdel
   // MIT license

   var lastTime = 0;
   var vendors = ['ms', 'moz', 'webkit', 'o'];
   for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
      window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
      window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||
         window[vendors[x] + 'CancelRequestAnimationFrame'];
   }

   if (!window.requestAnimationFrame)
      window.requestAnimationFrame = function (callback, element) {
         var currTime = new Date().getTime();
         var timeToCall = Math.max(0, 16 - (currTime - lastTime));
         var id = window.setTimeout(function () {
               callback(currTime + timeToCall);
            },
            timeToCall);
         lastTime = currTime + timeToCall;
         return id;
      };

   if (!window.cancelAnimationFrame)
      window.cancelAnimationFrame = function (id) {
         clearTimeout(id);
      };
}());

(function () {

   var stroid,
      atreroidSprite,
      canvas;

   function gameLoop() {

      window.requestAnimationFrame(gameLoop);

      astroidSprite.update();
      astroidSprite.render();
   }

   function sprite(options) {

      var that = {},
         frameIndex = 0,
         tickCount = 0,
         ticksPerFrame = options.ticksPerFrame || 0,
         numberOfFrames = options.numberOfFrames || 1;

      that.context = options.context;
      that.width = options.width;
      that.height = options.height;
      that.image = options.image;

      that.update = function () {

         tickCount += 1;

         if (tickCount > ticksPerFrame) {

            tickCount = 0;

            // If the current frame index is in range
            if (frameIndex < numberOfFrames - 1) {
               // Go to the next frame
               frameIndex += 1;
            } else {
               frameIndex = 0;
            }
         }
      };

      that.render = function () {

         // Clear the canvas
         that.context.clearRect(0, 0, that.width, that.height);

         // Draw the animation
         that.context.drawImage(
            that.image,
            frameIndex * that.width / numberOfFrames,
            0,
            that.width / numberOfFrames,
            that.height,
            0,
            0,
            that.width / numberOfFrames,
            that.height);
      };

      return that;
   }

   // Get canvas
   canvas = document.getElementById("astroidSprite");
   canvas.width = 550;
   canvas.height = 550;

   // Create sprite sheet
  astroidSprite = new Image();

   // Create sprite
   stroid = sprite({
      context: canvas.getContext("2d"),
      width: 185,
      height: 185,
      image: asteroidSprite,
      numberOfFrames: 10,
      ticksPerFrame: 4
   });

   // Load sprite sheet
   coinImage.addEventListener("load", gameLoop);
   coinImage.src = "asteroidSprite.png";

});