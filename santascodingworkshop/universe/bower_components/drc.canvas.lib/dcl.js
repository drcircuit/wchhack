/**
 * Created by Espen on 03.03.2017.
 */
var dcl    = function () {

    function setCanvasSize(canvas, width, height, keepSquare) {
        canvas.width  = width || window.innerWidth;
        canvas.height = height || window.innerHeight;
        if (keepSquare) {
            if (canvas.width < canvas.height) {
                canvas.height = canvas.width;
            } else {
                canvas.width = canvas.height;
            }
        }
    }

    function setCanvasStyle(canvas, width, height) {
        canvas.style.padding  = 0;
        canvas.style.margin   = 'auto';
        canvas.style.position = 'absolute';
        canvas.style.top      = 0;
        canvas.style.left     = 0;
        canvas.style.right    = 0;
        canvas.style.bottom   = 0;
        canvas.style.width    = width;
        canvas.style.height   = height;
    }

    function createGrid(gridScale, canvas) {
        var cols, rows;
        if (gridScale) {
            cols = Math.floor(canvas.width / gridScale);
            rows = Math.floor(canvas.height / gridScale);
        } else {
            cols = canvas.width;
            rows = canvas.height;
        }
        return {cols: cols, rows: rows};
    }

    return {
        setupScreen: function (width, height, keepSquare, gridScale) {
            var canvas = document.createElement('canvas');
            canvas.id  = 'space';
            setCanvasSize(canvas, width, height, keepSquare);
            var grid = createGrid(gridScale, canvas);
            setCanvasStyle(canvas, width, height);

            document.body.appendChild(canvas);

            return {
                ctx: canvas.getContext('2d'),
                width: canvas.width,
                height: canvas.height,
                cols: grid.cols,
                rows: grid.rows,
                setBgColor: function (color) {
                    canvas.style.backgroundColor = color;
                },

                randomSpot: function () {
                    return vector.creteVector(Math.floor(Math.random() * grid.cols), Math.floor(Math.random() * grid.rows));
                }

            }
        }
    };
}();
var vector = {
    creteVector: function (x, y) {
        return {
            x: x,
            y: y,
            collidesWith: function (vector) {
                return x === vector.x & y === vector.y;
            }
        };
    }
};