/**
 * MyTriangle
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyTriangle extends CGFobject {

    constructor(scene, x1, y1, z1, x2, y2, z2, x3, y3, z3) {
        super(scene);
        this.scene = scene;
        this.x1 = x1;
        this.x2 = x2;
        this.x3 = x3;
        this.y1 = y1;
        this.y2 = y2;
        this.y3 = y3;
        this.z1 = z1;
        this.z2 = z2;
        this.z3 = z3;

        this.initBuffers();
    }

    initBuffers() {

        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.baseTexCoords = [];

        this.vertices.push(this.x1, this.y1, this.z1);
        //P0
        this.vertices.push(this.x2, this.y2, this.z2);
        //P1
        this.vertices.push(this.x3, this.y3, this.z3);
        //P2

        // AxB = -BxA
        var A = [this.x1, this.y1, this.z1];
        var B = [this.x2, this.y2, this.z2];
        var C = [this.x3, this.y3, this.z3];

        var vec1 = [this.x3 - this.x1, this.y3 - this.y1, this.z3 - this.z1];
        var vec2 = [this.x2 - this.x1, this.y2 - this.y1, this.z2 - this.z1];

      
        var vecN = [vec2[1] * vec1[2] - vec1[1] * vec2[2], -1 * (vec2[0] * vec1[2] - vec1[0] * vec2[2]), vec2[0] * vec1[1] - vec1[0] * vec2[1], ];

        for (let i = 0; i < 3; i++)
          this.normals.push(vecN[0], vecN[1], vecN[2]);
      


        //pythagoras
        var a = Math.sqrt((this.x1 - this.x3) * (this.x1 - this.x3) +
            (this.y1 - this.y3) * (this.y1 - this.y3) +
            (this.z1 - this.z3) * (this.z1 - this.z3));

        //b -> dist(P0, P1)
        var b = Math.sqrt((this.x2 - this.x1) * (this.x2 - this.x1) +
            (this.y2 - this.y1) * (this.y2 - this.y1) +
            (this.z2 - this.z1) * (this.z2 - this.z1));

        //c -> dist(P1, P2)
        var c = Math.sqrt((this.x3 - this.x2) * (this.x3 - this.x2) +
            (this.y3 - this.y2) * (this.y3 - this.y2) +
            (this.z3 - this.z2) * (this.z3 - this.z2));

        var cosine = (a * a - b * b + c * c) / (2 * a * c);
        var angle = Math.acos(cosine);

        this.baseTexCoords.push(c - a * cosine, a * Math.sin(angle)); //P1
        this.baseTexCoords.push(0, 0); //P2
        this.baseTexCoords.push(c, 0); //P3


        this.texCoords = new Array(this.baseTexCoords.length);
        this.updateTexCoords(1,1);
    
        this.indices.push(0, 2, 1);

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();

    };

    updateTexCoords(sFactor, tFactor) {
        for (let i = 0; i < this.baseTexCoords.length; i++) {
            if (i % 2 == 0)
                this.texCoords[i] = this.baseTexCoords[i] / sFactor;
            else
                this.texCoords[i] = (tFactor - this.baseTexCoords[i]) / tFactor;
        }
        this.updateTexCoordsGLBuffers();
    };

};