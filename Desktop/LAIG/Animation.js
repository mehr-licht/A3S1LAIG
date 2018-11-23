/**
 * Animation
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
class Animation {

    constructor(scene, id, animTime, controlPoints) {
        this.scene = scene;
        this.id = id;
        this.animTime = animTime;
        this.controlPoints = controlPoints;
        this.animationEnd = false;
        this.partialTime = 0;
        this.segmentTimes = [];
    };

    /**
     * Updates the animation 
     */
    update(node, currTime) { //se não existir override é este que é chamado! 
        //ENUNCIADO actualizar o seu estado em funcao do tempo
        //  var nop = node;
        //var tim = currTime;

        //  var caller = Animation.instanceof;
        //caller.update(node, currTime);
        // this.apply(nop, tim);
    };

    /**
     * Applies the animation 
     */
    apply(node, currTime) {
        // ENUNCIADO : aplicar as transformacoes sobre a matriz de transformacoes da cena aqui

    };

    /**
     * Returns the current partial time in the animation storyboard
     * @return Returns the current partial time
     */
    getPartialTime() {
        return this.partialTime;
    }

}