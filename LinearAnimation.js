/**
 * Linear Animation
 * @param gl {WebGLRenderingContext}
 * @extends Animation
 * @constructor
 */
class LinearAnimation extends Animation {

    /**
     * @param scene the scene
     * @param id id of the animation
     * @param animTime total animation time (seconds) 
     * @param controlPoints array of the control points coordinates
     * @constructor
     */
    constructor(scene, id, animTime, controlPoints) {
        super(scene, id, animTime, controlPoints);

        //structure to hold the given controlPoints array
        this.controlPoints = controlPoints;
        this.tempo = animTime;
        this.segments = [];
        var speed = 0;
        this.speed = 0;
        this.actual = 0;
        this.tempoPassado = 0;
        this.totalDistance = 0;
        this.point =this.controlPoints[0];
        
        var len = this.controlPoints.length;
       
        var angle = 0;

        var x = this.controlPoints[0][0];
        var y = this.controlPoints[0][1];
        var z = this.controlPoints[0][2];
        var deltay = 0;

        for (var i = 0; i < len; i++) {
            this.segments.push(this.controlPoints[i]); //ponto do inicio de cada segmento
        }
        for (var i = 1; i < len; i++) {
     
            this.distance = Math.sqrt((this.controlPoints[i][0] - this.controlPoints[i - 1][0]) * (this.controlPoints[i][0] - this.controlPoints[i - 1][0]) +
                (this.controlPoints[i][1] - this.controlPoints[i - 1][1]) * (this.controlPoints[i][1] - this.controlPoints[i - 1][1]) +
                (this.controlPoints[i][2] - this.controlPoints[i - 1][2]) * (this.controlPoints[i][2] - this.controlPoints[i - 1][2]));
            this.segments[i - 1].distance = this.distance;
            this.angle = Math.acos((this.controlPoints[i][0] - this.controlPoints[i - 1][0]) / this.distance);
            this.segments[i - 1].angle = this.angle;


            this.totalDistance += this.distance;
 
        }
        this.speed = this.totalDistance / this.tempo;


        for (var i = 0; i < this.segments.length - 1; i++) {
            this.segments[i].duration = (this.segments[i].distance / this.totalDistance) * this.tempo;

        }
       
    }


    update(node, dt) {
        var node = node;

        this.tempoActual = dt;
        this.tempoPassado = dt;
      
        if (this.tempoPassado <= this.tempo) {
            
            if (this.actual < this.segments.length - 1) {
               
                if (this.tempoActual <= this.segments[this.actual].duration) {

                    mat4.identity(node.animMatrix);

                    mat4.translate(node.animMatrix, node.animMatrix, this.segments[this.actual]);

                    var deslocSpeed = this.speed * this.tempoActual / this.segments[this.actual].duration;
                    var distanceX = deslocSpeed * (this.segments[this.actual + 1][0] - this.segments[this.actual][0]);
                    var distanceY = deslocSpeed * (this.segments[this.actual + 1][1] - this.segments[this.actual][1]);
                    var distanceZ = deslocSpeed * (this.segments[this.actual + 1][2] - this.segments[this.actual][2]);
                  
                    mat4.translate(node.animMatrix, node.animMatrix, [distanceX, distanceY, distanceZ]);
                    
                    mat4.rotate(node.animMatrix, node.animMatrix, this.segments[this.actual].angle, [0, 1, 0]);
                 

                } else {

                    this.tempoActual -= this.segments[this.actual].duration;
                    this.actual++;
                }
            }
        }
    }



    /**
     * Calculates the new transform matrix for the animation
     * @param node Node that has an animation
     * @param time Time passed
     * @param segment Segment of the animation to process
     * @return Returns the new transform matrix
     */
    apply(node, time, segment) { //constante entre cada 2 controlPoints consecutivos 
       
        var segmentTime = time;

        for (let i = 0; i < segment; i++)
            segmentTime -= this.segmentValues[i];


        if (segment < this.len) {
            mat4.identity(this.transformMatrix);

            this.delta_x = segmentTime * this.values[segment][0];
            this.delta_y = segmentTime * this.values[segment][1];
            this.delta_z = segmentTime * this.values[segment][2];

            mat4.translate(this.transformMatrix, this.transformMatrix, [this.delta_x, this.delta_dy, this.delta_dz]);
            mat4.translate(this.transformMatrix, this.transformMatrix, [this.controlPoints[segment][0],
                this.controlPoints[segment][1],
                this.controlPoints[segment][2]
            ]);

            mat4.rotate(this.transformMatrix, this.transformMatrix, this.initValues[segment][3], [0, 1, 0]);
        }


        return this.transformMatrix;
    }


    apply(node, dt) {
       
        mat4.identity(node.animMatrix);
     
        this.currentDistance = this.speed * dt;
        mat4.translate(node.animMatrix, node.animMatrix, this.controlPoints[0]); //esta poe no ponto inicial da anim

        var initTranslation = [0, 0, 0];

        // find current segment
        var i = 0;

        for (var j = 1; j < this.controlPoints.length; j++) {
            var p1 = this.controlPoints[j - 1];
            var p2 = this.controlPoints[j];
         
            var relativeDistance = this.currentDistance / this.segments[j - 1].distance;
         
            mat4.translate(node.animMatrix, node.animMatrix, [(p2[0] - p1[0]) * relativeDistance, (p2[1] - p1[1]) * relativeDistance, (p2[2] - p1[2]) * relativeDistance]); //este faz a animacao total durante o animTime
       
        }

     
        mat4.rotate(node.animMatrix, node.animMatrix, this.angle, [0, 1, 0]); //roda logo

    }



}