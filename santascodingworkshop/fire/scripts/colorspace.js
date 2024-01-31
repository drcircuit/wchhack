/** colorspace */
(function(){
    var scr;
    let pallette = [];
    let flame = [];
    let f = 1;
    let id;
    let pd;
    function setup() {
        scr = dcl.setupScreen(640 ,480);
        scr.setBgColor('black');
        document.body.style.backgroundColor = 'black';    
        
        // Generate 256 color pallette;
        for(let i = 0;i<255;i++){
            let l = i/255;
            let h = i.map(0,255,0,85); // 0 deg to 85 deg i HSL space is red to yellow
            pallette.push(HSLtoRGB(h,1,l));
        }
        // Initialize color buffer
        for(let y = 0;y<scr.height;y+=f){
            let row = [];
            for(let x = 0;x<scr.width;x+=f){
                row.push(y === scr.height-1 ? dcl.randomi(0,255):0);
            }
            flame.push(row);
        }
        // initialize screen buffer
        id = new ImageData(scr.width, scr.height);
    }
    function draw(t){
        //Set last row to random
        for(let x = 0;x<flame[flame.length-1].length;x++){
            flame[flame.length-1][x] = dcl.randomi(0,255); 
        }
        //Calculate sum for adjecent pixles:
        // |0|1|0| <-- Pixel (1 = in sum, 0 = excluded)
        // |1|1|1| 
        // |0|1|0| 
        //
        for(let y = 0;y<flame.length-1;y++){
            for(let x = 0;x<flame[y].length;x++){
                let y1 = (y+1)%flame.length;
                let y2 = (y+2)%flame.length;
                let x1 = (x-1+flame[y].length)%flame[y].length;
                let x2 = x %flame[y].length;
                let x3 = (x+1+flame[y].length)%flame[y].length;
                let sum = ((
                    flame[y1][x1] +
                    flame[y1][x2] +
                    flame[y1][x3] +
                    flame[y2][x2]
                ))/4.020; // this average controls how high the fire can rise
                flame[y][x] = sum;
            }
        }

        // Draw everything on the screen (push to a imagedata buffer first
        // Drawing each pixel directly greatly reduces performance!);
        for(let y = 0; y<scr.height;y+=f){
            for(let x = 0;x<scr.width;x+=f){
                let fy = (y/f) % flame.length;
                let fx = (x/f) % flame[fy].length;
                let i = Math.floor(flame[fy][fx]);
                let cf = pallette[i];
                if(!cf){
                    continue;
                }
                let idx = 4 * (y*scr.width + x);
                 
                id.data[idx] = cf.r;
                id.data[idx+1] = cf.g;
                id.data[idx+2] = cf.b;
                id.data[idx+3] = 255;
                let pr = pd.data[idx];
                let pa = pd.data[idx+3];
                //Lookup in logo mask buffer to render it in fire! :)
                if(pr < 64 && pa >0){
                    flame[fy][fx] = dcl.randomi(0,255);
                }
                if(pr === 255 && pa === 255){
                    id.data[idx] = 0;
                    id.data[idx+1] = 0;
                    id.data[idx+2] = 0;
                    id.data[idx+3] = 255;
                }
                
            }
        }
        scr.ctx.putImageData(id,0,0);
        requestAnimationFrame(draw);
    }
    // Helper function to generate pallette.

    function HSLtoRGB(h,s,l){
        let r = 0,g = 0,b = 0 ;
        if(s === 0){
            r = g = b = l;
        } else {
            let hp = h/60;
            let c = (1-Math.abs(2*l-1))*s;
            let x = c * (1-Math.abs(hp % 2 - 1));
      
            if(hp >= 0 && hp <=1){
                r = c;
                g = x;
                b = 0;
            }
            if(hp > 1 && hp <=2){
                r = x;
                g = c;
                b = 0;
            }
            if(hp >2 && hp <=3){
                r = 0;
                g = c;
                b = x;
            }
            if(hp >3 && hp <=4){
                r = 0;
                g = x;
                b = c;
            }
            if(hp > 4&&hp <=5){
                r = x;
                g = 0;
                b = c;
            }
            if(hp > 5 && hp <=6){
                r = c;
                g = 0;
                b = x;
            }
            let m = l-c/2;
            r = r+m;
            g = g+m;
            b = b+m;
        }
        return dcl.color(Math.round(r*255),Math.round(g*255),Math.round(b*255));

    }
    //load fire logo mask.
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    let img = new Image();
    img.src = "firelogo.png";
    img.addEventListener("load", function(){
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img,0,0);
        pd = ctx.getImageData(0,0,img.width, img.height);
        setup();
        draw();
    });
    
})();