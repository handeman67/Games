function setup()
{   
  createCanvas(450, 550, "2d");
   background(0);
   c.parent("canv");

   document.getElementsByClassName("canv").style.position = "inherit";
   //clear().
      
   c.drop(gotFile);
}
function draw()
{
   background(0);
}
function gotFile(file)
{
   createP(file.name + "" + file.size + "" + file.type);
   var img = createImg(file.data);
   img.size(100, 100);
   image(img, 0, 0, width, height);
}