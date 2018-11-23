/**
 * MyCircle
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyCircle extends CGFobject {

    constructor(scene, slices, stacks) {
        super(scene);
        this.slices = slices;
        this.stacks = stacks;
        this.initBuffers();
    }

    initBuffers() {

        //vectors
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        //coordinate variables
        var x;
        var y;
        var z = 0;

        //slice increment (2*pi*r/slices)
        var angle = (2 * Math.PI) / this.slices;

        this.vertices.push(0, 0, 0);
        this.normals.push(0, 0, this.stacks);
        this.texCoords.push(0.5, 0.5);

        for (var s = 0; s < this.slices; s++) {
            //calculating coordinates
            x = Math.cos(s * angle);
            y = Math.sin(s * angle);

            //pushing vertices
            this.vertices.push(x);
            this.vertices.push(y);
            this.vertices.push(0);

            //pushing normals
            this.normals.push(0);
            this.normals.push(0);
            this.normals.push(this.stacks);

            //pushing textures
            this.texCoords.push(0.5 * (1 + Math.cos(s * angle)));
            this.texCoords.push(0.5 * (1 - Math.sin(s * angle)));
        }

        for (var s = 0; s < this.slices; s++) {

            if (s == this.slices - 1) {
                this.indices.push(0);
                this.indices.push(s + 1);
                this.indices.push(1);
            } else {
                this.indices.push(0);
                this.indices.push(s + 1);
                this.indices.push(s + 2);
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
    ;
}
;