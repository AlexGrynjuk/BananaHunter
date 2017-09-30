var game = new Phaser.Game(700,400, Phaser.Auto, 'phaser-example', {preload:preload, create:create, update:update, render:render});
var banana_scin;
var banana_clear;
var bckground;
var jumpkey;
var player;
var jumptimer = 0;
var map;
var layer;
var gamespeed = 1.5;
var score = 0;
var isEnd = false;
var scin;
var banana;
var scoreText;
var spawnBananaTimer = 0;
var spawnScinTimer = 0;
var scinCount = 0;
var incrementSpeed = true;
var loseText;
var loseScore;
var rand;
var endAnimPlayed = false;
var doubleJump = true;
var replayButton;
var startButton;
var isStart = false;
var gameName1; var gameName2;
var infoButton;
var infoImage;
var pauseButton;
var pauseText;
var isPause = false;
var pausePlayerVelocityY;
var pauseKey;
var bgSound;
var fallSound;
var jumpSound;
var coinSound;
function preload()
{
 game.load.image('bground','assets/bground.png');  
    game.load.image('banana','assets/banana_clear.png');
    game.load.image('banana_scin','assets/banana_scin.png');
    game.load.spritesheet('player', 'assets/player2.png', 64, 64);
    game.load.tilemap('map', 'assets/tilemap.csv');
    game.load.image('tileset','assets/tileset.png');
    game.load.spritesheet('replay', 'assets/replay.png', 100, 100);
    game.load.spritesheet('play', 'assets/play.png', 100, 100);
    game.load.spritesheet('info_button', 'assets/info_button.png', 40, 40);
    game.load.image('info', 'assets/info.png');
    game.load.spritesheet('pause', 'assets/pause.png', 60, 60);
    game.load.audio('bgsound', 'assets/bgsound.mp3');
    game.load.audio('jump_sound', 'assets/jump.wav');
    game.load.audio('coin_sound', 'assets/Coin.wav');
    game.load.audio('fall_sound', 'assets/slip_off_fall.wav');
}
function create()
{    
    game.physics.startSystem(Phaser.Physics.ARCADE);
    bckground = game.add.tileSprite(0,0,700,400,'bground');   
   
    player = game.add.sprite(30, 316, 'player', 1);
    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.body.collideWorldBounds = true;
    player.body.setSize(44, 50, 20, 14);
    player.animations.add('run', [0, 1, 2], 10, true, true);
    player.animations.add('fall', [3, 4, 5, 6], 10, false);
    player.visible = false;
    
    jumpkey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    pauseKey = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
    game.physics.arcade.gravity.y = 550;
    map = game.add.tilemap('map', 70,20);
    map.addTilesetImage('tileset');
    map.setCollisionBetween(0,2);
    layer = map.createLayer(0);
    layer.resizeWorld;
    layer.visible = false;
    
    banana_scin = game.add.group();
    banana_scin.enableBody = true;
    banana_clear = game.add.group();
    banana_clear.enableBody = true;
    
    scoreText = game.add.text(5,5, 'Score: ', {font: ' 32px Arial', fill: '#ffff00'});
    scoreText.visible = false;
    loseText = game.add.text(game.world.centerX-80, game.world.centerY-70, 'You Lose', {font: '36px Arial', fill: '#fff000', align: 'center'});
    loseText.visible = false;
    loseScore = game.add.text(game.world.centerX-100, game.world.centerY+10, 'Your Score: ', {font: '32px Arial', fill:'#fff000', align: 'center'});
    loseScore.visible = false;
    gameName1 = game.add.text(game.world.centerX-155, game.world.centerY-100, 'BANANA', {font: '64px Arial Black', fill:'#fff000', align:'center'});
    gameName2 = game.add.text(game.world.centerX-153, game.world.centerY-40, 'HUNTER', {font: '64px Arial Black', fill:'#fff000', align:'center'});
    pauseText = game.add.text(game.world.centerX-100, game.world.centerY, 'PAUSE', {font: '64px Arial Black', fill:'#fff000', align:'center'});
    pauseText.visible = false;

    replayButton = game.add.button(game.world.centerX-50, game.world.centerY+70, 'replay', actionOnClickReplay, this, 0, 1, 0);
    replayButton.visible = false;
    replayButton.enable = false;
    startButton = game.add.button(game.world.centerX-50, game.world.centerY+50, 'play', actionOnClickPlay, this, 0, 1, 0);
    infoButton = game.add.button(game.world.width-50, game.world.height-50, 'info_button', actionOnClickInfo, this, 0, 1, 0);
    pauseButton = game.add.button(game.world.width-70, 10, 'pause', actionOnClickPause, this, 0, 1, 0);
    pauseButton.enable = false;
    pauseButton.visible = false;
    
    infoImage = game.add.image(game.world.centerX-132, 10, 'info');
    infoImage.visible = false;
    
    bgSound = game.add.audio('bgsound', 0.8, true);
    bgSound.play();
    jumpSound = game.add.audio('jump_sound', 1, false);
    coinSound = game.add.audio('coin_sound', 1, false);
    fallSound = game.add.audio('fall_sound', 1, false);
}
function update()
{
    game.physics.arcade.collide(player, layer);
    game.physics.arcade.collide(scin, layer);
    if(isStart){
    if(!isEnd && !isPause){
    game.physics.arcade.overlap(player, banana_clear, collisionBananaHandler, null, this);        
    game.physics.arcade.overlap(player, banana_scin, collisionScinHandler, null, this);
    player.body.velocity.x = 0;
    if(score!=0 &&  score % 5 == 0 && incrementSpeed) {
        gamespeed+=0.5;
        incrementSpeed = false; }
    if(score % 5 == 1) incrementSpeed = true;  
    if(game.time.now > spawnBananaTimer)
        {
            rand = game.rnd.integerInRange(0,1);
            if (rand)
                {
                    create_banana();
                    spawnBananaTimer = game.time.now + 2000 - (200 * gamespeed);
                }
            else
                {
                    spawnBananaTimer = game.time.now + 2000 - (200 * gamespeed);
                }
        }
    if(game.time.now > spawnScinTimer)
        {
            rand = game.rnd.integerInRange(0,1);
            if (rand && scinCount < gamespeed)
                {
                    create_banana_scin();
                    scinCount++;
                    spawnScinTimer = game.time.now + 2000 - (200 * gamespeed);
                }
            else
                {
                    spawnScinTimer = game.time.now + 2000 - (200 * gamespeed);
                    scinCount = 0;
                }
        }
    if(player.body.onFloor()){
    player.animations.play('run');
    doubleJump = true;}
    bckground.tilePosition.x -= gamespeed;
    banana_scin.forEach(moveScin,this);
    banana_clear.forEach(moveBanana,this);
    if (jumpkey.isDown && ( player.body.onFloor() || doubleJump) && game.time.now > jumptimer)
    {
        player.animations.stop('run', true);
        player.body.velocity.y = -450;
        jumptimer = game.time.now + 550;
        if(!player.body.onFloor())  doubleJump = false;
        jumpSound.play();
    }
    scoreText.text = 'Score: ' + score;
    banana_scin.forEach(checkScin, this);
    banana_clear.forEach(checkBanana, this);
    if(pauseKey.isDown) actionOnClickPause();
    }else if(isEnd)
        {
            player.animations.stop('run', true);
            playEndAnim();
            pauseButton.enable = false;
            pauseButton.visible = false;
            loseText.visible = true;
            loseScore.text = 'Your Score: '+score;
            loseScore.visible = true;
            scoreText.visible = false;
            replayButton.enable = true;
            replayButton.visible = true;
        }
    }else if(isPause){}
}
function create_banana_scin()
{
    scin = banana_scin.create(699, 355, 'banana_scin');
    scin.body.setSize(30, 25, 30, 0);
    scin.body.gravity = 0;   
}
function create_banana()
{
    banana = banana_clear.create(699, game.rnd.integerInRange(0,160)+150, 'banana');
    banana.body.setSize(35,50,3,1);
    banana.body.gravity = 0;
}
function moveScin(item)
{
    item.body.position.x -= gamespeed;
}
function moveBanana(item)
{
    item.body.position.x -= gamespeed;
}
function collisionBananaHandler(player,banana)
{
    banana.kill();
    coinSound.play();
    score++;
}
function collisionScinHandler(player,scin)
{    
    isEnd = true;
    fallSound.play();
}
function playEndAnim()
{
    if(!endAnimPlayed) 
    {
        player.animations.play('fall');
        endAnimPlayed = true;
    }
}
function actionOnClickReplay()
{
    score = 0;
    gamespeed = 1.5;
    jumptimer = 0;
    spawnBananaTimer = 0;
    spawnScinTimer = 0;
    incrementSpeed = true;
    endAnimPlayed = false;
    scinCount = 0;
    doubleJump = true;
    banana_clear.forEach(deleteBanana, this);
    banana_scin.forEach(deleteBanana, this);
    scoreText.visible = true;
    loseText.visible = false;
    loseScore.visible = false;
    replayButton.enable = false;
    replayButton.visible = false;
    pauseButton.enable = true;
    pauseButton.visible = true;
    isEnd = false;
}
function deleteBanana(item)
{
    item.kill();
}
function checkScin(item)
{
    if(item.body.position.x < -69 || item.body.position.y > 399) item.kill();
}
function checkBanana(item)
{
    if(item.body.position.x < -40 || item.body.position.y > 399) item.kill();
}
function actionOnClickPlay()
{
    player.visible = true;
    scoreText.visible = true;
    gameName1.visible = false;
    gameName2.visible = false;
    startButton.enable = false;
    startButton.visible =false;
    pauseButton.enable = true;
    pauseButton.visible = true;
    isStart = true;
}
function actionOnClickInfo()
{
    if(infoImage.visible) infoImage.visible = false;
    else infoImage.visible = true;
}
function actionOnClickPause()
{
    if(isPause)
        {
            isPause = false;
            pauseText.visible = false;
            player.animations.play('run');
            game.physics.arcade.gravity.y = 550;
            player.body.velocity.y = pausePlayerVelocityY;
        }
    else
    {
        isPause = true;
        pauseText.visible = true;
        player.animations.stop('run', false);
        player.animations.stop();
        game.physics.arcade.gravity.y = 0;
        pausePlayerVelocityY = player.body.velocity.y;
        player.body.velocity.y = 0;
    }
}
function render(){}