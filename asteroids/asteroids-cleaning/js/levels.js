 

function LEVELS(){

    Level=[
      level1=()=>
      {
           
         
               bl.play();
               G.score += 10;
               background(100);


            //    if (asteroids[j].r > 10) {

            //       var newAsteroids = asteroids[j].breakup();
            //       asteroids = asteroids.concat(newAsteroids);
            //    }
              
                  
            },

         
      
      



 level2=()=>
      {
         
             

                     bl.play();
                     G.score += -10;

                     background(255, 255, 0)
                     if (G.asteroids[j].r > 10) {

                        var newAsteroids = G.asteroids[j].breakup();
                        G.asteroids = G.asteroids.concat(newAsteroids);
                     }
                     this.setRotation(random(-0.2, 0.2));
                     G.asteroids.splice(j, 1);
                     //ship.splice(0, 1);
                    
                  

               },
      

      
      
     

       level3 = () => {
         //level [3]

         
               bl.play();
               G.score += -10;
               if (G.asteroids[j].r > 10) {
                 background(100, 0, 0);
                 var newAsteroids = G.asteroids[j].breakup();
                 G.asteroids = G.asteroids.concat(newAsteroids);
               }
               this.setRotation(random(-0.2, 0.2));
               G.asteroids.splice(j, 1);

               //ship.splice(0, 1);
              
             } ,
           
         
       
   
 
   
   level4 = () => {

       //if (forceField){
       //hitValue=damageValue;
       //damageValue.push(hitValue);
       //}
      
         //this is the shipLeveling block
         // this.setRotation(random(-0.2,0.2));
         bl.play();
         G.score += -10;
         backgroun(255);
         if (G.asteroids[j].r > 10) {
           var newAsteroids = G.asteroids[j].breakup();
           G.asteroids = G.asteroids.concat(newAsteroids);
         }

         G.asteroids.splice(0, 1);
         G.ship.splice(0, 1);
         
         ////
       }
     
   
  ]
  
  for (var i = 0; i < G.Level.length; i++){
    lvl= G.Level[i]
  }
     }
   


