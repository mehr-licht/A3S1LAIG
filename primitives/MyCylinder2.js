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

        var meioTopo = this.top / 2;
        var meioBase = this.base / 2;

        var nurbsSurface = new CGFnurbsSurface(3, // degree on U: 3 control vertexes U
            1, // degree on V: 2 control vertexes on V
            [ // U = 0
                [ // V = 0..1;
                    [-this.base, -this.height / 2, 0.0, 1], //leftbottom, , 
                    [-this.top, this.height / 2, 0.0, 1] //leftTop

                ],
                // U = 1
                [ // V = 0..1
                    [-this.base, -this.height / 2, this.base * 4 / 3, 1], //middleBottom
                    [-this.top, this.height / 2, this.top * 4 / 3, 1] //middleTop
                ],
                // U = 2
                [ // V = 0..1							 
                    [this.base, -this.height / 2, this.base * 4 / 3, 1], //middleBottom
                    [this.top, this.height / 2, this.top * 4 / 3, 1] //middleTop
                ],
                // U = 3
                [ // V = 0..1							 
                    [this.base, -this.height / 2, 0.0, 1], //rightBottom
                    [this.top, this.height / 2, 0.0, 1] //rightTop
                ]
            ], );


        /*
                //sergio tashini
                var nurbsSurface1 = new CGFnurbsSurface(5, // degree on U: 3 control vertexes U
                    1, // degree on V: 2 control vertexes on V
                    [ // U = 0
                        [ // V = 0..1;
                            [-this.base, -this.height / 2, 0.0, 1], //leftbottom, , 
                            [-this.top, this.height / 2, 0.0, 1] //leftTop

                        ],
                        // U = 1
                        [ // V = 0..1
                            [-this.base / 2, -this.height / 2, this.base / 2, 1], //middleBottom
                            [-this.top / 2, this.height / 2, this.top / 2, 1] //middleTop
                        ],
                        // U = 2
                        [ // V = 0..1							 
                            [0, -this.height / 2, this.base, 1], //rightBottom
                            [0, this.height / 2, this.top, 1] //rightTop
                        ],
                        // U = 3
                        [ // V = 0..1;
                            [this.base / 2, -this.height / 2, this.base / 2, 1], //middleBottom
                            [this.top / 2, this.height / 2, this.top / 2, 1] //middleTop

                        ],
                        // U = 4
                        [ // V = 0..1
                            [this.base, -this.height / 2, 0, 1], //middleBottom
                            [this.top, this.height / 2, 0, 1] //middleTop
                        ],
                        // U = 5
                        [ // V = 0..1							 
                            [0, -this.height / 2, 0.0, 1], //rightBottom
                            [0, this.height / 2, 0.0, 1] //rightTop
                        ]
                    ], );*/

        this.obj = new CGFnurbsObject(this.scene, this.slices, this.stacks, nurbsSurface);

    };
    display() {
        this.scene.gl.disable(this.scene.gl.CULL_FACE);
        this.obj.display();
        this.scene.pushMatrix();

        this.scene.rotate(Math.PI, 0, 1, 0);
        this.obj.display();
        this.scene.popMatrix();

        this.scene.gl.enable(this.scene.gl.CULL_FACE);
    };

    updateTexCoords(sFactor, tFactor) {};
};