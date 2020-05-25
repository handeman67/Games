
 

class LEVELS{
  constructor(e){
this.e =e;  
switch (this.e) {
  case 1:
                     
               bl.play();
              score += 10;
              for (let j = asteroids.length - 1; j >= 0; j--) {
                asteroids[j].render();
                asteroids[j].update();
                asteroids[j].edges();
            }
              //  background(100);
              //  for (let j = asteroids.length - 1; j >= 0; j--) {
              //  if (asteroids[j].r > 10) {
              //     var newAsteroids = asteroids[j].breakup();
              //     asteroids = asteroids.concat(newAsteroids);
              //  }
                        
            
    break;
    case 2:
                bl.play();
                     score += -10;
                    

                     for (let j = asteroids.length - 1; j >= 0; j--) {
                      asteroids[j].render();                                    

                     if (asteroids[j].r > 10) {
                        var newAsteroids = asteroids[j].breakup();
                        asteroids = asteroids.concat(newAsteroids);
                     }
                    //  this.setRotation(random(-0.2, 0.2));
                    //  asteroids.splice(j, 1);
                     //ship.splice(0, 1);
               }
    break;
    case 3:
      
        //level [3]    
          bl.play();
              score += -10;
        for (let j = asteroids.length - 1; j >= 0; j--) {
          asteroids[j].render(); 
            
              if (asteroids[j].r > 10) {
            
                var newAsteroids = asteroids[j].breakup();
                asteroids = asteroids.concat(newAsteroids);
              }
              // this.setRotation(random(-0.2, 0.2));
              asteroids.splice(j, 1);
              //ship.splice(0, 1);
             }
          
    break;
   
    case 4:
      
        //if (forceField){
        //hitValue=damageValue;
        //damageValue.push(hitValue);
        //}
                 //this is the shipLeveling block
          // this.setRotation(random(-0.2,0.2));
          for (let j = asteroids.length - 1; j >= 0; j--) {
            asteroids[j].render(); 
          bl.play();
          score += -10;
          backgroun(255);
          if (asteroids[j].r > 10) {
            var newAsteroids = asteroids[j].breakup();
            asteroids = asteroids.concat(newAsteroids);
          }
          asteroids.splice(0, 1);
          ship.splice(0, 1);
          for (let i = 0; i < Level.length; i++){
     lvl= Level
                    ////
        }
      }

 break;
 default:
  gameOver();
  noLoop();
   break;
  }

  }}
  
  // var level = []
  // level[3]= function ()
  // {
  //         for (var j = asteroids.length - 1; j >= 0; j--) {
  //             if (ship[0].hits(asteroids[j])) {
  //                 bl.play();
  //                score += -10;
  //                 if (asteroids[j].r > 10) {

  //                     var newAsteroids = asteroids[j].breakup();
  //                     asteroids = asteroids.concat(newAsteroids);
  //                 }
  //                 e.setRotation(random(-0.2, 0.2));
  //                 asteroids.splice(j, 1);

  //                 //ship.splice(0, 1);
  //                 break;
  //             }

  //         }

  //level [2]
  // e.Level = function ()
  // {

  // var ob = function (l, s, as)
  // {
  //     for (var as = asteroids.length - 1; as >= 0; as--) {
  //         for (var s = ship.length - 1; s >= 0; s--) {

  //             if (lasers[l].hits(asteroids[as])) {
  //                 score += 10;
  //                 bl.play();
  //             }
  //             if (ship[s].hits(asteroids[as])) {

  //                 bl.play();
  //                 background(125);
  //                 score += -30;
  //                 { //if (forceField){
  //                     //hitValue=damageValue;
  //                     //damageValue.push(hitValue);
  //                     //}
  //                     //this is the shipLeveling block
  //                     // e.setRotation(random(-0.2,0.2));
  //                 }
  //             }
  //             if (asteroids[as].r > 10) {

  //                 var newAsteroids = asteroids[j].breakup();
  //                 asteroids = asteroids.concat(newAsteroids);
  //             }

  //             lasers.splice(0, 1);
  //             asteroids.splice(0, 1);
  //             ship.splice(0, 1);
  //             break;
  //             return
  //             ////
  //         }
  //     }
  //};
  