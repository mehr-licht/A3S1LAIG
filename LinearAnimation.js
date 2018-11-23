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
        //  this.values = [];

        //  var tmp;
        var len = this.controlPoints.length;
        //var t0 = 0;
        //this.distance = 0;
        //this.totalDistance = 0;
        var angle = 0;

        var x = this.controlPoints[0][0];
        var y = this.controlPoints[0][1];
        var z = this.controlPoints[0][2];
        var deltay = 0;



        /*begininning of Kyahra block
            for (var i = 0; i < this.points.length - 1; i++) {
                this.distance += distance(this.points[i], this.points[i + 1]);
                this.segmentValues.push(distance(this.points[i], this.points[i + 1]));
            }
            end of Kyahra block*/

        for (var i = 0; i < len; i++) {
            this.segments.push(this.controlPoints[i]); //ponto do inicio de cada segmento
        }
        for (var i = 1; i < len; i++) {
            // this.tempos = [];

            this.distance = Math.sqrt((this.controlPoints[i][0] - this.controlPoints[i - 1][0]) * (this.controlPoints[i][0] - this.controlPoints[i - 1][0]) +
                (this.controlPoints[i][1] - this.controlPoints[i - 1][1]) * (this.controlPoints[i][1] - this.controlPoints[i - 1][1]) +
                (this.controlPoints[i][2] - this.controlPoints[i - 1][2]) * (this.controlPoints[i][2] - this.controlPoints[i - 1][2]));
            this.segments[i - 1].distance = this.distance;
            this.angle = Math.acos((this.controlPoints[i][0] - this.controlPoints[i - 1][0]) / this.distance);
            this.segments[i - 1].angle = this.angle;


            this.totalDistance += this.distance;
            //alert(this.totalDistance);
        }
        this.speed = this.totalDistance / this.tempo;


        for (var i = 0; i < this.segments.length - 1; i++) {
            this.segments[i].duration = (this.segments[i].distance / this.totalDistance) * this.tempo;

        }
        /*
                        
                        this.newx = this.speed * Math.cos(this.angle);
                        this.newz = this.speed * Math.sin(this.angle);
                        if (i + 1 < len) {
                            this.deltay = controlPoints[i + 1][1] - controlPoints[i][1];

                            if (this.deltay !== 0) {
                                this.deltay /= Math.abs(controlPoints[i + 1][1] - controlPoints[i][1]);
                            }
                        }
                        this.newy = Math.sqrt(Math.round((this.speed ** 2 - this.newx ** 2 - this.newz ** 2) * 1000) / 1000) * this.deltay;

                        this.segmentValues.push(this.distance / this.speed);

                        this.tempos.push(this.newx, this.newy, this.newz, this.angle); //o angulo é sempre o mesmo é escusado estar sempre a pushar
                        //considerar ir busca-lo doutro modo (angulo)
                        this.values.push(this.tempos);

                        //  tmp = t0 + i * (this.tempo / (len - 1)); //lista de controlPoints não é uniforme...
                        // tempos[tmp] = this.controlPoints[i];
                    }

                    this.transformMatrix = mat4.create();

                };
            */

    }


    update(node, dt) {
        var node = node;

        this.tempoActual = dt;
        this.tempoPassado = dt;
        //alert("passado=" + this.tempoPassado + "<=" + this.tempo + "(tempo)");
        if (this.tempoPassado <= this.tempo) {
            //  alert("01");
            if (this.actual < this.segments.length - 1) {
                //alert(this.segments[this.actual] + " >> " + this.tempoActual + " : " + this.segments[this.actual].duration);
                //    alert("actual=" + this.actual + " ; " + this.tempoActual + "<= " + this.segments[this.actual].duration);
                if (this.tempoActual <= this.segments[this.actual].duration) {

                    mat4.identity(node.animMatrix);
                    //mat4 mete inicio

                    mat4.translate(node.animMatrix, node.animMatrix, this.segments[this.actual]);
                    // alert("inicio=" + node.animMatrix);
                    //calculo deslocamento dentro segmento
                    var deslocSpeed = this.speed * this.tempoActual / this.segments[this.actual].duration;
                    var distanceX = deslocSpeed * (this.segments[this.actual + 1][0] - this.segments[this.actual][0]);
                    var distanceY = deslocSpeed * (this.segments[this.actual + 1][1] - this.segments[this.actual][1]);
                    var distanceZ = deslocSpeed * (this.segments[this.actual + 1][2] - this.segments[this.actual][2]);
                    /*   v = x / t
                       v * t / t = v
                       x = v * t*/
                    //mat4 deslocamento - estou a usar deslocamento relativo ao inicio segmento e nao posicoes absolutas
                    mat4.translate(node.animMatrix, node.animMatrix, [distanceX, distanceY, distanceZ]);
                    // alert("desloc=" + node.animMatrix);
                    //mat4 roda angulo segmento
                    mat4.rotate(node.animMatrix, node.animMatrix, this.segments[this.actual].angle, [0, 1, 0]);
                    // alert("rotate=" + node.animMatrix);
                    // this.apply(node, dt);

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
        //mudar secTime e secTimes    segmentTime / segmentValues
        //ver initVlaues e values    this.values  / this.tempos
        //secTimes devemos obter pelo controlPoints (é o time de cada ponto de controlo)

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
        //alert(node.nodeID + "\n" + node.animMatrix); //1ª vez dá identidade e depois 1,0,0,0,0,1,0,0,0,0,0,1,0,1,1,1,1
        mat4.identity(node.animMatrix);
        //alert("speed=" + this.speed); //0.353553390
        //alert("dt=" + dt); //0.334
        this.currentDistance = this.speed * dt;
        mat4.translate(node.animMatrix, node.animMatrix, this.controlPoints[0]); //esta poe no ponto inicial da anim

        var initTranslation = [0, 0, 0];

        // find current segment
        var i = 0;

        //nunca entra porq currentDistance muito pequena
        //this.segmentValues[i]); //0: 0.565685424949238; //1=2; //2=2.8284271247461903; 
        //ou currentDistance muito baixa ou segmentValues muito alta
        /* alert(this.currentDistance + ">" + this.segmentValues[i] + "\n" +
             i + " < " + this.segmentValues.length);*/

        //     while (this.currentDistance > this.segmentValues[i] && i < this.segmentValues.length) {
        //   alert("entrou");
        //       if ((i + 1) < this.controlPoints.length) {
        //         this.currentDistance -= this.segmentValues[i];
        //       initTranslation = this.controlPoints[i + 1];

        //  alert(i);
        // alert(initTranslation); //sempre 0,0,0 nunca actualiza porque não entra no ciclo anterior
        //}
        // i++;
        // alert("fim");
        //}
        //    alert("fora");
        //alert(node.animMatrix);
        //       mat4.translate(node.animMatrix, node.animMatrix, initTranslation); //nao faz nada
        //alert(node.animMatrix);
        // get control points from current segment
        for (var j = 1; j < this.controlPoints.length; j++) {
            var p1 = this.controlPoints[j - 1];
            var p2 = this.controlPoints[j];
            //  alert("aqui");
            // calculate displacement and apply translation
            var relativeDistance = this.currentDistance / this.segments[j - 1].distance;
            //alert([(p2[0] - p1[0]) * relativeDistance, (p2[1] - p1[1]) * relativeDistance, (p2[2] - p1[2]) * relativeDistance]);
            mat4.translate(node.animMatrix, node.animMatrix, [(p2[0] - p1[0]) * relativeDistance, (p2[1] - p1[1]) * relativeDistance, (p2[2] - p1[2]) * relativeDistance]); //este faz a animacao total durante o animTime
            //alert(node.animMatrix);
        }

        // calculate rotation angle and apply rotation
        //Kyahra used this here to calculate angle. I commented it. angle calculated in coinstructor and fixed
        // var angle = angleBetween([0, 0, 1], subtractPoints(this.controlPoints[i], this.controlPoints[i + 1]));
        mat4.rotate(node.animMatrix, node.animMatrix, this.angle, [0, 1, 0]); //roda logo

    }



}