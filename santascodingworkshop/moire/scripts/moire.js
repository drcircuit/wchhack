/** moire */
(function () {
    var scr, buffer, last, interval;
    function nearestPowerOf2(n) {
        let res = 2;
        while (res < n) {
            res *= 2;
        }
        return res / 2;
    }
    function setup() {
        scr = dcl.setupScreen(600, 320);
        scr.setBgColor('black');
        document.body.style.backgroundColor = 'black';
        buffer = scr.ctx.getImageData(0, 0, scr.width, scr.height);
        interval = 1000;
        draw();
    }


    function draw(t) {
        let dt = (t - last) / interval;
        last = t;
        dt = t / interval;
        let x1 = sin(dt / 4) * scr.width / 3 + scr.width / 2;
        let y1 = sin(dt / 3) * scr.height / 3 + scr.height / 2
        let x2 = cos(dt / 2) * scr.width / 3 + scr.width / 2;
        let y2 = cos(dt) * scr.height / 3 + scr.height / 2;

        let doff = 0;
        for (let y = 0; y < scr.height; y++) {
            let dy = (y - y1) * (y - y1);
            let dy2 = (y - y2) * (y - y2);
            for (let x = 0; x < scr.width; x++) {
                let dx = (x - x1) * (x - x1);
                let dx2 = (x - x2) * (x - x2);
                let shade = (((Math.sqrt(dx * 2 + dy * 2) ^ Math.sqrt(dx2 * 2 + dy2 * 2)) & 0xFF));//) & 2) * 255;
                let shade2 = (((Math.sqrt(dx * 2 + dy * 2) | Math.sqrt(dx2 * 2 + dy2 * 2)) % 255));//) & 2) * 255;
                let shade3 = (((Math.sqrt(dx * 2 + dy * 2) & Math.sqrt(dx2 * 2 + dy2 * 2)) ^ 0xFF));//) & 2) * 255;
                let shade4 = (((Math.sqrt(dx + dy) ^ Math.sqrt(dx2 + dy2)) & 100)) * 255;//) & 2) * 255;

                buffer.data[doff++] = shade3 >> 1;
                buffer.data[doff++] = shade;
                buffer.data[doff++] = shade << 1;
                buffer.data[doff++] = shade2;

            }
        }
        scr.ctx.putImageData(buffer, 0, 0);
        requestAnimationFrame(draw);
    }

    setup();
})();