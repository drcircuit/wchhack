# DrCircuitsCanvasLibrary
A tiny library for doing boilerplate stuff for canvas based vanilla js gfx and game projects.

Installation:
Install via bower: ```bower install --save DrCircuitsCanvasLibrary ```

Usage:
```javascript
(function(){
    var scr;
  
    function setup() {
        scr = dcl.setupScreen(window.innerWidth ,window.innerHeight );
        scr.setBgColor('darkblue');
        document.body.style.backgroundColor = 'darkblue';      
    }

    setup();
})();
```

# setupScreen function
setupScreen: function (width, height, keepSquare, gridScale)

## Parameters:
* width: The width of your canvas
* height: The height of your canvas
* keepSquare: This will create a square canvas
* gridScale: Create a grid based coordinate system, where the scale is number of square pixels in one grid unit.

## return object:
This method returns an object with the following:
* ctx: 2d rendering context
* width: the width of the canvas
* height: the height of the canvas
* cols: the number of columns in your grid
* rows: the number of rows in your grid
* setBgColor: function(color): sets the background color of the canvas
* randomSpot: function(): retrieves a random spot from the grid, returns a vector x, y

