/** bounce */
(function(){
    var scr;
    var balls = [];
    function rect(ctx,x,y,w,h,c,lw,lc){
        if(!ctx){
            ctx = scr.ctx;
        }
        if(!c && !(lw && lc)){
            c = "white";
        }
        if(!h){
            h = w;
        }
        ctx.fillStyle = c;
        ctx.fillRect(x,y,w,h);
        if(lw && lc){
            ctx.strokeStyle = lc;
            ctx.lineWidth = lw;
            ctx.stroke();
        }
    }
    function circle(ctx,x,y,r,c,lw,lc){
        if(!ctx){
            ctx = scr.ctx;
        }
        if(!c && !(lw && lc)){
            c = "white";
        }
        ctx.fillStyle = c;
        ctx.beginPath();
        ctx.arc(x,y,r,0,360 * Math.PI/180);
        ctx.fill();
        if(lw && lc){
            ctx.strokeStyle = lc;
            ctx.lineWidth = lw;
            ctx.stroke();
        }
        ctx.closePath();
    }
    function setup() {
        scr = dcl.setupScreen(window.innerWidth ,window.innerHeight );
        scr.setBgColor('black');
        document.body.style.backgroundColor = 'black';
        while(balls.length < Math.floor(Math.random() * 100)){
            var size = Math.random() * 100 + 10;
            balls.push(block(Math.floor(Math.random() * scr.width), Math.random() * 10,size,1.4,scr));
        }

        animate();
    }
    function animate(){
        draw();
        update();
        requestAnimationFrame(animate);
    }
    function draw(){
        scr.ctx.clearRect(0,0,scr.width,scr.height);
        balls.forEach(function(b){
            b.render();
        })
    }
    function update(){
        balls.forEach(function(b){
            b.move();
        });
    }
    function block(x,y, size, g,w){
        size = size || 150;
        var pos = [];
        var dir = 1;
        var xdir = 1;
        function up(){
            dir = -1;
        }
        function down(){
            dir = 1;
        }
        function left(){
            xdir = -1;
        }
        function right(){
            xdir = 1;
        }
        return {
            render: function(ctx){
                //rect(ctx, x,y,size,size);
                circle(ctx,x,y,size);
            },
            move: function(){
                if(pos.length === 5){
                    pos
                }
                pos.push({x:x,y:y});
                y += y/10 * g * dir;
                x += 2 * (g * size /100) * xdir;
                if(y > w.height - size){
                    up();
                } else if(y <= size / 10){
                    down();
                }
                if(x > w.width - size * 2) {
                    left();
                } else if(x <= 0){
                    right();
                }

            }
        }
    }
    setup();
})();