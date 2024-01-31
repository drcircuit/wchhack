/** tesseract */
(function () {
    var scr;
    var points = [
        dcl.vector.point(-1, -1, -1, 1),
        dcl.vector.point(1, -1, -1, 1),
        dcl.vector.point(1, 1, -1, 1),
        dcl.vector.point(-1, 1, -1, 1),

        dcl.vector.point(-1, -1, 1, 1),
        dcl.vector.point(1, -1, 1, 1),
        dcl.vector.point(1, 1, 1, 1),
        dcl.vector.point(-1, 1, 1, 1),

        dcl.vector.point(-1, -1, -1, -1),
        dcl.vector.point(1, -1, -1, -1),
        dcl.vector.point(1, 1, -1, -1),
        dcl.vector.point(-1, 1, -1, -1),

        dcl.vector.point(-1, -1, 1, -1),
        dcl.vector.point(1, -1, 1, -1),
        dcl.vector.point(1, 1, 1, -1),
        dcl.vector.point(-1, 1, 1, -1),
    ];
    var angle = 0.01;
    var ppoints = [];

    function setup() {
        scr = dcl.setupScreen(window.innerWidth, window.innerHeight);
        scr.setBgColor('black');
        document.body.style.backgroundColor = 'black';
        clear();


    }

    setup();
    draw();

    function clear() {
        scr.ctx.restore();
        dcl.clear();
        scr.ctx.save();
        scr.ctx.translate(scr.width / 2, scr.height / 2);
    }

    function matrixMultiply(vector, projectionMatrix) {
        let x = projectionMatrix[0][0] * vector.x + projectionMatrix[0][1] * vector.y + projectionMatrix[0][2] * vector.z + projectionMatrix[0][3] * vector.w;
        let y = projectionMatrix[1][0] * vector.x + projectionMatrix[1][1] * vector.y + projectionMatrix[1][2] * vector.z + projectionMatrix[1][3] * vector.w;
        let z = projectionMatrix[2][0] * vector.x + projectionMatrix[2][1] * vector.y + projectionMatrix[2][2] * vector.z + projectionMatrix[2][3] * vector.w;
        let w = 0;
        if (projectionMatrix[3]) {
            w = projectionMatrix[3][0] * vector.x + projectionMatrix[3][1] * vector.y + projectionMatrix[3][2] * vector.z + projectionMatrix[3][3] * vector.w;
        }

        // console.log(vector, x,y,z);
        return dcl.vector.point(x, y, z, w);
    }

    function rotateZ(vector, angle) {
        return matrixMultiply(vector, [
            [Math.cos(angle), -Math.sin(angle), 0, 0],
            [Math.sin(angle), Math.cos(angle), 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1],
        ]);
    }

    function rotateX(vector, angle) {
        return matrixMultiply(vector, [
            [1, 0, 0, 0],
            [0, Math.cos(angle), Math.sin(angle), 0],
            [0, -Math.sin(angle), Math.cos(angle), 0],
            [0, 0, 0, 1]
        ]);
    }

    function rotateYW(vector, angle) {
        return matrixMultiply(vector, [
            [1, 0, 0, 0],
            [0, Math.cos(angle), 0, -Math.sin(angle)],
            [0, 0, 1, 0],
            [0, Math.sin(angle), 0, Math.cos(angle)],
        ]);
    }

    function rotateY(vector, angle) {
        return matrixMultiply(vector, [
            [Math.cos(angle), 0, -Math.sin(angle), 0],
            [0, 1, 0, 0],
            [Math.sin(angle), 0, Math.cos(angle), 0],
            [0, 0, 0, 1]
        ]);
    }

    function rotateZW(vector, angle) {
        return matrixMultiply(vector, [
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, Math.cos(angle), -Math.sin(angle)],
            [0, 0, Math.sin(angle), Math.cos(angle)],
        ]);
    }

    function connect(va, vb) {
        dcl.line(va.x, va.y, vb.x, vb.y, 1.7, "rgba(0,255,0,0.4)");
    }

    function draw() {
        clear();

        points.forEach((p, i) => {

            let rotated = rotateZ(rotateZW(rotateYW(rotateX(p, angle),angle),angle),angle);
            var distance = 2;

            let w = 1 / (distance - rotated.w);
            let projectionMatrix = [
                [w, 0, 0, 0],
                [0, w, 0, 0],
                [0, 0, w, 0]
            ];
            let projected = matrixMultiply(rotated, projectionMatrix).mul(200);
            ppoints[i] = projected;
            dcl.circle(projected.x, projected.y, 2, "cyan");

        });
        angle = angle + .02;
        for (let i = 0; i < 4; i++) {
            let b = i === 3 ? 0 : i + 1;
            connect(ppoints[i], ppoints[b]);
            connect(ppoints[i], ppoints[i + 4]);
            connect(ppoints[i + 4], ppoints[b + 4]);
            connect(ppoints[i + 4 + 8], ppoints[b + 4 + 8]);
            connect(ppoints[i + 8], ppoints[b + 8]);
            connect(ppoints[i + 8], ppoints[i + 4 + 8]);
            connect(ppoints[i + 8], ppoints[i]);
            connect(ppoints[i * 2 + 8], ppoints[i * 2]);
            connect(ppoints[i * 2 + 8 + 1], ppoints[i * 2 + 1]);
        }
        requestAnimationFrame(draw);
    }
})();