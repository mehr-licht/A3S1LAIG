var DEGREE_TO_RAD = Math.PI / 180;

/**
 * Circular Animation
 * @param gl {WebGLRenderingContext}
 * @extends Animation
 * @constructor
 */

class CircularAnimation extends Animation {

    /**
     * Constructs a Circular Animation
     * @param scene the scene
     * @param id id of the animation
     * @param animTime total animation time (seconds) 
     * @param centre centre coordinates
     * @param radius radius
     * @param initialAngle initial angle ()
     * @param rotationAngle rotation angle ()
     */
    constructor(scene, id, animTime, centre, radius, initialAngle, rotationAngle) {
        super(scene, id, animTime, new Array());
        this.tempo = animTime;
        this.radius = radius;
        this.initialAngle = initialAngle * DEGREE_TO_RAD;
        this.rotationAngle = rotationAngle * DEGREE_TO_RAD;
        this.centre = centre;
        //w=v/r; v=dist/t => w=(dist/t)/r
        this.distx = Math.sin(this.rotationAngle) * this.radius;
        this.distz = Math.cos(this.rotationAngle) * this.radius;
        this.dist = Math.sqrt(this.distx ** 2 + this.distz ** 2);
        this.animationEnd = false;
        this.omega = (this.dist / this.animTime) / this.radius;
        this.angle = 0;
        this.segmentTimes.push(this.time);
    }

    update(node, dt) {
        if (dt <= this.tempo) {
            this.angle = this.initialAngle + this.omega * dt * 10;
        } else {
            this.animationEnd = true;
        }
    }

    apply(node) {
        if (!this.animationEnd) {
            mat4.identity(node.animMatrix);
            mat4.translate(node.animMatrix, node.animMatrix, [this.centre[0], this.centre[1], this.centre[2]]);
            mat4.rotate(node.animMatrix, node.animMatrix, this.angle, [0, 1, 0]);
            mat4.translate(node.animMatrix, node.animMatrix, [this.radius, 0, 0]);
            if (this.angle > 0) {
                mat4.rotate(node.animMatrix, node.animMatrix, Math.PI / 2, [0, 1, 0]);
            }
        }
    }
}
