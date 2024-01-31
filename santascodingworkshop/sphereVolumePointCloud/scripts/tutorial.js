/** tutorial */
(function () {
    var mat4 = glMatrix.mat4;
    var vec3 = glMatrix.vec3;
    var scr;
    let vertexData, colorData, positionBuffer, colorBuffer, vertexShader, fragmentShader;
    function setup() {
        scr = dcl.setupScreen(window.innerWidth, 460);
        scr.setBgColor('black');
        document.body.style.backgroundColor = 'black';
        var heading = document.createElement("h1");
        heading.innerText = "WebGL";
        document.body.appendChild(heading);
        scr.canvas.style.zIndex = -1;

        function randomColor() {
            return [Math.random(), Math.random(), Math.random()];
        }

        function sphereCloud(numPoints, radius) {
            let points = [];
            let r = () => Math.random() - .5;
            var f = 10;
            for (let i = 0; i < numPoints; i++) {
                let p = [r(),r(),r()];
                let out = vec3.normalize(vec3.create(), p);
                vec3.add(out, out, [r()/f,r()/f,r()/f]);
                vec3.multiply(out, out, [radius,radius,radius]);

                // const p = point([]);
                points.push(...out);
            }
            return points;
        }
        //vertexData
        vertexData = [

            // Front
            0.5, 0.5, 0.5,
            0.5, -.5, 0.5,
            -.5, 0.5, 0.5,
            -.5, 0.5, 0.5,
            0.5, -.5, 0.5,
            -.5, -.5, 0.5,

            // Left
            -.5, 0.5, 0.5,
            -.5, -.5, 0.5,
            -.5, 0.5, -.5,
            -.5, 0.5, -.5,
            -.5, -.5, 0.5,
            -.5, -.5, -.5,

            // Back
            -.5, 0.5, -.5,
            -.5, -.5, -.5,
            0.5, 0.5, -.5,
            0.5, 0.5, -.5,
            -.5, -.5, -.5,
            0.5, -.5, -.5,

            // Right
            0.5, 0.5, -.5,
            0.5, -.5, -.5,
            0.5, 0.5, 0.5,
            0.5, 0.5, 0.5,
            0.5, -.5, 0.5,
            0.5, -.5, -.5,

            // Top
            0.5, 0.5, 0.5,
            0.5, 0.5, -.5,
            -.5, 0.5, 0.5,
            -.5, 0.5, 0.5,
            0.5, 0.5, -.5,
            -.5, 0.5, -.5,

            // Bottom
            0.5, -.5, 0.5,
            0.5, -.5, -.5,
            -.5, -.5, 0.5,
            -.5, -.5, 0.5,
            0.5, -.5, -.5,
            -.5, -.5, -.5,
        ];
        vertexData = sphereCloud(1e4, 3.5);
        colorData = [

        ];
        // for (let i = 0; i < 6; i++) {
        //     let c = randomColor();
        //     for (let j = 0; j < 6; j++) {
        //         colorData.push(...c);
        //     }
        // }


        //createBuffer
        positionBuffer = scr.gl.createBuffer();
        scr.gl.bindBuffer(scr.gl.ARRAY_BUFFER, positionBuffer);
        scr.gl.bufferData(scr.gl.ARRAY_BUFFER, new Float32Array(vertexData), scr.gl.STATIC_DRAW);

        // colorBuffer = scr.gl.createBuffer();
        // scr.gl.bindBuffer(scr.gl.ARRAY_BUFFER, colorBuffer);
        // scr.gl.bufferData(scr.gl.ARRAY_BUFFER, new Float32Array(colorData), scr.gl.STATIC_DRAW);
        // //vertex Shader
        vertexShader = scr.gl.createShader(scr.gl.VERTEX_SHADER);
        scr.gl.shaderSource(vertexShader, `
        precision mediump float;
        attribute vec3 position;
        // attribute vec3 color;
        varying vec3 vColor;
        uniform mat4 matrix;
        uniform float t;
        void main(){
            gl_PointSize = 5.0;
            vColor = vec3(sin(position.zzz*3.0*sin(t/1000.))+sin(position.yyy * 2.* cos(t/500.)));
            gl_Position = matrix * vec4(position+sin(t/1000.),1.0);
        }
        `);
        scr.gl.compileShader(vertexShader);
        var compiled = scr.gl.getShaderParameter(vertexShader, scr.gl.COMPILE_STATUS);
        console.log('Shader compiled successfully: ' + compiled);
        var compilationLog = scr.gl.getShaderInfoLog(vertexShader);
        console.log('Shader compiler log: ' + compilationLog);
        //fragment Shader
        fragmentShader = scr.gl.createShader(scr.gl.FRAGMENT_SHADER);
        scr.gl.shaderSource(fragmentShader, `
        precision mediump float;
        varying vec3 vColor;
        uniform float t;
        void main(){
            gl_FragColor = vec4(vColor+vec3(sin(t/1000.)+sin(t/200.), sin(t/1000.),cos(t/500.)+cos(t/1000.*3.)), 1);
        }
        `);
        scr.gl.compileShader(fragmentShader);

        //create program
        const program = scr.gl.createProgram();
        //attach shaders
        scr.gl.attachShader(program, vertexShader);
        scr.gl.attachShader(program, fragmentShader);
        scr.gl.linkProgram(program);

        var success = scr.gl.getProgramParameter(program, scr.gl.LINK_STATUS);
        if (!success) {
            // something went wrong with the link
            throw ("program failed to link:" + scr.gl.getProgramInfoLog(program));
        }
        //enable vertex attributes
        const positionRef = scr.gl.getAttribLocation(program, "position");
        scr.gl.enableVertexAttribArray(positionRef);
        scr.gl.bindBuffer(scr.gl.ARRAY_BUFFER, positionBuffer);
        scr.gl.vertexAttribPointer(positionRef, 3, scr.gl.FLOAT, false, 0, 0);
        const colorRef = scr.gl.getAttribLocation(program, 'color');
        scr.gl.enableVertexAttribArray(colorRef)
        scr.gl.bindBuffer(scr.gl.ARRAY_BUFFER, colorBuffer);
        scr.gl.vertexAttribPointer(colorRef, 3, scr.gl.FLOAT, false, 0, 0);
        scr.gl.useProgram(program);
        scr.gl.enable(scr.gl.DEPTH_TEST);
        const modelMatrix = mat4.create();
        const projectionMatrix = mat4.create();
        const mvpMatrix = mat4.create();
        const mvMatrix = mat4.create();
        const camMatrix = mat4.create();
        const unitMatrix = mat4.create();
        mat4.perspective(projectionMatrix,
            (75).toRadians(),
            scr.width / scr.height,
            1e-4,
            1e4);


        mat4.translate(modelMatrix, modelMatrix, [-1.5, 0, -2.0]);
        mat4.translate(camMatrix, camMatrix, [0, 0, 2]);
        mat4.invert(camMatrix, camMatrix);

        mat4.rotateX(modelMatrix, modelMatrix, (135).toRadians());

        const uniformLocations = {
            matrix: scr.gl.getUniformLocation(program, "matrix"),
            t: scr.gl.getUniformLocation(program, "t")
        };
        console.log(camMatrix);

        function animate(t) {
            requestAnimationFrame(animate);
            mat4.rotateX(modelMatrix, modelMatrix, (2).toRadians());
            mat4.rotateZ(camMatrix, camMatrix, (1).toRadians())
            mat4.rotateZ(modelMatrix, modelMatrix, (2).toRadians());
            mat4.multiply(mvMatrix, camMatrix, modelMatrix);
            mat4.multiply(mvpMatrix, projectionMatrix, mvMatrix);
            scr.gl.uniformMatrix4fv(uniformLocations.matrix, false, mvpMatrix);
            scr.gl.uniform1f(uniformLocations.t, t);
            scr.gl.drawArrays(scr.gl.POINTS, 0, vertexData.length / 3);

        }
        //draw
        animate(0);

    }

    setup();
})();