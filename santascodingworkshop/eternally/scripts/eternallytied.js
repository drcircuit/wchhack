/** universe */
(function () {
    var scr;
    var stars = [];

    function star(r,speed) {
        var size = Math.random()*4;
        var x = Math.floor(Math.random() * scr.width);
        var y = Math.floor(Math.random() * scr.height);
        var cx = x - r;
        var cy = y - r;
        var cxdir = 1;
        var cydir = 1;
        function circle(x,y,r,color,ctx){
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(x,y,r,0,360);
            ctx.fill();
            ctx.closePath();
        }
        return {

            draw: function (ctx) {
                circle(x,y,size, "white", ctx);
                circle(cx,cy,size*1.2, "#ffaa22", ctx);
                ctx.strokeStyle = "rgba(44,244,255,0.4)";
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(cx,cy);
                ctx.lineTo(x,y);
                ctx.stroke();
                ctx.closePath();

            },
            move: function(){
                if(cx < 0){
                    cxdir = 1;
                }
                if(cx > scr.width){
                    cxdir = -1;
                }
                if(cy < 0){
                    cydir = 1;
                }
                if(cy > scr.height){
                    cydir = -1;
                }
                var arad = size * speed * Math.PI / 180;
                if(arad < Math.PI * 2){
                    speed += 1;
                } else {
                    speed = 0.5;
                }
                var ct = Math.sin(arad);
                var st = Math.cos(arad);
                x = cx + st * r;
                y = cy + ct * r;
                cx += (speed/100+Math.sin(-speed/20)) * cxdir;
                cy += (speed/100 + Math.sin(speed/30)) * cydir;


            }
        }
    }

    function setup() {
        scr = dcl.setupScreen(window.innerWidth, window.innerHeight);
        scr.setBgColor('black');
        document.body.style.backgroundColor = 'black';
        while(stars.length < 100){
            stars.push(star(Math.random()* 100 + 5, Math.random()*400));
        }
        draw();
    }
    function draw(){
        scr.ctx.clearRect(0,0,scr.width, scr.height);
        stars.forEach(function(s){
            s.draw(scr.ctx);
            s.move();
        });
        requestAnimationFrame(draw);
    }

    setup();
})();