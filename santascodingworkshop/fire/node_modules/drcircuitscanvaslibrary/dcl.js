/**
 * Created by Espen on 03.03.2017.
 */
var dcl = function () {

    function setCanvasSize(canvas, width, height, keepSquare) {
        canvas.width = width || window.innerWidth;
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
        canvas.style.padding = 0;
        canvas.style.margin = 'auto';
        canvas.style.position = 'absolute';
        canvas.style.top = 0;
        canvas.style.left = 0;
        canvas.style.right = 0;
        canvas.style.bottom = 0;
        canvas.style.width = width;
        canvas.style.height = height;
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
        return { cols: cols, rows: rows };
    }

    return {
        setupScreen: function (width, height, keepSquare, gridScale, parent) {
            var canvas = document.createElement('canvas');
            canvas.id = 'space';
            setCanvasSize(canvas, width, height, keepSquare);
            var grid = createGrid(gridScale, canvas);
            setCanvasStyle(canvas, width, height);
            if (parent) {
                parent.appendChild(canvas);
            } else {
                document.body.appendChild(canvas);
            }
            dcl.renderContext = canvas.getContext('2d');
            dcl.screen = { width: canvas.width, height: canvas.height };
            return {
                ctx: dcl.renderContext,
                width: canvas.width,
                height: canvas.height,
                cols: grid.cols,
                rows: grid.rows,
                setBgColor: function (color) {
                    canvas.style.backgroundColor = color;
                },

                randomSpot: function () {
                    return dcl.vector.point(Math.floor(Math.random() * grid.cols), Math.floor(Math.random() * grid.rows));
                }

            }
        }
    };
}();
dcl.const = {
    phi: (1 + Math.sqrt(5)) / 2,
    iphi: 2 / (1 + Math.sqrt(5)),
    pi: Math.PI,
    e: Math.E,
    r2: Math.sqrt(2),
    ir2: 1 / Math.sqrt(2)
};
dcl.rad = function (deg) {
    return deg * Math.PI / 180;
};
dcl.trig = function (deg) {
    var r = dcl.rad(deg);
    var c = cos(rad);
    var s = sin(rad);
    return {
        rad: r,
        cos: c,
        sin: s,
        transform: function (a, b) {
            return { a: a * cos - b * s, b: a * s + b * c };
        }
    };
};

dcl.vector = {
    point: function (x, y, z, w) {
        x = x || 0;
        y = y || 0;
        z = z || 0;
        w = w || 0;

        function magsqr() {
            return x * x + y * y + z * z + w * w;
        }

        function mag() {
            return Math.sqrt(magsqr());
        }

        return {
            x: x,
            y: y,
            z: z,
            w: w,
            collidesWith: function (vector, threshold) {
                return Math.abs(x - vector.x) <= threshold && Math.abs(y - vector.y) <= threshold && Math.abs(z - vector.z) <= threshold;
            },
            rotateX: function (angle) {
                var tv = dcl.trig(angle).transform(y, z);
                return dcl.vector.point(x, tv.a, tv.b);
            },
            rotateY: function (angle) {
                var tv = dcl.trig(angle).transform(x, z);
                return dcl.vector.point(tv.a, y, tv.b);
            },
            rotateZ: function (angle) {
                var tv = dcl.trig(angle).transform(x, y);
                return dcl.vector.point(tv.a, tv.b, z);
            },
            project: function (width, height, fov, distance) {
                var factor = fov / (distance + z);
                var nx = x * factor + width / 2;
                var ny = y * factor + height / 2;
                return dcl.vector.point(nx, ny, z);
            },
            add: function (vx, vy, vz, vw) {
                if (vx.isVector) {
                    return dcl.vector.point(x + vx.x, y + vx.y, z + vx.z, w + vx.w);
                }
                vx = vx || 0;
                vy = vy || 0;
                vz = vz || 0;
                vw = vw || 0;
                return dcl.vector.point(x + vx, y + vy, z + vz, w + vw);
            },
            sub: function (vx, vy, vz) {
                if (vx.isVector) {
                    return dcl.vector.point(x - vx.x, y - vx.y, z - vx.z, w - vx.w);
                }
                vx = vx || 0;
                vy = vy || 0;
                vz = vz || 0;
                vw = vw || 0;
                return dcl.vector.point(x - vx, y - vy, z - vz, w - vw);
            },
            mul: function (n) {
                n = n || 0;
                return dcl.vector.point(x * n, y * n, z * n, w * n);
            },
            div: function (n) {
                n = n || 1;
                return dcl.vector.point(x / n, y / n, z / n, w / n);
            },
            dot: function (vx, vy, vz, vw) {
                if (vx.isVector) {
                    return dcl.vector.point(x * vx.x, y * vx.y, z * vx.z, w * vx.w);
                }
                vx = vx || 0;
                vy = vy || 0;
                vz = vz || 0;
                vw = vw || 0;
                return dcl.vector.point(x * vx, y * vy, z * vz, w * vw);
            },
            cross: function (v) {
                var vx = y * v.z - z * v.y;
                var vy = z * v.x - x * v.z;
                var vz = x * v.y - y * v.x;
                return dcl.vector.point(vx, vy, vz);
            },
            mag: mag,
            dist: function (v) {
                var d = dcl.vector.point(x, y, z, w).sub(v);
                return d.mag();
            },
            norm: function () {
                return dcl.vector.point(x, y, z, w).div(mag());
            },
            magsqr: magsqr,
            isVector: true
        };
    },

};
dcl.playAnimation = true;
dcl.stopAnimation = function () {
    dcl.playAnimation = false;
};
dcl.startAnimation = function () {
    dcl.playAnimation = true;
};
dcl.random = function (min, max) {
    return Math.random() * (max - min) + min;
};
dcl.randomi = function (min, max) {
    return Math.floor(dcl.random(min, max));
};
dcl.clear = function (ctx) {
    ctx = dcl.getCtx(ctx);
    ctx.clearRect(0, 0, dcl.screen.width, dcl.screen.height);
};
dcl.animate = function () {
    var render = dcl.draw || draw;
    if (render) {
        dcl.clear();
        render();
        if (dcl.playAnimation) {
            requestAnimationFrame(dcl.animate);
        }
    }
};
dcl.rect = function (x, y, width, height, color, lineWidth, lineColor, ctx) {
    ctx = dcl.getCtx(ctx);
    height = height || width;
    if(color.isColor){
        color = color.toStyle();
    }
    ctx.fillStyle = color || "blue";
    ctx.fillRect(x, y, width, height);
    if (lineWidth) {
        lineColor = lineColor || "#000088";
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = lineWidth;
        ctx.strokeRect(x, y, width, height);
    }
};
dcl.stroke = function (color, lineWidth, ctx) {
    color = color || "blue";
    if (color.isColor) {
        color = color.toStyle();
    }
    ctx = dcl.getCtx(ctx);
    ctx.lineWidth = lineWidth;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeStyle = color || "#000088";
    ctx.stroke();
};
dcl.fill = function (color, ctx) {
    color = color || "blue";
    if (color.isColor) {
        color = color.toStyle();
    }
    ctx = dcl.getCtx(ctx);
    color = color || "blue";
    ctx.fillStyle = color;
    ctx.fill();
};
dcl.circle = function (x, y, radius, color, lineWidth, lineColor, ctx) {
    ctx = dcl.getCtx(ctx);
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, dcl.rad(360));
    dcl.fill(color, ctx);
    if (lineWidth) {
        dcl.stroke(lineColor, lineWidth, ctx);
    }
    ctx.closePath();
};
dcl.line = function (x, y, dx, dy, lineWidth, lineColor, ctx) {
    ctx = dcl.getCtx(ctx);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(dx, dy);
    dcl.stroke(lineColor, lineWidth, ctx);
    ctx.closePath();
};
dcl.getCtx = function (ctx) {
    return ctx || dcl.renderContext;
};

dcl.text = function (text, x, y, color, font, size, maxWidth, align, ctx) {
    ctx = dcl.getCtx(ctx);
    align = align || "center";
    color = color || "blue";
    color = color.isColor ? color.toStyle() : color;
    let style = (size || 16) + "px " + (font || "Arial");
    ctx.font = style;
    ctx.textAlign = align;
    ctx.fillStyle = color;
    if(maxWidth){
        ctx.fillText(text, x, y, maxWidth);
    } else {
        ctx.fillText(text, x, y);
    }
};

dcl.curve = {
    start: function (x, y, ctx) {
        ctx = dcl.getCtx(ctx);
        ctx.moveTo(x, y);
        ctx.beginPath();
    },
    end: function (ctx) {
        dcl.getCtx(ctx).closePath();
    },
    vertex: function (x, y, ctx) {
        dcl.getCtx(ctx).lineTo(x, y);
    },
    fill: function (color, ctx) {
        ctx = dcl.getCtx(ctx);
        dcl.fill(color, ctx);
    },
    stroke: function (color, width, ctx) {
        ctx = dcl.getCtx(ctx);
        dcl.stroke(color, width, ctx);
    },
    plot: function (points, lineColor, lineWidth) {
        if (!points.forEach) {
            console.error("Error! you must supply an array with coordinates as an argument to this function.");
            return;
        }
        points.forEach(function (p, i, a) {
            if (i === 0) {
                dcl.curve.start(p.x, p.y);
            } else if (i === a.length - 1) {
                dcl.curve.stroke(lineColor, lineWidth);
                dcl.curve.end();
            } else {
                dcl.curve.vertex(p.x, p.y);
            }
        });
    }
};

dcl.color = function (red, green, blue, alpha = 1.0) {
    return {
        r: floor(red),
        g: floor(green),
        b: floor(blue),
        a: alpha,
        toStyle: function () {
            return "rgba(" + red + "," + green + "," + blue + "," + alpha.toFixed(2) + ")";
        },
        isColor: true
    };
}
// Helper Extensions
Number.prototype.toRadians = function () {
    return this.valueOf() * (Math.PI / 180);
};
Number.prototype.toDegrees = function () {
    return this.valueOf() * (180 / Math.PI);
};
Number.prototype.map = function (inputScaleMin, inputScaleMax, outputScaleMin, outputScaleMax) {
    return (this.valueOf() - inputScaleMin) * (outputScaleMax - outputScaleMin) / (inputScaleMax - inputScaleMin) + outputScaleMin;
};

const KEYS = {
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    SPACE: 32,
    CONTROL: 17,
    ALT: 18,
    SHIFT: 16,
    WIN:91,
    WINCTX:92,
    ESCAPE: 27,
    PIPE:220,
    ONE:49,
    TWO:50,
    THREE:51,
    FOUR:52,
    FIVE:53,
    SIX:54,
    SEVEN:55,
    EIGHT:56,
    NINE:57,
    ZERO:48,
    BACKSLASH:219,
    A:65,
    S:83,
    D:68,
    F:70,
    Q:81,
    W:87,
    E:69,
    R:82,
    Z:90,
    X:88,
    C:67,
    V:86,
    NONE:97,
    NTWO:98,
    NTHREE:99,
    NFOUR:100,
    NFIVE:101,
    NSIX:102,
    NSEVEN:103,
    NEIGHT:104,
    NNINE:105,
    NZERO:96,
    NMINUS:109,
    NPLUS:107,
    NSTAR:108,
    NDIV:111,
    NCOMMA:110,
    ENTER: 13
}
const floor = Math.floor;
const sin = Math.sin;
const cos = Math.cos;
const tan = Math.tan;
const atan = Math.atan;
const atan2 = Math.atan2;
const pow = Math.pow;
