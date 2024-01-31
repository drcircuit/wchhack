/** antzombiestrike */
(function(){
    let scr;
    let bulletSpeed = 490;
    let enemySteps = 0;
    let enemySpeed = 5;
    let spawnRate = 100;
    let lastSpawned =   0;
    let reloading = 0;
    let magsize = 6;
    let zombieKillScore = 20;
    let gameover = false;
    let score = 0;

    let level = {
        layout: [
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            1,1,1,1,1,1,1,1,
            1,1,1,1,1,1,1,1          
        ]
    }
    let spritesheet = {
        player: [
            [
                0,0,0,1,1,0,0,0,
                0,0,0,1,3,1,0,0,
                0,0,0,1,1,1,0,0,
                0,0,0,0,1,0,2,2,
                0,0,0,0,1,1,2,0,
                0,0,0,1,1,0,0,0,
                0,0,0,1,0,1,0,0,
                0,0,0,1,0,1,0,0
            ],
            [
                0,0,0,1,1,0,0,0,
                0,0,0,1,3,1,0,0,
                0,0,0,1,1,1,0,0,
                0,0,0,0,1,0,2,2,
                0,0,0,0,1,1,2,0,
                0,0,0,0,1,0,0,0,
                0,0,0,1,0,1,0,0,
                0,0,1,0,0,1,1,0
            ]
        ],
        bullets: [1],
        enemies: [
                [
                    0,0,0,1,1,0,0,0,
                    0,0,1,3,1,0,0,0,
                    0,0,1,1,1,0,0,0,
                    0,0,0,1,1,0,0,0,
                    0,0,1,0,1,1,0,0,
                    0,0,0,1,1,0,0,0,
                    0,0,0,1,0,1,0,0,
                    0,0,0,1,0,1,0,0
                ],
                [
                    0,0,0,1,1,0,0,0,
                    0,0,1,3,1,0,0,0,
                    0,0,1,1,1,0,0,0,
                    0,0,0,1,1,0,0,0,
                    0,0,1,0,1,1,0,0,
                    0,0,0,1,1,0,0,0,
                    0,0,0,1,0,1,0,0,
                    0,0,1,1,0,0,1,0
                ]
            ]
    };
    let tileset;
    let playertileset;
    let bulletset;
    let player;
    let bullets = [];
    let enemies = [];
    let startTime;

    function createEnemy(x,y,leftWall){
        let state = 0;
        return {
            pos: function(){
                return dcl.vector(x,y);
            },
            draw: function(){
                drawSprite(spritesheet.enemies[state], enemyset, x,y);
            },
            move: function(dx,dy){
                x += -dx;
                y += dy;
              
                if(x <= leftWall){
                    x = leftWall;
                }
                state = (state + 1) % spritesheet.enemies.length;
            },
            sprite: function(){
                return spritesheet.enemies[state];
            }
        }
    }
    function bullet(x,y){
        let rightWall = scr.width;
        return {
            pos: function(){
                return dcl.vector(x,y);
            },
            draw: function(){
                drawSprite(spritesheet.bullets, bulletset, x,y);
            },
            move: function(dx){
                x += dx;
                
                if(x >= rightWall){
                    x = rightWall; 
                }
            },
            isGone: function(){
                return x >= rightWall;
            }
        }
    }
    function createPlayer(x,y, floor, ceiling, leftWall, rightWall){
        let state = 0;
        let bulletXOffset = playertileset.width * 7;
        let bulletYOffset = playertileset.height * 3;
        return {
            pos:function(){
                return dcl.vector(x,y);
            }, 
            draw: function(){
                drawSprite(spritesheet.player[state], playertileset, x, y);
                //drawSpriteBoundingBox(playertileset,x,y, "green");
            },
            shoot:function(){
                if(!reloading && bullets.length < magsize){
                    bullets.push(bullet(x+bulletXOffset,y+bulletYOffset));
                } 
                
                
            },
            move: function(dx,dy){
                x += dx;
                y += dy;
                if(y<=ceiling){
                    y = ceiling;
                }
                if(y >= floor){
                    y = floor;
                }
                if(x <= leftWall){
                    x = leftWall;
                }
                if(x >= rightWall){
                    x = rightWall;
                }
                state = (state + 1) % spritesheet.player.length;
            },
            sprite: function(){
                return spritesheet.player[state];
            }
        }
    }
    function setupInputs(){
        document.addEventListener('keydown', function(e){
            if(gameover){
                return;
            }
            if(e.keyCode === 37){
                //Left
                player.move(-playertileset.width,0);
            }
            if(e.keyCode === 38){
                //Up
                player.move(0, -playertileset.height);
            }
            if(e.keyCode === 39){
                //Right
                player.move(playertileset.width,0);
            }
            if(e.keyCode === 40){
                //Down
                player.move(0, playertileset.height);
            }
            if(e.keyCode === 32){
                player.shoot();
            }
        });
    }
    function setup() {
        scr = dcl.setupScreen(800 ,600);
        let tilewidth = scr.width / 8;
        let tileheight = scr.height/6;
        tileset = {
            width: tilewidth,
            height : tileheight,
            cols: 8,
            rows: 6,
            set: ["steelblue","saddlebrown"]
        };
        playertileset = {
            width: Math.ceil(tilewidth/8),
            height : Math.ceil(tileheight/8),
            cols: 8,
            rows: 8,
            set: ["rgba(0,0,0,0)","black","dimgray","red"]
        }
        bulletset = {
            width: playertileset.width,
            height: playertileset.height,
            cols: 1,
            rows:1,
            set: ["rgba(0,0,0,0)","yellow"]
        }
        enemyset = {
            width: playertileset.width,
            height: playertileset.height,
            cols:8,
            rows: 8,
            set: ["rgba(0,0,0,0)","green","firebrick","red","black"]
        }
        let playerfloor = scr.height - playertileset.rows*playertileset.height;
        let playerCeil = tileset.height * 3-3;
        let leftWall = 0-playertileset.width*3;
        let rightWall = scr.width - playertileset.width*(playertileset.cols-1);
        player = createPlayer(20,4*tileheight, playerfloor,playerCeil, leftWall, rightWall);
        document.body.style.backgroundColor = 'black';  
        for(let e = 0; e<4;e++){
            spawnZombie();
        }
        setupInputs();

    }
    function spawnZombie(){
        let playerfloor = scr.height - playertileset.rows*playertileset.height;
        let playerCeil = tileset.height * 3-3;
        let leftWall = 0-playertileset.width*3;
        let x = dcl.randomi(0,4)*enemyset.width*enemyset.cols+scr.width;
        let y = Math.floor(dcl.randomi(playerCeil,playerfloor)/enemyset.rows)*enemyset.rows;
        enemies.push(createEnemy(x,y, leftWall-enemyset.width*enemyset.cols));
    }
    function draw(dt){
        let ellapsedSeconds = dt/1000;
        let enemyMove = 0;
        enemySteps++;
        if(enemySteps % enemySpeed === 0){
            enemyMove = enemyset.width;
        }
        let bulletStep =bulletSpeed*ellapsedSeconds;
        dcl.clear();
        drawSprite(level.layout, tileset);
        player.draw();
        enemies.forEach(function(e){
            e.draw();   
            if(enemyMove > 0){
                e.move(enemyMove,0);
            }         
        });
        bullets.forEach(function(b,idx){
            b.draw();            
            b.move(bulletStep);
            if(b.isGone()){
                bullets.splice(idx,1);
            }
            let pos = b.pos();
            let bbox = getBoundingBox(pos.x,pos.y, bulletset.width * bulletset.cols, bulletset.height * bulletset.rows);
            enemies.forEach(function(e,eidx){
                let sprite = e.sprite();
                let epos = e.pos();
                for(let i = 0; i<sprite.length;i++){
                    let col = i % enemyset.cols;
                    let row = Math.floor(i / enemyset.cols);
                    let pixel = sprite[i];
                    let x = col * enemyset.width + epos.x;
                    let y = row * enemyset.height + epos.y;
                    
                    let pbbox = getBoundingBox(x,y, enemyset.width, enemyset.height);
                    if(pixel>0 && bbox.hits(pbbox)){
                        bullets.splice(idx,1);
                        enemies.splice(eidx,1);
                        score +=zombieKillScore;
                        break;
                    }
                }
            });
        });
        let psprite = player.sprite();
        let ppos = player.pos();
        for(let i = 0; i<psprite.length;i++){
            let pcol = i % playertileset.cols;
            let prow = Math.floor(i / playertileset.cols);
            let pixel = psprite[i];
            let x = pcol * playertileset.width + ppos.x;
            let y = prow * playertileset.height + ppos.y;
            
            let pbbox = getBoundingBox(x,y, playertileset.width, playertileset.height);
            if(pixel>0 && !gameover){
                
                enemies.forEach(function(e){
                    let sprite = e.sprite();
                    let epos = e.pos();
                    for(let i = 0; i<sprite.length;i++){
                        let col = i % enemyset.cols;
                        let row = Math.floor(i / enemyset.cols);
                        let epixel = sprite[i];
                        let ex = col * enemyset.width + epos.x;
                        let ey = row * enemyset.height + epos.y;
                        
                        let epbbox = getBoundingBox(ex,ey, enemyset.width, enemyset.height);
                        if(epixel>0 && epbbox.hits(pbbox)&&pcol<6){
                            gameover = true;
                            break;
                        }
                    }
        
                });
            }
        }    
    }
    function getBoundingBox(relativeX, relativeY,width, height){
        let x = relativeX;
        let y = relativeY;
        let x2 = x  + width;
        let y2 = y + height;

        return {
            x:x,
            y:y,
            x2:x2,
            y2:y2, 
            hits:function(bbox){
                return ( x2  >= bbox.x  &&
                          x  <= bbox.x2 &&
                         y2  >= bbox.y  &&
                          y  <= bbox.y2);
            }
        }
    }
    function drawSpriteBoundingBox(tileset,offsetX, offsetY, color){
        dcl.rect(offsetX, offsetY, tileset.width*tileset.cols, tileset.height*tileset.rows,"rgba(0,0,0,0)",1,color );
    }
    function drawSprite(sprite, tileset, offsetX, offsetY){
        offsetX = offsetX || 0;
        offsetY = offsetY || 0;
        for(let i = 0; i<sprite.length;i++){
            let col = i % tileset.cols;
            let row = Math.floor(i / tileset.cols);
            let tileidx = sprite[i];
            let tile = tileset.set[tileidx];
            let x = col * tileset.width;
            let y = row * tileset.height;
            
            dcl.rect(x+offsetX,y+offsetY,tileset.width, tileset.height,tile);
        }
    }
    function drawScore(){
        dcl.text("SCORE: "+ (""+score).padStart(9,'0'), scr.width-10,30,'white',"'Press Start 2P'",20,scr.wdith, "right");
    }
    function main(timestamp){
        let dt = 0;
        let spawnEnememies = Math.floor((timestamp/1000)%spawnRate);
        if(!isNaN(spawnEnememies) && spawnEnememies !== lastSpawned){
            spawnZombie();
            lastSpawned = spawnEnememies;
        }
        if(!startTime){
            startTime = timestamp;
        }
        else { 
            dt = timestamp - startTime;
            startTime = timestamp;
        }
        if(!gameover){
            draw(dt);
            drawScore();
        } 
        
        
        requestAnimationFrame(main);
    }
    setup();
    main();
})();