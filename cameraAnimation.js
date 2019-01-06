/**
 * Constructor of cameraAnimation class that receives the scene and wich player is turn. This class is resposible to animate the camera during the game
 * for switching players turn.
 * @param {CGFscene} scene
 * @param {string} player
 */
function cameraAnimation(scene, Player) {

    this.scene = scene;
    this.span = 3;
    this.x = 0;
    this.y = 25;
    this.z = 0;

    this.radius = 40;
    this.degToRad = Math.PI / 180;
    this.rotationAngle = 180 * this.degToRad;
    this.firstTime = true;

    this.currTime = 0;
    this.ended = false;

    if (Player === 'player2') {
        this.initialAngle = Math.PI;
    } else if (Player === 'player1') {
        this.initialAngle = 0;
    }

};

/**
 * Updates the animation of the camera.
 * @param {number} time
 */
cameraAnimation.prototype.updateAnimation = function(time) {

    this.currTime += time / 1000;

    if (this.currTime >= this.span) {

        if (this.firstTime) {
            this.scene.makingTransition = false;
            this.firstTime = false;
        }

        this.ended = true;

        return;
    } else {

        var percentage = this.currTime / this.span;

        this.currAngle = this.rotationAngle * percentage;

        this.x = this.radius * Math.sin(this.initialAngle + this.currAngle);
        this.z = this.radius * Math.cos(this.initialAngle + this.currAngle);

        this.scene.camera.setPosition(vec3.fromValues(this.x, this.y, this.z));

    }

};