
let wth=innerWidth,
hgt=innerHeight;
 
const vrs={   num: 1,
    offset:20,
    mag:0.007,
    Size: 10,
    grav:0.03,
    ground:-0.03,
    wind:0.3,
    mass:0,
    spd: 1,
    negative: -1,
    positive: 1,
   
    angle: Math.PI*2,
    bottom: wth / 1.3,
    center: hgt / 2,

},

gamebound={
boundryleft:0+vrs.offset ,
boundryright:wth-vrs.offset,
boundrybottom:hgt-vrs.offset,
boundrytop:vrs.offset,
},
wallspecs = [
    leftwall = {
    
        'x': gamebound.boundryleft,//*
        'y': gamebound.boundrybottom,
        'w': vrs.Size,
        'h':hgt+vrs.Size,
        'c':'rgb(200,0,200)',
        'blockcount':'left'

    },
    rightwalll = {
        'x': gamebound.boundryright,
        'y': gamebound.boundrybottom,
        'w': vrs.Size,
        'h': hgt+vrs.Size,
        'c': 'rgb(0,200,0)',
        'blockcount':'right'
    },
    flor = {
        'x': gamebound.boundryright,
        'y': gamebound.boundrybottom,
        'w': wth+vrs.Size,
        'h': vrs.Size,
        'c': 'rgb(0,0,200)',
        'blockcount':'bottom'
    },
    roof = {
        'x': gamebound.boundrytop,
        'y': gamebound.boundrytop,
        'w': wth+vrs.Size,
        'h': vrs.Size,        
        'c': 'rgb(200,50,200)',
        'blockcount':'top'
    }
];
