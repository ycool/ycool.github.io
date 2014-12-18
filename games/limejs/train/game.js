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


// entrypoint
game.start = function(){

    this.WIDTH = 600;
    this.HEIGHT = 600;
    this.TRAIN_WIDTH = 50;
    this.TRAIN_HEIGHT = 50;

	var director = new lime.Director(document.body,1024,768);
    var scene = new lime.Scene();
    var layer = new lime.Layer().setPosition(30, 30);

    var board = new lime.Sprite().setSize(this.WIDTH, this.HEIGHT).setFill(100, 0, 0, 0.1);
    var train = new lime.Sprite().setSize(this.TRAIN_WIDTH, this.TRAIN_HEIGHT)
        .setFill(100, 0, 0, 0.1);

    layer.appendChild(board);
    layer.appendChild(train);
    scene.appendChild(layer);

	director.makeMobileWebAppCapable();

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
                new lime.animation.MoveTo(512,384)
            ));

            title.runAction(new lime.animation.FadeTo(0));
        });


    });

	// set current scene active
	director.replaceScene(scene);

}


//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('game.start', game.start);
