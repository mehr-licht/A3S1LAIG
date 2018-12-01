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

        this.colormap = this.scene.graph.textures[this.idtexture];
        this.heightmap = this.scene.graph.textures[this.idheightmap];

        this.terrainShader = new CGFshader(this.scene.gl,"shaders/heightmap.vert","shaders/shaderOne.frag");
     /*   this.terrainShader.setUniformsValues({
            heightmap: 1,
            colormap: 2,
            heightscale: this.heightscale
        });
*/
        this.heightscale = heightscale;
        this.uParts = uParts;
        this.vParts = vParts

        this.shader = this.scene.terrainShader;
        //this.scene.updateScaleFactor();
    }

    display() {
        
        this.scene.setActiveShader(this.terrainShader);
        this.terrainShader.setUniformsValues({
            heightmap: 1,
            colormap: 2,
             heightscale: this.heightscale
        });
        
        this.scene.pushMatrix();
        
        this.heightmap.bind(1);
        this.colormap.bind(2);

        this.obj.display();
        this.scene.popMatrix();
        this.scene.setActiveShader(this.scene.defaultShader);
       

    }

    updateTexCoords() {//    this.heightscale, this.texscale
    //
    }

}
