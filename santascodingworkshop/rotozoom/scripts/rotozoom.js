/** rotozoom */
(function(){
    var scr;
    let image;
    let angle;
    let dest;
    let xoff;
    let yoff;
    function setup() {
        scr = dcl.setupScreen(600 ,400 );
        
        scr.setBgColor('black');
        document.body.style.backgroundColor = 'black';     
        angle = 0;
        let img = new Image();
        img.onload = function(){
            let el = document.createElement("div");
            let tmp = dcl.setupScreen(img.width, img.height, false, 0, el);
            dcl.image(img,0,0,img.width, img.height);
            image = tmp.ctx.getImageData(0,0,img.width, img.height);
        console.log(image);
            draw();
        } 
            dest = scr.ctx.getImageData(0,0,scr.width, scr.height);
        img.src="2ndtribute.png";
        xoff = 0;
        yoff = 0;
    }

    function draw(){
        angle = (angle + .8) % 360;
        let dOffset = 0;
        let rad = angle.toRadians();
        let s = sin(rad);
        let c = cos(rad);
        xoff = 0;//(xoff+5) % scr.width;
        yoff = 0;//(yoff+1) % scr.height;
        for(let y = 0;y<scr.height;y++){
            for(let x = 0;x<scr.width;x++){
                let u = 100+floor(((x*c)-y*s)*(s+1.2))&(image.width-1);
                let v = floor((x*s+y*c)*(s+1.2))&(image.height-1);
                while(v < 0){
                    v += image.height;
                }
                let sOffset = v * (image.width*4) + u * 4; //(u+(v<<8))<<2;
                dest.data[dOffset++] = image.data[sOffset++];
                dest.data[dOffset++] = image.data[sOffset++];
                dest.data[dOffset++] = image.data[sOffset++];
                dest.data[dOffset++] = image.data[sOffset++];
            }
        }
        scr.ctx.putImageData(dest, 0,0);
        requestAnimationFrame(draw);
    }
    setup();
})();