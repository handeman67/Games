class Block
{
   constructor(x,y,z)
   {
      this.w = width;
     this.h = height;
     this.center = createVector(x, y, z);
     
      this.half = (size) =>
      {
       this.size = size   / 2;
         return size;
      };
   }
}