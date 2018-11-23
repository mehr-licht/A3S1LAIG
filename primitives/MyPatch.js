/**
 * MyPatch
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyPatch extends CGFobject {

    constructor(scene, nPointsU, nPointsV, nPartsU, nPartsV, controlPoints) {
        super(scene);

        this.nPartsU = nPartsU;
        this.nPartsV = nPartsV;
        this.nPointsU = nPointsU;
        this.nPointsV = nPointsV;
        this.controlPoints = controlPoints;

        this.controlVertexes = [];
        this.controlVertexes2 = [];
        for (var i = 0; i <= this.nPointsU; i++) {

            var tmp = [];
            for (var j = 0; j <= this.nPointsV; j++) {
                var iter = j + i * (this.nPointsV + 1);
                tmp.push([this.controlPoints[iter][0], this.controlPoints[iter][1], this.controlPoints[iter][2], 1]);
                //   alert(iter + "\n" + i + "*" + this.nPointsV + "+" + j);
            }
            // alert("fim i=" + i);
            this.controlVertexes.push(tmp);
        }
        console.log(this.controlVertexes);
        this.nurbsSurface = new CGFnurbsSurface(this.nPointsU, this.nPointsV, this.controlVertexes);

        this.obj = new CGFnurbsObject(this.scene, this.nPartsU, this.nPartsV, this.nurbsSurface);

        //<patch npointsU="3" npointsV="4" npartsU="5" npartsV="8">
        // <controlpoint xx="1" yy="2" zz="3" />
        //...;

    };
    display() {
        this.scene.gl.disable(this.scene.gl.CULL_FACE);
        this.obj.display();
        this.scene.gl.enable(this.scene.gl.CULL_FACE);
    };
    updateTexCoords(sFactor, tFactor) {};
};