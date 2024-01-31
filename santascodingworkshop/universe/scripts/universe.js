/** universe */
(function(){
    var scr;
    function circle(x,y,radius,ctx, fill, stroke,lineWidth){
        ctx.beginPath();
        ctx.arc(x,y,radius, 0, 360 * Math.PI / 180);
        if(fill){
            ctx.fillStyle = fill;
            ctx.fill();
        }
        if(stroke){
            ctx.strokeStyle = stroke;        
            if(lineWidth){
                ctx.lineWidth = lineWidth;
            } else {x
                ctx.lineWidth = 1;
            }
            ctx.stroke();
        }
    }
    function planet(sun, x,y,size,color){
        var speed = Math.random() * 2 + 0.4;
        var dist = x - sun.pos().x;
        var angle = Math.random()*360;
        size = size > 4 ? size : 4;
        return {
            moons:[],
            draw: function (ctx){
                circle(sun.pos().x, sun.pos().y, dist, ctx,null,"#888");
                circle(x,y,size,ctx,color);
                
            },
            move: function(){
                x = sun.pos().x + Math.sin(angle * Math.PI / 180) * dist;
                y = sun.pos().y + Math.cos(angle * Math.PI / 180)* dist;
                angle += speed;
            },
            pos: function(){
                return {x: x, y:y};
            }
        }
    }
    function sun(x,y,size,color){
        return {
            planets : [],
            draw: function (ctx){
                circle(x,y,size,ctx,color);
            },
            size: size,
            pos: function(){
                return {x: x, y:y};
            }
        }
    }
    var stars = [];
    function setup() {
        scr = dcl.setupScreen(window.innerWidth ,window.innerHeight );
        scr.setBgColor('black');
        document.body.style.backgroundColor = 'black';
        while(stars.length < Math.random()*30 +10){
            stars.push(sun(Math.random() * scr.width, Math.random()*scr.height, Math.random()*30+5, "rgb("+Math.floor(Math.random()*127+128)+",50,0)"));
        }      
        stars.forEach(function(s){
            var numPlanets =  Math.floor(Math.random() * 5)+1;
            var dist = Math.random()* 20 + 10;
            while(s.planets.length < numPlanets){
                dist += s.size;
                s.planets.push(planet(s, s.pos().x + dist, s.pos().y+dist, (s.size * Math.random()) / 2,  "rgb("+Math.floor(Math.random()*255)+","+Math.floor(Math.random()*255)+","+Math.floor(Math.random()*255)+")" ));
            }
            if(stars.indexOf(s)===stars.length-1){
                draw();
            }
        })
    }

    function draw(){
        scr.ctx.clearRect(0,0,scr.width, scr.height);
        stars.forEach(function(s){
            s.draw(scr.ctx);
            s.planets.forEach(function(p){
                p.draw(scr.ctx);
                p.move();
            });
        });
        requestAnimationFrame(draw);
    }
    setup();
})();