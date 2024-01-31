/** graphEffects */
(function(){
    let scr,graph,moving,limit,fadeDir, txtOpacity;
    function setup() {
        scr = dcl.setupScreen(window.innerWidth ,window.innerHeight);
        scr.setBgColor('black');
        graph = [];
        while(graph.length < dcl.random(50,90)){
            graph.push(node(dcl.random(scr.width/4,scr.width/4*3), dcl.random(scr.height/4,scr.height/4*3), dcl.random(3,9),2));
        }
        moving = true;
        limit = 120;
        txtOpacity = 1.0;
        fadeDir = -0.01;
        document.addEventListener("keydown", (e) => {
            console.log(e.keyCode);
            if(e.keyCode === 32){
                moving = !moving;
                console.log(moving);
            }
            if(e.keyCode === 187){
                limit += 10;
            }
            if(e.keyCode === 189){
                limit -= 10;
            }
        });
        render();
    }

    function renderText(txtSize, msg,x,y, align) {
        scr.ctx.font = txtSize + "px Arial";
        let size = scr.ctx.measureText(msg);
        scr.ctx.fillStyle = "rgba(128,128,128," + txtOpacity.toFixed(2) + ")";
        let xpos = align.toLowerCase() === "center" ? x - size.width / 2 : align.toLowerCase() === "right" ? x - size.width : x;
        scr.ctx.fillText(msg, xpos, y);
        if (txtOpacity > 0.9) {
            fadeDir = -0.01;
        } else if (txtOpacity < 0.1) {
            fadeDir = 0.01;
        }
        txtOpacity += fadeDir;
    }

    function render(){
        scr.ctx.clearRect(0, 0, scr.width, scr.height);
        graph.forEach((n,i) => {
            if(moving){
                n.move();
            }
            graph.forEach((nn)=>{
                if(n.dist(nn) < limit){
                    n.drawLink(scr.ctx,nn);
                }
                n.draw(scr.ctx);
            });

        });
        renderText(28, "Press SPACE to toggle pause / start, press + / - to adjust link limit <"+limit+">", scr.width / 2, scr.height - 80, "center");
        requestAnimationFrame(render);
    }
    function node(x,y,speed,size){
        let xdir = Math.random() > 0.5 ? 1 : -1;
        let ydir = Math.random() > 0.5 ? 1 : -1;
        let angle = dcl.random(15,180) * Math.PI / 180;
        return {
            draw: (ctx) =>{
                dcl.rect(ctx, x-size/2,y-size/2,10,10,"white");
            },
            position: () => {
                return {
                    x: x + size / 2, y: y + size /2
                };
            },
            move: () => {
                x += speed * xdir * Math.abs(Math.cos(angle));
                y += speed * ydir * Math.abs(Math.sin(angle));
                if(x > scr.width){
                    xdir = -1;
                    angle = -angle;
                } else if(x < 0){
                    xdir = 1;
                    angle = angle * -1;
                }
                if(y > scr.height){
                    ydir = -1;
                } else if(y < 0){
                    ydir = 1;
                }
            },
            drawLink : (ctx, node) => {
                let pos = node.position();
                dcl.line(ctx, x+size/2,y+size/2,pos.x,pos.y,1, "rgba(0,255,255,0.4)");
            },
            dist: (node) => {
                let pos = node.position();
                return Math.sqrt(Math.pow(x - pos.x,2) + Math.pow(y - pos.y, 2));
            }
        }
    }
    setup();
})();