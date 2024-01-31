/** PlasmaOldSkool */

(function () {

    var scr;



    function setup() {

        scr = dcl.setupScreen(800, 600);

        scr.setBgColor('black');

        document.body.style.backgroundColor = 'black';

        draw(0);

    }



    function plasmoid(x, y, dt, a1, a2, b1, b2) {

        return Math.sin(x * Math.cos(dt / a1) * a2) + Math.cos(y * Math.cos(dt / b1) * b2);

    }



    function color(x, y, dt) {

        var c = plasmoid(x, y, dt, .1, .02, .1, .02);

        c += plasmoid(x, y, dt, .14, .025, .15, .025);

        return {r: Math.cos(3*c+dt)*2, g: Math.sin(c*2), b: Math.sin(c*2 + dt)*.01, a: 1.0};

    }



    function draw(dt) {

        for (var x = 0; x < scr.width; x+=10) {

            for (var y = 0; y < scr.height; y+=10) {

                var c = color(y,x, dt/6000);

                var r = Math.abs(Math.floor(c.r.map(-2,2,0,255)));

                var g = Math.abs(Math.floor(c.g.map(-2,2,0,255)));

                var b = Math.abs(Math.floor(c.b.map(-2,2,0,255)));

                dcl.rect(x, y, 10, 10, "rgb(" + r + "," + g + "," + b + ")");

            }

        }

        requestAnimationFrame(draw);

    }



    setup();

})();