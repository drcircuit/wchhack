/** timestables */
var changeFactor;

(function () {
    var scr;
    var n = 1;
    var f = 2;
    function setFactor(){
        var r = document.getElementById("factor");
        f = r.value;
        n = 1;
        draw();
        document.title = "Times Tables for " + f;
    }

    function setup() {
        scr = dcl.setupScreen(800, 800);
        scr.setBgColor('black');
        document.body.style.backgroundColor = 'black';
        changeFactor = setFactor;
        document.title = "Times Tables for " + f;
    }
    function draw() {
        let x = scr.width / 2;
        let y = scr.height / 2;
        let r = 350;
        dcl.circle(x, y, 350, "black", "1px");
        for (let i = 0; i < n; i++) {
            let angle = (360 / n * i).toRadians();
            let ox = x + Math.sin(angle) * r;
            let oy = y + Math.cos(angle) * r;
            dcl.circle(ox, oy, 2, "red");
            let a = (i * f) % n;
            let angle2 = (360 / n * a).toRadians();
            let dox = x + Math.sin(angle2) * r;
            let doy = y + Math.cos(angle2) * r;
            dcl.line(ox, oy, dox, doy, "1px", "rgba(255,0,120,.3)");

        }
        n += .1;
        requestAnimationFrame(draw);
    }
    setup();
    draw();
})();