/**
 * Created by Espen on 11/20/2016.
 */
function setupScreen() {
    var canvases = document.getElementsByTagName('canvas');
    for(var idx = 0; idx < canvases.length;idx++){
        document.body.removeChild(canvases[idx]);
    }
    var canvas = document.createElement('canvas');
    canvas.id = 'space';
    var side = (window.innerHeight < window.innerWidth) ? window.innerHeight : window.innerWidth;
    canvas.width = side;
    canvas.height = side;
    document.body.appendChild(canvas);
    var getHeight = function () {
        return canvas.height;
    };
    var getWidth = function () {
        return canvas.width;
    };
    return {
        ctx: canvas.getContext('2d'),
        width: getWidth,
        height: getHeight
    }
}
function sierpinsky(order, scr) {

    var fg = "#2EF";
    var sizeDivisor = 1.2;

    var side = scr.width() / sizeDivisor;
    var height = getHeight(side);
    var x = scr.height() / 2 - side / 2;
    var y = scr.height() / 2 + height / 2;
    var tri = generateTriangle(side, x, y);
    plot(tri, scr.ctx, fg);
    cookieCutter(tri, order, scr.ctx);

}
function cookieCutter(tri, depth, ctx) {
    if (depth > 0) {
        var iTri = generateInverseTriangle(tri);
        plot(iTri, ctx, "#222");
        if (depth > 1) {
            cookieCutter(generateTriangle((tri.b.x - tri.a.x) / 2, tri.a.x, tri.a.y), depth - 1, ctx);
            cookieCutter(generateTriangle((tri.b.x - tri.a.x) / 2, iTri.a.x, iTri.a.y), depth - 1, ctx);
            cookieCutter(generateTriangle((tri.b.x - tri.a.x) / 2, iTri.b.x, iTri.b.y), depth - 1, ctx);
        }
    }
}
function plot(tri, ctx,fill) {
    ctx.beginPath();
    ctx.moveTo(tri.a.x, tri.a.y);
    ctx.lineTo(tri.b.x, tri.b.y);
    ctx.lineTo(tri.c.x, tri.c.y);
    ctx.lineTo(tri.a.x, tri.a.y);
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.closePath();
}
function generateInverseTriangle(tri){
    return {
        a:{x:(tri.a.x + tri.b.x)/2, y:(tri.a.y + tri.b.y) /2},
        b:{x:(tri.a.x + tri.c.x)/2, y:(tri.a.y + tri.c.y) /2},
        c:{x:(tri.b.x + tri.c.x)/2, y:(tri.b.y + tri.c.y) /2},
    }
}
function generateTriangle(side, x, y){

    return{
        a:{x:x,y:y},
        b:{x:x + side, y:y},
        c:{x:x + side / 2, y:y - getHeight(side)}
    }
}
function getHeight(side){

    //side^2 - 1/2 side^2 = height^2
    var h = Math.pow(side, 2);
    var a = Math.pow(side / 2, 2);
    return Math.sqrt(h - a);
}
var order = 0;
var adder = 1;
var scr = setupScreen();
window.addEventListener("resize",function () {
    scr.ctx.clearRect(0,0, scr.width(), scr.height());
    scr = setupScreen();
    sierpinsky(order, scr);
});
document.addEventListener('keyup', function (e) {
   if(e.keyCode === 32){
       if(order >= 10){
           adder = -1;
       }
       if(order <= 0){
           adder = 1;
       }
       order += adder;
       scr.ctx.clearRect(0,0, scr.width(), scr.height());
       sierpinsky(order, scr);
   }
});
sierpinsky(order, scr);