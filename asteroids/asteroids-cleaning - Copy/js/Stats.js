 function Stat()
{
   var script = document.createElement('script'); script.onload = function ()
   {
      let r= document.querySelector(".result");
         var stats = new Stats();r.onload= ()=>{return r.append(stats.dom)}; requestAnimationFrame(function
loop() { stats.update(); requestAnimationFrame(loop) });
   }; script.src = 'js/stats.min.js'; document.head.appendChild(script);
}
