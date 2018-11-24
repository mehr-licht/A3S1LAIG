/**
 * MyWater
 * @param gl {WebGLRenderingContext}
 * @extends MyWater
 * @constructor
 */

class MyWater extends MyPlane {


    constructor(scene, uParts, vParts, idtexture, idwavemap, heightscale, texscale) {
        super(scene, uParts, vParts);
        this.idtexture=idtexture;
        this.idwavemap=idwavemap;
        this.texture = new CGFtexture(scene, this.scene.graph.textures[this.idtexture]);
        this.wavemap = new CGFtexture(scene, this.scene.graph.textures[this.idwavemap]);

        this.heightscale = heightscale;
        this.texscale = texscale;
        this.uParts = uParts;
        this.vParts = vParts;

this.shader = this.scene.waterShader;
        this.scene.updateScaleFactor();
    }



    display() {
        //this.scene.gl.disable(this.scene.gl.CULL_FACE);
        //aqui tinha o shader

        this.scene.pushMatrix();

       // alert(this.texture);
        this.texture.bind();
        this.wavemap.bind(1);

        this.obj.display();
        this.scene.popMatrix();

        // this.scene.setActiveShader(this.scene.defaultShader);
        //  this.scene.gl.enable(this.scene.gl.CULL_FACE);

    }


    updateTexCoords() {
        //    this.heightscale, this.texscale
        //
    }

}