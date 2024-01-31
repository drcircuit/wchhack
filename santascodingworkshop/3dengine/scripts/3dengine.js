/** 3dengine */
(function(){
    var scr;
    let obj;
    let theta = 0;
    let start = 0;
    let projmat;
    let framebuffer;
    let screenbuffer;
    let camera = dcl.vector(0,0,0);
    let flame = [];
    let pd;
    let f = 1;
    let params = new URLSearchParams(window.location.search);
    let pallette = dcl.pallette.fire;
    function matrix(m){
        return {m:m || [
            [1,0,0,0],
            [0,1,0,0],
            [0,0,1,0],
            [0,0,0,1],
        ],isMatrix:true};
    }
    function compare(a,b) {
        if (a.y < b.y)
          return -1;
        if (a.y > b.y)
          return 1;
        return 0;
      }
    let zs = [];
    function zcompare(a, b) {
        let aavg = (a.v[0].z+a.v[1].z+a.v[2].z)/3;
        let bavg = (b.v[0].z+b.v[1].z+b.v[2].z)/3;

        if(!zs.includes(a.v[0].z)){
            zs.push(a.v[0].z);
        }     
        aavg /= 3;
        bavg /= 3;
        if (aavg < bavg)
            return 1;
        if (aavg > bavg)
            return -1;
        return 0;
    }

    
    function projectionmatrix(fov,aspect,znear,zfar){
        let fovrad = 1/Math.tan((fov/2).toRadians());
        let m = matrix();
        m.m[0][0] = aspect*fovrad;
        m.m[1][1] = fovrad;
        m.m[2][2] = zfar / (zfar-znear);
        m.m[3][2] = (-zfar *znear)/(zfar-znear);
        m.m[2][3] = 1;
        m.m[3][3] = 0;
        return m;
    }
    
    function triangle(vertices){
        vertices = vertices ||  [
            dcl.vector(0,0,0),
            dcl.vector(1,0,0),
            dcl.vector(0,1,0)
        ];
        return {
            v:vertices,
            matrixmul:function(matrix){
                return triangle(
                    [
                        vertices[0].matrixmul(matrix),
                        vertices[1].matrixmul(matrix),
                        vertices[2].matrixmul(matrix)
                    ]);
            },
            normalize: function(){
                v1 = vertices[0].div(vertices[0].w);
                v2 = vertices[1].div(vertices[1].w);
                v3 = vertices[2].div(vertices[2].w);
                return triangle([v1,v2,v3]);
            },
            col: WHITE
        };
    }
    
    function mesh(tris){
        return {
            tris:tris
        };
    }

    
    function drawpixel(x,y,c){
        let ix = 4*(x + y*framebuffer.width);

        framebuffer.data[ix] = c.r;
        framebuffer.data[ix+1] = c.g;
        framebuffer.data[ix+2] = c.b;
        framebuffer.data[ix+3] = Math.floor(c.a.map(0,1,0,255));
    }
    function setup() {
        scr = dcl.setupScreen(640 ,400);
        framebuffer = new ImageData(scr.width, scr.height);
        screenbuffer = new ImageData(scr.width, scr.height);
        pd = new ImageData(scr.width, scr.height);
        scr.setBgColor('black');
        document.body.style.backgroundColor = 'gray';      
        //obj = cube();
        let znear = 0.1;
        let zfar = 1000;
        let fov = 90;
        let aspect = scr.height/scr.width;
        projmat = dcl.matrix.projection(fov,aspect,znear,zfar);
        for(let y = 0;y<scr.height;y+=f){
            let row = [];
            for(let x = 0;x<scr.width;x+=f){
                row.push(y === scr.height-1 ? dcl.randomi(0,255):0);
            }
            flame.push(row);
        }
    }
    function updateflame(){
        // for(let x = 0;x<flame[flame.length-1].length;x++){
        //     flame[flame.length-1][x] = dcl.randomi(0,255); 
        // }
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
    }
    function plotlinehigh(x1,y1,x2,y2,c){  
        x1 = round(x1); x2 = round(x2); y1 = round(y1); y2 = round(y2);
        let dx,dy;
        let xi = 1;
        dx = x2-x1;
        dy = y2-y1;
        if(dx<0){
            xi = -1;
            dx = -dx;
        }
        let d = 2*dx-dy;
        let x = x1;
        for(let y=y1;y<=y2;y++){
            drawpixel(x,y,c);
            if(d>0){
                x = x + xi;
                d = d-2*dy;
            }
            d = d + 2*dx;
        }
    }

    function plotlinelow (x1,y1,x2,y2,c){
        x1 = round(x1); x2 = round(x2); y1 = round(y1); y2 = round(y2);
        let dx = x2-x1;
        let dy = y2-y1;
        let yi = 1;
        if(dy<0){
            yi = -1;
            dy = -dy;
        }
        let d = 2*dy-dx;
        let y = y1;
        for(let x = x1;x<=x2;x++){
            drawpixel(x,y,c);
            if(d>0){
                y = y + yi;
                d = d - 2*dx;
            }
            d = d + 2*dy;
        }
    }

    function plotline(x1,y1,x2,y2,c){
        if(abs(y2-y1)<abs(x2-x1)){
            if(x1>x2){
                plotlinelow(x2,y2,x1,y1,c);
            } else {
                plotlinelow(x1,y1,x2,y2,c);
            }
        } else {
            if(y1>y2){
                plotlinehigh(x2,y2,x1,y1,c);
            } else {
                plotlinehigh(x1,y1,x2,y2,c);
            }
        }
    }

    function drawwireframe(tri,c){
        plotline(tri.v[0].x,tri.v[0].y,tri.v[1].x,tri.v[1].y,c);
        plotline(tri.v[1].x,tri.v[1].y,tri.v[2].x,tri.v[2].y,c);
        plotline(tri.v[0].x,tri.v[0].y,tri.v[2].x,tri.v[2].y,c);
    }

    function drawshaded(tri,col){
        tri.v.sort(compare);
        let a = tri.v[0].round();
        let b = tri.v[1].round();
        let c = tri.v[2].round();

        let islope1 = (b.x-a.x)/(b.y-a.y);
        let islope2 = (c.x-a.x)/(c.y-a.y);

        let cx1 = a.x;
        let cx2 = a.x;
        for(let y = a.y;y<=b.y;y++){
            plotline(cx1,y,cx2,y,col);
            cx1 += islope1;
            cx2 += islope2;
        }

        islope1 = (c.x-a.x)/(c.y-a.y);
        islope2 = (c.x-b.x)/(c.y-b.y);
        cx1 = c.x;
        cx2 = c.x;
        for(let y = c.y;y>=b.y;y--){
            plotline(cx1,y,cx2,y,col);
            cx1 -= islope1;
            cx2 -= islope2;
        }
    }

    function lookAtMatrix(o,vp){
        let m = matrxi();

    }
    function clear(buffer){
        for(let i =0;i<buffer.data.length;i+=4){
            pd.data[i] = buffer.data[i];
            pd.data[i+1] = buffer.data[i+1];
            pd.data[i+2] = buffer.data[i+2];
            pd.data[i+3] = buffer.data[i+3];
            buffer.data[i] = 0;
            buffer.data[i+1] = 0;
            buffer.data[i+2] = 0;
            buffer.data[i+3] = 0;
        }
    }
    function draw(t){
        dcl.clear();
        clear(framebuffer);
        // Draw Tris
        let dt = t-start;
        theta += dt/10;
        
        //theta = (10);
        start = t;
        let halftheta = theta/2;
        let quartertheta = theta/4;
        let worldmatrix = dcl.matrix();
        worldmatrix = worldmatrix.mul(dcl.matrix.rotation.z(sin(theta/20)*15));
        worldmatrix = worldmatrix.mul(dcl.matrix.rotation.x(180));
        worldmatrix = worldmatrix.mul(dcl.matrix.rotation.y(-theta));
        let zdist = params.has("zdist") ? Number(params.get("zdist")) : 8;
        worldmatrix = worldmatrix.mul(dcl.matrix.translation(0,0,zdist));
        let rasterizetris = [];
        let cols = [];
        obj.tris.forEach(function(tri){
            
            let translated = tri.matrixmul(worldmatrix);
            
            let line1 = translated.v[1].sub(translated.v[0]);
            let line2 = translated.v[2].sub(translated.v[0]);

            let normal = line1.cross(line2).norm();
            let viewplane = translated.v[0].sub(camera);
            let prod = normal.dot(viewplane);
            if(Math.round(prod)<0){
                let light = dcl.vector(0,0,-1,0).norm();
                
                let vproj = translated.matrixmul(projmat).normalize();
                let scalingvector = dcl.vector(scr.width/2,scr.height/2,1);
                let drawtri = triangle(
                    [
                        vproj.v[0].add(1,1).mul(scalingvector),
                        vproj.v[1].add(1,1).mul(scalingvector),
                        vproj.v[2].add(1,1).mul(scalingvector)
                    ]);
                let dp = normal.dot(light);
                let col = Math.floor(dp.map(0.2,1,0,255));
                if(col<0){
                    col = 0;
                }
                if(col > 255){
                    col = 255;
                }
                drawtri.col = dcl.pallette.gray[col];
                if(!drawtri.col){
                    console.log("balle");
                }
                cols.push(light.dot(normal));
                rasterizetris.push(drawtri);
            }
        });
        zs = [];
        rasterizetris.sort(zcompare);
        for(let i =0;i<rasterizetris.length;i++){
            let drawtri = rasterizetris[i];
            if(params.has("wire")){
                drawwireframe(drawtri,dcl.color(0,128,255));
            } else {
                drawshaded(drawtri, drawtri.col);
            }
        }
        
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
                 
                screenbuffer.data[idx] = cf.r;
                screenbuffer.data[idx+1] = cf.g;
                screenbuffer.data[idx+2] = cf.b;
                screenbuffer.data[idx+3] = 255;
                let pr = pd.data[idx];
                let pa = pd.data[idx+3];
                //Lookup in logo mask buffer to render it in fire! :)
                if(pr < 64 && pa >0){
                    flame[fy][fx] = dcl.randomi(0,255);
                }
                if(pr === 255 && pa === 255){
                    screenbuffer.data[idx] = 0;
                    screenbuffer.data[idx+1] = 0;
                    screenbuffer.data[idx+2] = 0;
                    screenbuffer.data[idx+3] = 255;
                }
                
            }
        }
        scr.ctx.putImageData(framebuffer,0,0);  
        //dcl.text(theta.toFixed(2),20,20,"white","Arial",12);      
        requestAnimationFrame(draw);
        
    }
    function loadobj(url, cb) {
        let rq = new XMLHttpRequest();
        rq.open("GET", url);

        rq.addEventListener("load", function (res) {
            let lines = rq.responseText.split("\n");
            let tris = [];
            let verts = [];
            let lowz = 0;
            lines.forEach(function (l) {
                if (l.substr(0, 1) === "v") {
                    //read vertex data from obj file
                    let d = l.split(" ");
                    let x = Number(d[1]);
                    let y = Number(d[2]);
                    let z = Number(d[3]);
                    if (z < lowz) {
                        lowz = z;
                    }
                    verts.push(dcl.vector(x, y, z, 1));
                }
                if (l.substr(0, 1) === "f") {
                    //read face data from obj file
                    let d = l.split(" ");
                    vidx1 = Number(d[1]) - 1;
                    vidx2 = Number(d[2]) - 1;
                    vidx3 = Number(d[3]) - 1;
                    let v1 = verts[vidx1];
                    let v2 = verts[vidx2];
                    let v3 = verts[vidx3];
                    tris.push(triangle([v1, v2, v3]));
                }
            });
            cb(mesh(tris));
        });
        rq.send();
    }
    let lobj = params.has("obj") ? params.get("obj")+".obj" : "cube.obj";
    loadobj(lobj, function (mesh) {
        obj = mesh;
        setup();
        draw(0);
    });
})();