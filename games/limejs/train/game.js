//set main namespace
goog.provide('game');


//get requirements
goog.require('lime.Director');
goog.require('lime.Scene');
goog.require('lime.Layer');
goog.require('lime.Circle');
goog.require('lime.Label');
goog.require('lime.animation.Spawn');
goog.require('lime.animation.FadeTo');
goog.require('lime.animation.ScaleTo');
goog.require('lime.animation.MoveTo');
goog.require('goog.events.KeyCodes');
goog.require('lime.audio.Audio');
goog.require('lime.GlossyButton');
goog.require('lime.Button');


//constant iPad size
game.WIDTH = 720;
game.HEIGHT = 1004;


// entrypoint
game.start = function(){

    this.WIDTH = 600;
    this.HEIGHT = 600;
    this.TRAIN_WIDTH = 100;
    this.TRAIN_HEIGHT = 100;
    this.STEP = 10;

	var director = new lime.Director(document.body, game.WIDTH, game.HEIGHT);
    director.makeMobileWebAppCapable();

    var scene = new lime.Scene();
    var layer = new lime.Layer();

    this.board = new lime.Sprite().setSize(this.WIDTH, this.HEIGHT)
        .setAnchorPoint(0, 0)
        .setPosition(0, 0)
        .setFill(100, 1, 1, 0.1);
    // this.maskSprite = new lime.Sprite().setSize(this.WIDTH, this.HEIGHT)
    //     .setFill(100, 0, 0, .1).setAnchorPoint(0, 0);
    // this.board.setMask(this.maskSprite);
        
    this.train = new lime.Sprite().setSize(this.TRAIN_WIDTH, this.TRAIN_HEIGHT)
        .setAnchorPoint(0, 0)
        .setPosition(50, 250)
        .setFill('assets/train.png');
    var train = this.train;    

    this.btn_bell = new lime.GlossyButton('bell') 
        .setSize(70, 50)
        .setPosition(50, 50);


    this.btn_whistle = new lime.GlossyButton('whistle')
        .setSize(70, 50)
        .setPosition(50, 120);
    this.btn_bell.bellSound = new lime.audio.Audio('assets/bell.mp3');
    this.btn_whistle.whistleSound = new lime.audio.Audio('assets/whistle.mp3');

    goog.events.listen(this.btn_bell, 'click', function() {
        this.bellSound.stop();
        this.bellSound.play();
    });    
    goog.events.listen(this.btn_whistle, 'click', function() {
        this.whistleSound.stop();
        this.whistleSound.play();
    });    

    layer.appendChild(this.board);
    layer.appendChild(this.train);
    layer.appendChild(this.btn_bell);
    layer.appendChild(this.btn_whistle);
    scene.appendChild(layer);

    this.v = new goog.math.Vec2(this.STEP, 0);
    lime.scheduleManager.scheduleWithDelay(this.moveAStep, this, 200);

    goog.events.listen(this.board,['mouseup', 'touchend'], 
        this.handleClick, false, this);

    goog.events.listen(goog.global, ['keydown'], 
        this.handleKeyPressed, false, this);

    //add some interaction
    goog.events.listen(train,['mousedown','touchstart'],function(e){

        //animate
        train.runAction(new lime.animation.Spawn(
            new lime.animation.FadeTo(.5).setDuration(.2),
            new lime.animation.ScaleTo(1.5).setDuration(.8)
        ));

        //let target follow the mouse/finger
        e.startDrag();

        //listen for end event
        e.swallow(['mouseup','touchend'],function(){
            train.runAction(new lime.animation.Spawn(
                new lime.animation.FadeTo(1),
                new lime.animation.ScaleTo(1),
                new lime.animation.MoveTo(this.WIDTH / 2, this.HEIGHT / 2)
            ));

        });


    });

	// set current scene active
	director.replaceScene(scene);

}

game.handleClick = function(e) {
    console.log(e.position);
    var pos = e.position;
    var train_pos = this.train.getPosition();
    var xdiff = Math.abs(pos.x - train_pos.x);
    var ydiff = Math.abs(pos.y - train_pos.y);
    if (xdiff > ydiff) {
        if (pos.x > train_pos.x) {
            this.v.x = this.STEP;
            this.v.y = 0;
        } else {
            this.v.x = -this.STEP;
            this.v.y = 0;
        }
    } else {
        if (pos.y > train_pos.y) {
            this.v.x = 0;
            this.v.y = this.STEP;
        } else {
            this.v.x = 0;
            this.v.y = -this.STEP;
        }        
    }
}

game.handleKeyPressed = function(e) {
    switch (e.keyCode) {
        case goog.events.KeyCodes.LEFT:
            this.v.x = -this.STEP;
            this.v.y = 0;
            break;
        case goog.events.KeyCodes.RIGHT:
            this.v.x = this.STEP;
            this.v.y = 0;
            break;
        case goog.events.KeyCodes.UP:
            this.v.x = 0;
            this.v.y = -this.STEP;
            break;
        case goog.events.KeyCodes.DOWN:
            this.v.x = 0;
            this.v.y = this.STEP;
            break;
    }
}

game.moveAStep = function() {
    var pos_start = this.train.getPosition();
    var pos = pos_start.clone();
    pos.x += this.v.x;
    pos.y += this.v.y;
    if (pos.x < 0 || (pos.x + this.TRAIN_WIDTH) > this.WIDTH) {
        pos.x = pos_start.x;
    }
    if (pos.y < 0 || (pos.y + this.TRAIN_HEIGHT) > this.HEIGHT) {
        pos.y = pos_start.y
    }
    this.train.setPosition(pos);
}

//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('game.start', game.start);
