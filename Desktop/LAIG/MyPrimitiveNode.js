/**
 * MyPrimitiveNode class, representing a leaf in the scene graph.
 * @constructor
 **/



function MyPrimitiveNode(graph, type, args) {

    this.graph = graph;
    this.type = type;
    this.args = args;

    this.obj = null;

    switch (this.type) {
        case 'rectangle':
            this.obj = new MyQuad(this.graph.scene, Number(args[0]), Number(args[1]), Number(args[2]), Number(args[3]));
            break;

        case 'sphere':
            this.obj = new MySphere(this.graph.scene, args[0], args[1], args[2]);
            break;

        case 'cylinder':
        case 'cilinder':
            this.obj = new MyCilinder(this.graph.scene, Number(args[0]), Number(args[1]), Number(args[2]), Number(args[3]), Number(args[4]));
            break;

        case 'triangle':
            this.obj = new MyTriangle(this.graph.scene, args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8]);
            break;

        case 'thorus':
        case 'torus':
            this.obj = new MyTorus(this.graph.scene, Number(args[0]), Number(args[1]), Number(args[2]), Number(args[3]));
            break;

            /*NURBS*/

        case 'plane':
            this.obj = new MyPlane(this.graph.scene, Number(args[0]), Number(args[1]));
            break;

        case 'patch':
            this.obj = new MyPatch(this.graph.scene, Number(args[0]), Number(args[1]), Number(args[2]), Number(args[3]), args[4]);
            break;

        case 'cylinder2':
        case 'cilinder2':
            this.obj = new MyCylinder2(this.graph.scene, Number(args[0]), Number(args[1]), Number(args[2]), Number(args[3]), Number(args[4]));
            break;

        case 'vehicle':
            alert("veh");
            //<vehicle />
            // inclui pelo menos 1 superficie nao plana gerada utilizando NURBs or js
            break;



            /*SHADERS*/

        case 'terrain':
            alert("TERRAIN mais dentro");
            //<terrain idtexture="terrainid" idheightmap="1" parts="100" heightscale="0.1" />
            this.obj = new MyTerrain(this.graph.scene, Number(args[2]), Number(args[2]), args[0], args[1], Number(args[3]));
            break;


        case 'water':
            alert("WATER mais fora");
            this.selectedExampleShader = 6;
            //<water idtexture="waterid" idwavemap="1" parts="100" heightscale="0.1" texscale="1" />
            this.obj = new MyWater(this.graph.scene, Number(args[2]), Number(args[2]), args[0], args[1], Number(args[3]), Number(args[4])); //[4]texscale nao passa
            break;
    }
};

MyPrimitiveNode.prototype.display = function() {

    this.obj.display();

};

MyPrimitiveNode.prototype.updateTexCoords = function(sFactor, tFactor) {

    this.obj.updateTexCoords(sFactor, tFactor);
};