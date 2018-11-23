/**
 * MyTerrain
 * @param gl {WebGLRenderingContext}
 * @extends MyPlane
 * @constructor
 */

class MyTerrain extends MyPlane {

    constructor(scene, uParts, vParts, idtexture, heightmap, heightscale) {
        super(scene, uParts, vParts);
        this.idtexture = idtexture;
        this.heightmap = heightmap;
        this.heightscale = heightscale;
        this.uParts = uParts;
        this.vParts = vParts
    }

    /*
        display() {
            this.scene.gl.disable(this.scene.gl.CULL_FACE);
            this.obj.display();
            this.scene.gl.enable(this.scene.gl.CULL_FACE);
        };
    */


    updateTexCoords(sFactor, tFactor) {};
}