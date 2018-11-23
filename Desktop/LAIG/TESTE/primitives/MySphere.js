/**
 * MySphere
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MySphere extends CGFobject {

    constructor(scene, radius, slices, stacks) {
        super(scene);
        this.slices = slices;
        this.radius = radius;
        this.stacks = stacks;
        this.initBuffers();
    }

    initBuffers() {
        //vectors
        this.vertices = [];
        //vector de vertices
        this.indices = [];
        //vector de indices
        this.normals = [];
        //vector de normais
        this.texCoords = [];  //vector de texs

        //vars
        var x;
        var y;
        var z;

        //constants
        var stepAng = 2 * Math.PI / this.slices;
        //step in radians
        var radius = Math.PI / this.stacks;
        //Radius
        var currtRadius;

        for (var i = 0; i < this.stacks; i++) {
            currtRadius = i * radius;
            for (var j = 0; j < this.slices; j++) {
                //vertices and normals
                this.vertices.push(this.radius * Math.sin(currtRadius) * Math.cos(j * stepAng), this.radius * Math.sin(currtRadius) * Math.sin(j * stepAng), this.radius * Math.cos(currtRadius));

                this.normals.push(this.radius * Math.sin(currtRadius) * Math.cos(j * stepAng), this.radius * Math.sin(currtRadius) * Math.sin(j * stepAng), this.radius * Math.cos(currtRadius));

                this.vertices.push(this.radius * Math.sin(currtRadius + radius) * Math.cos(j * stepAng), this.radius * Math.sin(currtRadius + radius) * Math.sin(j * stepAng), this.radius * Math.cos(radius * (i + 1)));

                this.normals.push(this.radius * Math.sin(currtRadius + radius) * Math.cos(j * stepAng), this.radius * Math.sin(currtRadius + radius) * Math.sin(j * stepAng), this.radius * Math.cos(radius * (i + 1)));
                //Normals in line with the vertexes

                this.texCoords.push(0.5 + Math.cos(j * stepAng) * Math.sin(currtRadius), 1 - (0.5 + Math.sin(j * stepAng) * Math.sin(currtRadius)));
                this.texCoords.push(0.5 + Math.cos(j * stepAng) * Math.sin((i + 1) * radius), 1 - (0.5 + Math.sin(j * stepAng) * Math.sin((i + 1) * radius)));

                this.indices.push((i * 2 * this.slices) + (2 * j) + 0);
                this.indices.push((i * 2 * this.slices) + (2 * j) + 1);
                this.indices.push((i * 2 * this.slices) + (((2 * j) + 3) % (this.slices * 2)));

                this.indices.push((i * 2 * this.slices) + (((2 * j) + 2) % (this.slices * 2)));
                this.indices.push((i * 2 * this.slices) + (((2 * j) + 0) % (this.slices * 2)));
                //This doesn't need integer division
                this.indices.push((i * 2 * this.slices) + (((2 * j) + 3) % (this.slices * 2)));
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
    ;
      updateTexCoords(){};
}
;
