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

        this.omega = (this.dist / this.animTime) / this.radius;

        //If he's going to rotate clockwise he's already correctly oriented (torwards +ZZ). Otherwise, need to turn around
        //  this.initialAdjustment = (rotationAngle < 0 ? 0 : Math.PI);

        //this.transformMatrix = mat4.create();




        this.segmentTimes.push(this.time);

        //return AnimationMatrix
    };

    /**
     * Calculates the new transform matrix for the animation
     * @param node Node that has an animation
     * @param time Time passed
     * @param segment Segment of the animation to process
     * @return Returns the new transform matrix
     */

    /*   update(node, dt) {

        if (this.time * this.omega >= this.rotationAngle) {
            this.animationEnd = true;;
        } else {
            mat4.identity(this.transformMatrix);
            var angle = this.initialAngle + this.omega * this.time;
            mat4.translate(this.transformMatrix, this.transformMatrix, [this.centre[0], this.centre[1], this.centre[2]]);
            mat4.rotate(this.transformMatrix, this.transformMatrix, angle, [0, 1, 0]);
            mat4.translate(this.transformMatrix, this.transformMatrix, [this.radius, 0, 0]);
            mat4.rotate(this.transformMatrix, this.transformMatrix, Math.PI / 2, [0, 1, 0]);
        }

        return this.transformMatrix;
    }
*/
    update(node, dt) {
        // this.tempoPassado = dt;

        if (dt <= this.tempo) {
            //  alert(this.tempoPassado);
            /*  if (this.time * this.omega >= this.rotationAngle) {
                  this.animationEnd = true;;
              } else {*/
            mat4.identity(node.animMatrix);
            var angle = this.initialAngle + this.omega * dt;
            mat4.translate(node.animMatrix, node.animMatrix, [this.centre[0], this.centre[1], this.centre[2]]);
            mat4.rotate(node.animMatrix, node.animMatrix, angle, [0, 0, 1]);
            mat4.translate(node.animMatrix, node.animMatrix, [this.radius, 0, 0]); //x? [this.radius, this.radius, 0]
            mat4.rotate(node.animMatrix, node.animMatrix, Math.PI / 2, [0, 0, 1]);

            // }
        }
    }

    /*

        update(node, dt) {
            alert(node.nodeID + "\n" + node.animMatrix); //1ª vez dá identidade 
            mat4.identity(node.animMatrix);
            mat4.translate(node.animMatrix, node.animMatrix, [this.centre[0], this.centre[1], this.centre[2]]);
            var angle = (dt / this.animTime) * this.rotationAngle;
            angle += this.initialAngle;
            mat4.rotate(node.animMatrix, node.animMatrix, angle * DEGREE_TO_RAD, [0, 1, 0]);
            mat4.translate(node.animMatrix, node.animMatrix, [this.radius, 0, 0]);
        }
    */
}