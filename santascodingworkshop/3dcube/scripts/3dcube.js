var scr = dcl.setupScreen(300,window.innerHeight);
scr.setBgColor("black");
var flame = [];
let pallette = dcl.pallette.fire;
let f = 1;
let id;
let pd;
let buffer = document.createElement("canvas");
buffer.width = scr.width;
buffer.height = scr.height;
buffer.ctx = buffer.getContext("2d");
buffer.style.position = "absolute";
buffer.style.padding = 0;
buffer.style.margin = 'auto';
buffer.style.top = 0;
buffer.style.left = "-250px";
buffer.style.right = 0;
buffer.style.bottom = 0;
document.getElementById("space").style.left = "250px";
document.body.appendChild(buffer);
function setup(){
    for(let y = 0;y<scr.height;y+=f){
        let row = [];
        for(let x = 0;x<scr.width;x+=f){
            let c = 0;y === scr.height-1 ? dcl.random(0,255): 0;
            row.push(c);
        }
        flame.push(row);
    }
    id = new ImageData(scr.width,scr.height);
}

var angle = 0;
setup();
var cube = {
    vertices: [
        dcl.vector(-1, 1, -1),
        dcl.vector(1, 1, -1),
        dcl.vector(1, -1, -1),
        dcl.vector(-1, -1, -1),
        dcl.vector(-1, 1, 1),
        dcl.vector(1, 1, 1),
        dcl.vector(1, -1, 1),
        dcl.vector(-1, -1, 1)
    ],
    faces: [
        [0, 1, 2, 3],
        [1, 5, 6, 2],
        [5, 4, 7, 6],
        [4, 0, 3, 7],
        [0, 4, 5, 1],
        [3, 2, 6, 7]
    ],
    transformedVertices: []
};
var dod = {
    vertices: [
        dcl.vector(-1, -1, -1),
        dcl.vector(-1, 1, 1),
        dcl.vector(1, -1, 1),
        dcl.vector(1, 1, -1),
        dcl.vector(1.5, 1.5, 1.5)
    ],
    faces: [
        [0, 1, 2,0],
        [0, 3, 2,0],
        [0, 1, 3,0],
        [4, 1, 3,4],
        [4, 2, 2,4],
        [4, 1, 2,4]
    ],
    transformedVertices: []
};

function draw() {
    buffer.ctx.clearRect(0,0,scr.width,scr.height);
    cube.vertices.forEach(function (v, i) {
        cube.transformedVertices[i] = v.rotateX(angle).rotateY(angle).project(scr.width, scr.height, scr.height / 2, 8.5);
    });
    cube.faces.forEach(function (f) {
        var a = cube.transformedVertices[f[0]];
        dcl.curve.start(a.x, a.y);
        f.forEach(function (v, i, arr) {
            var p = cube.transformedVertices[v];
            if (i === 0) {
                dcl.curve.start(p.x, p.y,buffer.ctx);
            }
            dcl.curve.vertex(p.x, p.y,buffer.ctx);
            if (i === arr.length - 1) {
                dcl.curve.stroke("white", 2,buffer.ctx);
                dcl.curve.end(buffer.ctx);
            }
        });
    });
    angle += 1;
    pd = buffer.ctx.getImageData(0,0,scr.width,scr.height);
    for(let y = 0;y<flame.length-1;y++){
        for(let x = 0;x<flame[y].length;x++){
            let y1 = (y+1)%flame.length;
            let y2 = (y+2)%flame.length;
            let x1 = (x-1+flame[y].length)%flame[y].length;
            let x2 = x %flame[y].length;
            let x3 = (x+1+flame[y].length)%flame[y].length;
            let sum = ((
                flame[y1][x1] +
                flame[y1][x2] +
                flame[y1][x3] +
                flame[y2][x2]
            ))/4.10; // this average controls how high the fire can rise
            flame[y][x] = sum;
        }
    }
    for(let y = 0; y<scr.height;y+=f){
        for(let x = 0;x<scr.width;x+=f){
            let fy = (y/f) % flame.length;
            let fx = (x/f) % flame[fy].length;
            let i = Math.floor(flame[fy][fx]);
            let cf = pallette[i];
            if(!cf){
                continue;
            }
            let idx = 4 * (y*scr.width + x);
             
            id.data[idx] = cf.r;
            id.data[idx+1] = cf.g;
            id.data[idx+2] = cf.b;
            id.data[idx+3] = 255;
            let pr = pd.data[idx];
            let pa = pd.data[idx+3];
            //Lookup in logo mask buffer to render it in fire! :)
            
            if(pr > 64 && pa >0){
                let c =  dcl.randomi(0,255);
                flame[fy][fx] =c;
                id.data[idx] = pallette[180].r;
                id.data[idx+1] = pallette[180].g;
                id.data[idx+2] = pallette[180].b;
                id.data[idx+3] = 255;
                

            }
            
            
        }
    }
    scr.ctx.putImageData(id,0,0);
    dcl.text("Frame Buffer",150,340,"white","Arial",12,200,"left")
    dcl.text("Mask Buffer",150,340,"white","Arial",12,200,"left",buffer.ctx)
}

dcl.animate();