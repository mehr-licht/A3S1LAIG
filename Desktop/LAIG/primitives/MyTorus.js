/**
 * MyTorus
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyTorus extends CGFobject {

    constructor(scene, inner, outer, slices, loops) {
        super(scene);
        this.inner = inner;
        this.outer = outer;
      //  this.radius = this.outer - this.inner/2;
        this.slices = slices;
        this.stacks = loops;
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
        var xx;
        var y;
        var yy;
        var z = 0;
        var zi = this.z;

        //slice increment (2*pi*r/slices)
        var angle = (2 * Math.PI) / this.slices;
        var zangle = (2 * Math.PI) / this.stacks;

        for (var t = 0; t <= this.stacks; t++) {
            for (var s = 0; s <= this.slices; s++) {
                xx = zangle * t;
                yy = angle * s;

                //calculating coordinates
                x = (this.outer + this.inner * Math.cos(yy)) * Math.cos(xx);
                y = (this.outer + this.inner * Math.cos(yy)) * Math.sin(xx);
                z = this.inner * Math.sin(yy);

                //pushing vertices
                this.vertices.push(x);
                this.vertices.push(y);
                this.vertices.push(z);

                //pushing normals
                this.normals.push(x);
                this.normals.push(y);
                this.normals.push(z);

                //pushing textCoords
                this.texCoords.push(s / this.slices, t / this.stacks);
            }
        }

        for (var s = 0; s < this.stacks; s++) {
            for (var t = 0; t < this.slices; t++) {
                this.indices.push(t * (this.slices + 1) + s, t * (this.slices + 1) + s + this.slices + 1, t * (this.slices + 1) + s + this.slices + 2);
                this.indices.push(t * (this.slices + 1) + s, t * (this.slices + 1) + s + this.slices + 2, t * (this.slices + 1) + s + 1);
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
    ;
      updateTexCoords(){};
}
;