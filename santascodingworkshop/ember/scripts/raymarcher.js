
const canvas = setupCanvas();
const gl = canvas.getContext("experimental-webgl");
gl.viewport(0, 0, canvas.width, canvas.height);
let program, timeLocation, resolutionLocation, mouseLocation;
let useResize = window.innerWidth === window.innerWidth || window.innerHeight === window.innerHeight;
const buffer = gl.createBuffer();
loadShaders(ready);

function setupCanvas() {
    const c = document.createElement("canvas");
    
    c.id = "space";
    c.width = 800;
    c.height = 600;
    document.body.appendChild(c);
    document.body.style.backgroundColor = "black";
    window.addEventListener("resize", resize);
    document.addEventListener("mousemove", mousemove);
    return c;
}

function resize() {
    if(!useResize){
        return;
    }
    var w = window.innerWidth;
    var h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;
    console.log(w,h);
    gl.uniform2f(resolutionLocation, w, h);
    gl.viewport(0, 0, w, h);
}

function mousemove(e) {
    var cRect = canvas.getBoundingClientRect();              // Gets the CSS positions along with width/height
    var canvasX = Math.round(e.clientX - cRect.left);        // Subtract the 'left' of the canvas from the X/Y
    var canvasY = Math.round(e.clientY - cRect.top);  
    gl.uniform2f(mouseLocation, canvasX/canvas.width, canvasY/canvas.height);
}

function render(time){
    if(time === 0){
        console.log("running");
    }
    gl.uniform1f(timeLocation, time * 0.001);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    requestAnimationFrame(render);
}

function ready() {
    gl.useProgram(program);
    let positionLocation = gl.getAttribLocation(program, "a_position");
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1.0, -1.0, 1.0, -1.0, -1.0, 1.0,
        -1.0, 1.0, 1.0, -1.0, 1.0, 1.0]), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.uniform2fv(resolutionLocation, [canvas.width, canvas.height]);
    requestAnimationFrame(render);
}

function loadShaders(cb) {
    fetch("shaders/vertex.shader")
        .then((res) => res.text())
        .then((text) => {
            program = gl.createProgram();
            buildShader(text, gl.VERTEX_SHADER, program);
            return fetch("shaders/fragment.shader");
        })
        .then((res) => res.text())
        .then((text) => {
            buildShader(text, gl.FRAGMENT_SHADER, program);
            gl.linkProgram(program);
            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                console.error("Cannot link program", gl.getProgramInfoLog(program));
            }
            timeLocation = gl.getUniformLocation(program, "u_time");
            resolutionLocation = gl.getUniformLocation(program, "u_resolution");
            mouseLocation = gl.getUniformLocation(program, "u_mousePos");
            cb(0);
        })
        .catch((err) => {
            console.log(err);
        });
}

function buildShader(source, type, program) {
    let shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Cannot compile shader\nSyntax error!", gl.getShaderInfoLog(shader));
        return;
    }
    gl.attachShader(program, shader);
}
