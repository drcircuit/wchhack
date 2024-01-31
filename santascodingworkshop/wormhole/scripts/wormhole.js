/** wormhole */
(function () {
    var scr;
    let image, dest;
    let dists = [];
    let angles = [];
    let shades = [];

    function setup() {
        scr = dcl.setupScreen(600, 400);
        scr.setBgColor('black');
        document.body.style.backgroundColor = 'black';
        let img = new Image();
        img.onload = function () {
            let el = document.createElement("div");
            let tmp = dcl.setupScreen(img.width, img.height, false, 0, el);
            dcl.image(img, 0, 0, img.width, img.height);
            image = tmp.ctx.getImageData(0, 0, img.width, img.height);
            console.log(image);
            for (let y = 0; y < scr.height * 2; y++) {
                let ysq = (y - scr. height) * (y - scr.height);
                for (let x = 0; x < scr.width * 2; x++) {
                    let xsq = (x - scr.width) * (x - scr.width);
                    dists.push(floor(32 * image.height / Math.sqrt(xsq + ysq)) % image.height);
                    angles.push(round(image.width * Math.atan2(y - scr.height, x - scr.width) / Math.PI));
                    shades.push(Math.min(Math.sqrt(xsq + ysq), 255));
                }
            }
            draw(1);
        }
        
        dest = scr.ctx.getImageData(0, 0, scr.width, scr.height);
        img.src = "orion1024.png";
    }

    function draw(t) {
        let time = t / 1400;
        let shiftx = floor(image.width * time);
        let shifty = floor(image.height * .25 * time);
        let centerx = scr.width / 2 + floor(scr.width / 4 * sin(time*3));
        let centery = scr.height / 2 + floor(scr.height / 4 * sin(time*2));
        let stride = scr.width * 2;
        let doff = 0;
        for (let y = 0; y < scr.height; y++) {
            let srcoff = floor(y * stride + centerx + centery * stride);
            for (let x = 0; x < scr.width; x++) {
                let u = (dists[srcoff] + shiftx) &0x3ff;
                let v = (angles[srcoff] + shifty)&0x3ff;
                while (v < 0) {
                    v += image.height;
                }
                let shade = 200/shades[srcoff];
                srcoff++;
                let pixoff = v * (image.width * 4) + u * 4;
                dest.data[doff++] = image.data[pixoff++] * shade;
                dest.data[doff++] = image.data[pixoff++] * shade<<1;
                dest.data[doff++] = image.data[pixoff++] * shade<<2;//blueshift
                dest.data[doff++] = image.data[pixoff++];
            }
        }
        scr.ctx.putImageData(dest, 0, 0 );
        requestAnimationFrame(draw);
    }

    setup();
})();