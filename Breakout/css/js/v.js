const blockCount=[],
wallCount=[],
bounces=[],
balls= [],
player= [],
blok= [],
Walls= [];
function boundry(elm,d){
elm.pos.x <= gamebound.boundryleft?elm.pos.x+= -1 :elm.pos.x+=elm.pos.x ,
elm.pos.x >= gamebound.boundryright?elm.pos.x=elm.pos.x+= -1 :elm.pos.x+=elm.pos.x,
elm.pos.y >= gamebound.boundrybottom?elm.pos.y+= 1*vrs.positive:elm.pos.y*=vrs.negative,
elm.pos.y <= gamebound.boundrytop?elm.pos.x+= -1*vrs.positive:elm.pos.x+= 1*vrs.negative;
elm.collide = true;
return elm;

};

async function v(x,y,z,varib) {
varib = await function(){return createVector(x, y, z);};
    return varib;
};

function wall(spots) {

    spots.forEach((spot, index) => {
        wallCount.push(spot);
        spot.collide=false;
        spot.bounce=false;
        let elm = new Block(spot.x, spot.y, spot.w, spot.h, spot.c);
        Walls.push(elm);
       
    });
};
function Force(x, y, m = 1) {
        let force=createVector(force,x,y);
      force.normalize();
      force.mult(m);
      return force;
  };
if(bounces.length>3){

};
function boost(a){
    let force = p5.Vector.fromAngle(a.vel.heading * -0.001);    
    console.log("boosting",a)
    a.vel.mult(force);
return a;
  };
  
function Bounce(b){
    if(this.bounce){
    
     b.vel.add(vrs.wind);
      b.boost();
      b.acc.setMag(0.1);
    b.gravforce.mult(b.groundforce);
    b.vel.mult(-1);
    
    
  }
  return b
 };
 function collider(b){
    if(this.collide){
    
     b.vel.add(vrs.wind);
      b.boost();
      b.acc.setMag(0.1);
    b.gravforce.mult(b.groundforce);
    b.vel.mult(-1);
    
    
  }
 };