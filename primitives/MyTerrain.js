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
        this.idheightmap = heightmap;

        this.texture = new CGFtexture(scene, this.scene.graph.textures[this.idtexture]);
        this.heightmap = new CGFtexture(scene, this.scene.graph.textures[this.idheightmap]);
        this.heightscale = heightscale;
        this.uParts = uParts;
        this.vParts = vParts
        
    this.shader = this.scene.terrainShader;
        this.scene.updateScaleFactor();
    }

 




    display(){
        //this.scene.gl.disable(this.scene.gl.CULL_FACE);
        //aqui tinha o shader

        this.scene.pushMatrix();

       // alert(this.texture);
        this.texture.bind();
        this.heightmap.bind(1);

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