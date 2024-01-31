/**
 * Created by Espen on 10/30/2015.
 */
'use strict';

init();

function init() {

    var colors = ['aqua','azure','aquamarine','blanchedalmond','floralwhite','ghostwhite','lavender','lightblue','lightcyan','lightgoldenrodyellow','mintcream','oldlace','white','paleturquoise','powderblue'];
    var main_canvas = document.getElementById("imageView");
    var container = main_canvas.parentNode;
    var canvas = document.createElement('canvas');

    canvas.id = "imageTemp";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    container.appendChild(canvas);
    var context = canvas.getContext("2d");
    context.fillStyle = '#224058';
    context.fillRect(0,0,canvas.width, canvas.height);

    var iterations = prompt('please enter the number of iterations you would like, 0 - 6 is a good range',4);

    var color = colors[Math.floor(Math.random()*colors.length)];
    var kochWidth = canvas.height / 2;
    var kochHeight = Math.tan(60 /180*Math.PI) * kochWidth / 2;
    var yAdjust = (iterations > 0) ? kochHeight / 6 : 0;
    var aX = (canvas.width - kochWidth) / 2;
    var aY = yAdjust + (canvas.height - kochHeight) / 2;
    var bX = (aX + kochWidth / 2);
    var bY =  aY + kochHeight;

    koch([aX, aY], [aX + kochWidth, aY], iterations,color);
    koch([bX, bY], [aX, aY], iterations,color);
    koch([aX+kochWidth, aY], [bX, bY], iterations,color);



    function koch(A, B, depth, color) {
        if (depth < 0) {
            return;
        }

        var C = divide(add(multiply(A, 2), B), 3);
        var D = divide(add(multiply(B, 2), A), 3);
        var F = divide(add(A, B), 2);

        var V1 = divide(minus(F, A), length(F, A));
        var V2 = [V1[1], -V1[0]];

        var E = add(multiply(V2, Math.sqrt(3) / 6 * length(B, A)), F);

        if(depth == 0){
            DrawLine(A, B, color);
        }
        koch(A, C, depth - 1, color);
        koch(C, E, depth - 1, color);
        koch(E, D, depth - 1, color);
        koch(D, B, depth - 1, color);
    };

    function multiply(v, num) {
        return [v[0] * num, v[1] * num];
    };

    function divide(v, num) {
        return [v[0] / num, v[1] / num];
    };

    function add(a, b) {
        return [a[0] + b[0], a[1] + b[1]];
    };

    function minus(a, b) {
        return [a[0] - b[0], a[1] - b[1]];
    };

    function length(a, b) {
        return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
    };

    function DrawLine(a, b, c) {
        context.beginPath();
        context.strokeStyle = c;
        context.lineWidth = 1;
        context.moveTo(a[0], a[1]);
        context.lineTo(b[0], b[1]);
        context.stroke();
        context.closePath();
    }
}