 

function LEVELS(){

    Level=[
      level1=()=>
      {
           
         
               bl.play();
              score += 10;
               background(100);


            //    if (asteroids[j].r > 10) {

            //       var newAsteroids = asteroids[j].breakup();
            //       asteroids = asteroids.concat(newAsteroids);
            //    }
              
                  
            },

         
      
      



 level2=()=>
      {
         
             

                     bl.play();
                     Score += -10;

                     background(255, 255, 0)
                     if (asteroids[j].r > 10) {

                        var newAsteroids = asteroids[j].breakup();
                        asteroids = asteroids.concat(newAsteroids);
                     }
                     this.setRotation(random(-0.2, 0.2));
                     asteroids.splice(j, 1);
                     //ship.splice(0, 1);
                    
                  

               },
      

      
      
     

       level3 = () => {
         //level [3]

         
               bl.play();
               score += -10;
               if (asteroids[j].r > 10) {
                 background(100, 0, 0);
                 var newAsteroids = asteroids[j].breakup();
                 asteroids = asteroids.concat(newAsteroids);
               }
               this.setRotation(random(-0.2, 0.2));
               asteroids.splice(j, 1);

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
         score += -10;
         backgroun(255);
         if (asteroids[j].r > 10) {
           var newAsteroids = asteroids[j].breakup();
           asteroids = asteroids.concat(newAsteroids);
         }

         asteroids.splice(0, 1);
         ship.splice(0, 1);
         
         ////
       }
     
   
  ]
  
  for (var i = 0; i < Level.length; i++){
    lvl= Level[i]
  }
     }
   


