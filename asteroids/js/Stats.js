 function Stats()
{
   var script = document.createElement('script'); script.onload = function ()
   {
         var stats = new Stats(); document.inner.appendChild(stats.dom); requestAnimationFrame(function
loop() { stats.update(); requestAnimationFrame(loop) });
   }; script.src = '//rawgit.com/mrdoob/stats.js/master/build/stats.min.js'; document.head.appendChild(script);
<<<<<<< HEAD
=======
 function Stats()
{
   var script = document.createElement('script'); script.onload = function ()
   {
         var stats = new Stats(); document.inner.appendChild(stats.dom); requestAnimationFrame(function
loop() { stats.update(); requestAnimationFrame(loop) });
   }; script.src = '//rawgit.com/mrdoob/stats.js/master/build/stats.min.js'; document.head.appendChild(script);
>>>>>>> 6e63db0a0b5a0b2aebb08a2ab60a835bbb8dfd3c
}