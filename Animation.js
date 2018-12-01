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
        //  var caller = Animation.instanceof;
        //caller.update(node, currTime);
        // this.apply(nop, tim);
    };

    /**
     * Applies the animation 
     */
    apply(node) {
        // ENUNCIADO : aplicar as transformacoes sobre a matriz de transformacoes da cena aqui

    };


}