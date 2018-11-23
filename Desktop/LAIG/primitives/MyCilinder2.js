/**
 * MyCylinder2
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyCylinder2 extends CGFobject {

    constructor(scene, base, top, height, slices, stacks) {
        super(scene);
        this.base = base;
        this.top = top;
        this.height = height;
        this.slices = slices;
        this.stacks = stacks;


        //só fiz para semi-cilindro
        //<cylinder2 base="1.0" top="0.8" height="5" slices="20" stacks="20" />
        var nurbsSurface = new CGFnurbsSurface(2, // degree on U: 3 control vertexes U
            1, // degree on V: 2 control vertexes on V
            [ // U = 0
                [ // V = 0..1;
                    [-1.5, -1.5, 0.0, 1],
                    [-1.5, 1.5, 0.0, 1]

                ],
                // U = 1
                [ // V = 0..1
                    [0, -1.5, 3.0, 1],
                    [0, 1.5, 3.0, 1]
                ],
                // U = 2
                [ // V = 0..1							 
                    [1.5, -1.5, 0.0, 1],
                    [1.5, 1.5, 0.0, 1]
                ]
            ], );
        var obj = new CGFnurbsObject(this, args[3], args[4], nurbsSurface);
        //falta base[0], top[1], e height[2]






        /*




                this.nPartsU = nPartsU;
                this.nPartsV = nPartsV;
                this.nPointsU = nPointsU;
                this.nPointsV = nPointsV;
                this.controlPoints = controlPoints;

                var controlVertexes = [];
                var controlVertexes2 = [];;
                for (var i = 0; i < this.nPointsU; i++) {

                    var tmp = [];
                    for (var j = 0; j < this.nPointsV; j++) {
                        var iter = j + i * this.nPointsV;
                        tmp.push([this.controlPoints[iter][0], this.controlPoints[iter][1], this.controlPoints[iter][2], 1]);

                    }
                    controlVertexes.push(tmp);
                }
                controlVertexes2.push(controlVertexes);

                this.nurbsSurface = new CGFnurbsSurface(this.nPointsU, this.nPointsV, controlVertexes2);
             */



    };
    display() {
        this.scene.gl.disable(this.scene.gl.CULL_FACE);
        this.obj.display();
        this.scene.gl.enable(this.scene.gl.CULL_FACE);
    };
    updateTexCoords() {};
};