

function keyReleased(keyCode)
{
    G.ship[0].setRotation(false);
    G.ship[0].boosting(false);
    
}


function keyPressed(e)    
{
    {
        if (e.keyCode == 69) {
            G.lasers.push(new Laser(G.ship[0].pos, G.ship[0].heading));
             fire.play();
        }else if (e.keyCode == 65) {
            G.ship[0].setRotation(0.1);
        } else if (e.keyCode == 68) {
            G.ship[0].setRotation(-0.1);
        } else if (e.keyCode ==87) {
            G.ship[0].boosting(true);
           

        }
    }
}
     

    
   

   
    
