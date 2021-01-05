class Joystick {

   constructor(R, L, D, U) {
      let t = this;
      let KD = keyIsDown;
      
      if(R){R.copy}else{ t.R = R = 37};
     if(L){L.copy}else{ t.L = L = 39};
     if(D){D.copy}else{  t.D = D = 40};
     if(U){U.copy}else{ t.U = U = 38};
      
     
    
       t.move = () =>
       {
           let P = t.pos;
           if (KD === (R)) {
         P.x -= t.sp
         console.log("Right")
      }
      if (KD===(L)) {
         P.x += t.sp
          console.log("LEFT")
      }
      if (KD===(U)) {
         P.y -= t.sp
          console.log("UP")
      }
      if (KD===(D)) {
         P.y += t.sp
          console.log("DOWN")
      };
}
      //let t2= player[1]
      

   }
}
