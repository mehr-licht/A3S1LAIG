/**
 * MyPlane
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyPlane extends CGFobject {

    constructor(scene, uParts, vParts) {
        super(scene);
        this.uParts = uParts;
        this.vParts = vParts;

        this.nurbsSurface = new CGFnurbsSurface(1,
            1, [ // U = 0
                [ // V = 0..1;
                    [-0.5, -0.5, 0.0, 1],
                    [-0.5, 0.5, 0.0, 1]

                ],
                // U = 1
                [ // V = 0..1
                    [0.5, -0.5, 0.0, 1],
                    [0.5, 0.5, 0.0, 1]
                ]
            ]);


        this.obj = new CGFnurbsObject(this.scene, this.uParts, this.vParts, this.nurbsSurface);


    };



    display() {
        this.scene.gl.disable(this.scene.gl.CULL_FACE);
        this.obj.display();
        this.scene.gl.enable(this.scene.gl.CULL_FACE);
    };



    updateTexCoords(sFactor, tFactor) {




    };
};