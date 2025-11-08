/**
 * Initialize Stats.js performance monitoring
 * Dynamically loads and displays FPS, MS, and MB graphs
 */
function Stat() {
   // Check if stats is already loaded
   if (window.stats) {
      console.log('Stats already initialized');
      return;
   }

   // Check if Stats is already available (from stats.min.js)
   if (typeof Stats !== 'undefined') {
      try {
         let r = document.querySelector(".result");
         if (!r) {
            console.error('Stats container .result not found');
            return;
         }

         var stats = new Stats();
         window.stats = stats; // Store reference globally

         // Clear any existing content
         r.innerHTML = '';

         // Append stats DOM element
         r.appendChild(stats.dom);

         // Start the stats update loop
         function updateStats() {
            stats.update();
            requestAnimationFrame(updateStats);
         }
         requestAnimationFrame(updateStats);

         console.log('Stats.js initialized successfully');
      } catch (error) {
         console.error('Error initializing Stats.js:', error);
      }
   } else {
      // Load stats.min.js if not already loaded
      var script = document.createElement('script');
      script.onload = function () {
         try {
            let r = document.querySelector(".result");
            if (!r) {
               console.error('Stats container .result not found');
               return;
            }

            var stats = new Stats();
            window.stats = stats; // Store reference globally

            // Clear any existing content
            r.innerHTML = '';

            // Append stats DOM element
            r.appendChild(stats.dom);

            // Start the stats update loop
            function updateStats() {
               stats.update();
               requestAnimationFrame(updateStats);
            }
            requestAnimationFrame(updateStats);

            console.log('Stats.js initialized successfully');
         } catch (error) {
            console.error('Error initializing Stats.js:', error);
         }
      };

      script.onerror = function() {
         console.error('Failed to load stats.min.js');
      };

      script.src = 'js/stats.min.js';
      document.head.appendChild(script);
   }
}
