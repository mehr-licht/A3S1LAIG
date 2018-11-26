/**
 * MyWater
 * @param gl {WebGLRenderingContext}
 * @extends MyWater
 * @constructor
 */

class MyWater extends MyPlane {

    constructor(scene, uParts, vParts, idtexture, idwavemap, heightscale, texscale) {
        super(scene, uParts, vParts);
        this.idtexture = idtexture;
        this.idwavemap = idwavemap;

        this.texture = this.scene.graph.textures[this.idtexture];
        this.wavemap = this.scene.graph.textures[this.idwavemap];
        this.waterShader = new CGFshader(this.scene.gl,"shaders/shaderOne.vert","shaders/shaderOne.frag");
        this.waterShader.setUniformsValues({
            date: Date.now(),
            colormap: 2,
            waterscale: this.heightscale,
            texscale: this.texscale
        });

        this.heightscale = heightscale;
        this.texscale = texscale;
        this.uParts = uParts;
        this.vParts = vParts;

        this.shader = this.scene.waterShader;
        // this.scene.updateScaleFactor();
    }

    display() {

        this.scene.setActiveShader(this.waterShader);
        // let factor = Math.sin(Date.now() / 2) * 0.5;
        let factor = (Math.sin((Date.now() / 3.0) % 3141 * 0.0002) + 1.0) * 0.25;
        this.scene.pushMatrix();

        this.waterShader.setUniformsValues({
            factor: factor,
            colormap: 2,
            waterscale: this.heightscale,
            texscale: this.texscale
        });

        this.texture.bind(2);

        this.obj.display();
        this.scene.popMatrix();
        this.scene.setActiveShader(this.scene.defaultShader);

    }

    updateTexCoords() {//    this.heightscale, this.texscale
    //
    }

}
