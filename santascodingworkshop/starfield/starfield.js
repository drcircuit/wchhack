/**
 * Created by Espen on 14.03.2017.
 */
(function () {
    function star(width, height, speed) {

        var vector = {
            x: map(Math.floor(Math.random() * width), 0, width, width * -1, width),
            y: map(Math.floor(Math.random() * height), 0, height, height * -1, height),
            z: Math.floor(Math.random() * width)
        };
        var pz = vector.z;

        function drawStreak(ctx, color, sx, sy, px, py) {
            ctx.beginPath();
            ctx.strokeWidth = 3;
            ctx.strokeStyle = color;
            ctx.moveTo(sx, sy);
            ctx.lineTo(px, py);
            ctx.stroke();
            ctx.closePath();
        }

        function drawDot(ctx, color, sx, sy) {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(sx, sy, map(vector.z, 0, width, 4, .5), 0, 2 * Math.PI);
            ctx.fill();
            ctx.closePath();
        }

        return {
            x: vector.x,
            y: vector.y,
            z: vector.z,
            draw: function (ctx) {
                var sx        = map(vector.x / vector.z, 0, 1, 0, width);
                var sy        = map(vector.y / vector.z, 0, 1, 0, height);
                var px       = map(vector.x / pz, 0, 1, 0, width);
                var py       = map(vector.y / pz, 0, 1, 0, height);
                var opacity = map(vector.z, 0, width, 1.0, 0.0).toFixed(1);
                var color = 'rgba(255,255,255,'+opacity+')';
                drawStreak(ctx, color, sx, sy, px, py);
                drawDot(ctx, color, sx, sy);
            },
            update: function () {
                pz = vector.z;
                if(vector.z - speed >= 0){
                    vector.z = vector.z - speed;
                } else {
                    vector.z = Math.floor(Math.random() * width);
                    pz = vector.z;
                }

            }
        }
    }

    var screen = dcl.setupScreen(window.innerWidth, window.innerHeight);
    window.addEventListener('resize', function(){
        var canvas = document.getElementsByTagName('canvas')[0];
        document.body.removeChild(canvas);
        screen = dcl.setupScreen(window.innerWidth, window.innerHeight);
        screen.setBgColor("black");
    });
    screen.setBgColor("black");
    var stars    = [];
    var numStars = 1000;
    for (var i = 0; i < numStars; i++) {
        stars.push(star(screen.width, screen.height, 20));
    }

    function draw() {
        screen.ctx.translate(screen.width / 2, screen.height / 2);
        stars.forEach(function (star) {
            star.draw(screen.ctx);
            star.update();
        });
        screen.ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    function run() {
        screen.ctx.clearRect(0, 0, screen.width, screen.height);
        draw();
        requestAnimationFrame(function () {
            run();
        });
    }

    run();

    function map(x, minI, maxI, minO, maxO) {
        return (x - minI) * (maxO - minO) / (maxI - minI) + minO;
    }
}());