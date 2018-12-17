/**
 * MyPeca
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyPeca extends CGFObject {

    constructor(scene, color) {
        super(scene);
        this.scene = scene;
        this.base = 1;
        this.top = 1;
        this.height = 0.2;
        this.slices = 30;
        this.stacks = 30;
        this.color = color;

        this.materialWhites = new CGFappearance(this);
        this.materialWhites.setAmbient(0.1, 0.2, 0.3, 1);
        this.materialWhites.setDiffuse(0.2, 0.3, 0.1, 1);
        this.materialWhites.setSpecular(0.3, 0.1, 0.2, 1);
        this.materialWhites.setShininess(120);

        this.materialBlacks = new CGFappearance(this);
        this.materialBlacks.setAmbient(0.9, 0.8, 0.7, 1);
        this.materialBlacks.setDiffuse(0.7, 0.9, 0.8, 1);
        this.materialBlacks.setSpecular(0.8, 0.7, 0.9, 1);
        this.materialBlacks.setShininess(120);

        this.body = new MyCilinder(this.scene, this.base, this.top, this.height, this.slices, this.stacks);
        this.topo = new MyCircle(this.scene, this.slices, this.stacks);
        this.initBuffers();
    }

    initBuffers() {
        /*
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
                var raio = this.base;
                var incraio = (this.top - this.base) / this.stacks;

                for (var t = 0; t <= this.stacks; t++) {
                    for (var s = 0; s <= this.slices; s++) {

                        //calculating coordinates
                        x = Math.cos(angle * s) * raio;
                        y = Math.sin(angle * s) * raio;

                        //pushing vertices
                        this.vertices.push(x);
                        this.vertices.push(y);
                        this.vertices.push(z);

                        //pushing normals
                        this.normals.push(x);
                        this.normals.push(y);
                        this.normals.push(0);

                        //pushing textCoords
                        this.texCoords.push(s / this.slices, t / this.stacks);

                        //unless last stack and slice
                        if (t != this.stacks && s != this.slices) {
                            //calculating indices
                            var indice = t * (this.slices + 1);
                            var indiceS = indice + s;
                            var indiceSS = indiceS + this.slices + 1;

                            //pushing indices
                            this.indices.push(indiceS);
                            this.indices.push(1 + indiceS);
                            this.indices.push(indiceSS);
                            this.indices.push(1 + indiceS);
                            this.indices.push(1 + indiceSS);
                            this.indices.push(indiceSS);
                        }
                    }
                    raio += incraio;
                    z += this.height / this.stacks;
                    //z increment
                }

                this.primitiveType = this.scene.gl.TRIANGLES;
                this.initGLBuffers();*/
    };
    display() {
        //body
        this.scene.pushMatrix();
        this.color == 'black' ? this.materialBlacks.apply() : this.materialWhites.apply();
        this.body.display();
        this.scene.popMatrix();

        //topo
        this.scene.pushMatrix();
        this.scene.scale(this.top, this.top, 1);

        this.scene.translate(0, 0, this.height);
        (this.color == 'black') ? this.materialBlacks.apply(): this.materialWhites.apply();
        this.topo.display();
        this.scene.popMatrix();

        //base
        this.scene.pushMatrix();
        this.scene.scale(this.base, this.base, 1);
        //this.scene.translate(1, 0, 0);
        this.scene.rotate(Math.PI, 1, 0, 0);
        (this.color == 'black') ? this.materialBlacks.apply(): this.materialWhites.apply();
        this.topo.display();
        this.scene.popMatrix();

    };

    updateTexCoords() {};

};