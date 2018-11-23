/**
 * MyPrimitiveNode class, representing a leaf in the scene graph.
 * @constructor
**/

function MyPrimitiveNode(graph, type,args) {

    this.graph = graph;
    this.type = type;
    this.args = args;

    this.obj = null;
   
    switch (this.type) {
    case 'rectangle':
        this.obj = new MyQuad(this.graph.scene,Number(args[0]),Number(args[1]),Number(args[2]),Number(args[3]));
        break;

    case 'sphere':
       this.obj = new MySphere(this.graph.scene,args[0],args[1],args[2]);
        break;

    case 'cylinder':
    case 'cilinder':
        this.obj = new MyCilinder(this.graph.scene,Number(args[0]),Number(args[1]),Number(args[2]),Number(args[3]),Number(args[4]));
        break;

    case 'triangle':
        this.obj = new MyTriangle(this.graph.scene,args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7],args[8]);
        break;

    case 'thorus':
    case 'torus':
       this.obj = new MyTorus(this.graph.scene,Number(args[0]),Number(args[1]),Number(args[2]),Number(args[3]));
        break;
    }
}
;

MyPrimitiveNode.prototype.display = function() {
    this.obj.display();
};

MyPrimitiveNode.prototype.updateTexCoords = function(sFactor, tFactor) {
    this.obj.updateTexCoords(sFactor, tFactor);
};