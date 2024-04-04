
function ResolveRectCircleCollision(obj1, obj2) {
    let hx = 0.5 * obj2.w,
      hy = 0.5 * obj2.h;
    let rx = obj2.x + hx,
      ry = obj2.y + hy;
    let dx = obj1.x - rx,
      dy = obj1.y - ry;
  
    let sx = dx < -hx ? -1 : (dx > hx ? 1 : 0);
    let sy = dy < -hy ? -1 : (dy > hy ? 1 : 0);
  
    let tx = sx * (Math.abs(dx) - hx);
    let ty = sy * (Math.abs(dy) - hy);
    let dc = Math.hypot(tx, ty);
    if (dc > obj1.r) {
      return false;
    }
  
    let nx = 0,
      ny = 0,
      nl = 0;
    if (sx == 0 && sy == 0) {
      nx = dx > 0 ? 1 : -1;
      ny = dy > 0 ? 1 : -1;
      nl = Math.hypot(nx, ny);
    } else {
      nx = tx;
      ny = ty;
      nl = dc;
    }
    nx /= nl;
    ny /= nl;
  
    obj1.x += (obj1.r - dc) * nx;
    obj1.y += (obj1.r - dc) * ny;
  
    let dv = obj1.vx * nx + obj1.vy * ny;
    if (dv >= 0.0)
      return false;
    obj1.vx -= 2.0 * dv * nx;
    obj1.vy -= 2.0 * dv * ny;
   
    return true;
  }
  