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
goog.require('lime.animation.RotateTo');
goog.require('goog.events.KeyCodes');
goog.require('lime.audio.Audio');
goog.require('lime.GlossyButton');
goog.require('lime.Button');
goog.require('goog.math');

//constant iPad size
game.WIDTH = 720;
game.HEIGHT = 1004;


// entrypoint
game.start = function(){

    this.TRAIN_WIDTH = 100;
    this.TRAIN_HEIGHT = 100;
    this.STEP = 10;

	var director = new lime.Director(document.body); //, game.WIDTH, game.HEIGHT);
    director.makeMobileWebAppCapable();

    game.WIDTH = director.getSize().width;
    game.HEIGHT = director.getSize().height;

    var scene = new lime.Scene();
    var layer = new lime.Layer();

    this.board = new lime.Sprite().setSize(director.getSize())
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

    this.stop_sign = new lime.Sprite().setSize(50, 50)
        .setPosition(50, 450)
        .setFill('assets/stop_sign.png')
        .setOpacity(1);

    this.btn_sound = new lime.Label('Derek') 
        .setSize(70, 50)
        .setFontSize(50)
        .setFontWeight('bold')
        .setPosition(50, 50);

    this.btn_sound.sounds = [new lime.audio.Audio('assets/bell.mp3'),
        new lime.audio.Audio('assets/whistle.mp3')];
    this.btn_sound.sound_index = 0;    

    goog.events.listen(this.btn_sound, 'click', function() {
        this.sound_index = (this.sound_index + 1) % 2;
        if (this.sound_index == 1) {
            this.setText("Daniel");
        } else {
            this.setText("Derek");
        }
        var i = Math.floor(Math.random() * 2);
        this.sounds[i].stop();
        this.sounds[i].play();
        var x = Math.random() * game.WIDTH;
        var y = Math.random() * game.HEIGHT;
        this.setPosition(x, y);
        this.setFontColor(Math.random() * 100, Math.random() * 100, 
            Math.random() * 100);
    });    

    layer.appendChild(this.board);
    layer.appendChild(this.train);
    layer.appendChild(this.btn_sound);
    layer.appendChild(this.stop_sign);
    scene.appendChild(layer);

    this.v = new goog.math.Vec2(this.STEP, 0);
    lime.scheduleManager.scheduleWithDelay(this.moveAStep, this, 200);

    goog.events.listen(this.board,['mouseup', 'touchend'], 
        this.handleClick, false, this);

    goog.events.listen(goog.global, ['keydown'], 
        this.handleKeyPressed, false, this);

    this.target_pos = new goog.math.Coordinate(this.WIDTH, this.HEIGHT);

	// set current scene active
	director.replaceScene(scene);

}

game.handleClick = function(e) {
    console.log(e.position);
    var pos = e.position;

    this.stop_sign.setOpacity(1);
    this.stop_sign.runAction(new lime.animation.MoveTo(pos));

    this.target_pos = pos;
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
    var pos_target = this.target_pos;
    var pos = pos_start.clone();
 
    var xdiff = Math.min(Math.abs(pos_start.x - pos_target.x), this.STEP);
    var ydiff = Math.min(Math.abs(pos_start.y - pos_target.y), this.STEP);
    if (pos_start.x < pos_target.x) {
        this.train.runAction(new lime.animation.RotateTo(0).setDuration(0.2));
        pos.x += xdiff;
    } else if (pos_start.x > pos_target.x) {
        this.train.runAction(new lime.animation.RotateTo(0).setDuration(0.2));
        pos.x -= xdiff;
    } else {
        this.train.runAction(new lime.animation.RotateTo(90).setDuration(.2));
        if (pos_start.y < pos_target.y) {
            pos.y += ydiff;
        } else {
            pos.y -= ydiff;
        }
    }
    this.train.setPosition(pos);
}

//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('game.start', game.start);
