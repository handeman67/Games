 function Stats()
{
   var script = document.createElement('script'); script.onload = function ()
   {
         var stats = new Stats(); document.inner.appendChild(stats.dom); requestAnimationFrame(function
loop() { stats.update(); requestAnimationFrame(loop) });
   }; script.src = '//rawgit.com/mrdoob/stats.js/master/build/stats.min.js'; document.head.appendChild(script);
}