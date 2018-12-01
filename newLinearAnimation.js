var DEGREE_TO_RAD = Math.PI / 180;
/**
 * NewLinear Animation
 * @param gl {WebGLRenderingContext}
 * @extends Animation
 * @constructor
 */
class newLinearAnimation extends Animation {

    /**
     * @param scene the scene
     * @param id id of the animation
     * @param animthis.time total animation this.time (seconds) 
     * @param controlPoints array of the control points coordinates
     * @constructor
     */
    constructor(scene, id, animtime, controlPoints) {
        super(scene, id, animtime, controlPoints);
        //structure to hold the given controlPoints array Strangely gets 0 as NaN...
        this.controlPoints = controlPoints;
        this.increment = [];
        this.tempo = animtime;
        this.segments = [];
        this.componentsSpeed = 0;
        this.speed = 0;
        this.tempoPassado = 0;
        this.componentsTotalDistance = 0;
        this.totalDistance = 0;
        this.point = this.controlPoints[0];
        this.segmentoActual = 0;
        this.segmentoAngle = 0;
        this.timeAnimationElapsed = 0;
        this.timeSegmentElapsed = 0;
        this.lasttime = 0;
        this.animationEnd = false;
        this.endsOfSegments = [];
        this.anglesOfSegments = [];
        this.durationsOfSegments = [];
        this.distancesOfSegments = [];
        this.accumulated = 0;

        let len = this.controlPoints.length;

        for (var i = 0; i < len; i++) {

            this.segments.push(this.controlPoints[i]);
            //ponto do inicio de cada segmento
            if (i + 1 < len) {

                this.componentsTotalDistance += this.getComponentsDistance(this.controlPoints[i], this.controlPoints[i + 1]);
                this.totalDistance += this.getDistance(this.controlPoints[i], this.controlPoints[i + 1]);
                this.distancesOfSegments[i] = this.getDistance(this.controlPoints[i], this.controlPoints[i + 1]);
                this.anglesOfSegments[i] = this.getAngle(this.controlPoints[i], this.controlPoints[i + 1], i);
            }
        }

        this.componentsSpeed = [this.componentsTotalDistance[0] / this.tempo, this.componentsTotalDistance[1] / this.tempo, this.componentsTotalDistance[2] / this.tempo];
        this.speed = this.totalDistance / this.tempo;

        for (var i = 0; i < this.segments.length - 1; i++) {
            this.durationsOfSegments[i] = (this.distancesOfSegments[i] / this.totalDistance) * this.tempo;
            this.accumulated += this.durationsOfSegments[i];
            this.endsOfSegments[i] = this.accumulated;

        }

    }

    getDistance(currPoint, nextPoint) {
        return Math.sqrt((nextPoint[0] - currPoint[0]) ** 2 + (nextPoint[1] - currPoint[1]) ** 2 + (nextPoint[2] - currPoint[2]) ** 2);
    }
    getComponentsDistance(currPoint, nextPoint) {
        return [nextPoint[0] - currPoint[0], nextPoint[1] - currPoint[1], nextPoint[2] - currPoint[2]];
    }

    getAngle(currPoint, nextPoint, i) {
        let cosAngle = (nextPoint[0] - currPoint[0]) / this.distancesOfSegments[i];
        return Math.acos(cosAngle);
    }

    update(node, time) {

        this.time = time;
        if (this.timeAnimationElapsed == 0) {
            this.starttime = this.time;
        }
        this.timeAnimationElapsed = this.time - this.starttime;
      
        this.elapsed = this.time - this.lasttime;
        this.lasttime = this.time;

        this.segmentoAngle = this.anglesOfSegments[this.segmentoActual];

        if (!this.animationEnd) {
            
            //ver se animacao acabou
            if (this.time > this.tempo) {

                this.animationEnd = true;
                //ver se segmento actual já acabou
            } else if (this.time > this.endsOfSegments[this.segmentoActual]) {

                this.segmentoActual++;
            }

            let nextSeg = this.segmentoActual + 1;
            this.increment = [(this.controlPoints[nextSeg][0] - this.controlPoints[this.segmentoActual][0]) / this.durationsOfSegments[this.segmentoActual] * this.elapsed * 100, (this.controlPoints[nextSeg][1] - this.controlPoints[this.segmentoActual][1]) / this.durationsOfSegments[this.segmentoActual] * this.elapsed * 100, (this.controlPoints[nextSeg][2] - this.controlPoints[this.segmentoActual][2]) / this.durationsOfSegments[this.segmentoActual] * this.elapsed * 100];

        }

    }

    apply(node) {
        var node = node;

        mat4.identity(node.animMatrix);
        //    console.log(node.animMatrix);
        
        mat4.translate(node.animMatrix, node.animMatrix, this.controlPoints[this.segmentoActual]);
        //inicio do segmento

        mat4.translate(node.animMatrix, node.animMatrix, this.increment);
        //incremento ao inicio do segmento 

        mat4.rotate(node.animMatrix, node.animMatrix, this.anglesOfSegments[this.segmentoActual], [0, 1, 0]);
        //rotacao para frente  
        //  console.log(node.animMatrix);
    }

}
