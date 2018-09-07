

function keyReleased(keyCode)
{
    ship[0].setRotation(false);
    ship[0].boosting(false);
    
}


function keyPressed(e)    
{
    {
        if (e.keyCode == 69) {
           lasers.push(new Laser(ship[0].pos, ship[0].heading));
             fire.play();
        }else if (e.keyCode == 65) {
            ship[0].setRotation(0.1);
        } else if (e.keyCode == 68) {
            ship[0].setRotation(-0.1);
        } else if (e.keyCode ==87) {
            ship[0].boosting(true);
           

        }
    }
}
     

    
   

   
    
