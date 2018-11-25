/**
 * MyVehicle
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyVehicle extends CGFobject {

    constructor(scene) {
        super(scene);

        var nurbsLeg = new CGFnurbsSurface(2,// degree on U: 2 control vertexes U
        1,// degree on V: 2 control vertexes on V
        [// U = 0
        [// V = 0..1;
        [-1.0, 0.0, 0.0, 1], [-1.0, 2.0, 0.0, 1]], // U = 1
        [// V = 0..1
        [0.0, 0.0, 0.0, 1], [0.0, 1.5, 0.0, 1]], // U = 2
        [// V = 0..1
        [1.0, -2.0, 0.0, 1], [1.0, -2.0, 0.0, 1]]],// translation of surface 
        );

        var nurbsLeg2 = new CGFnurbsSurface(2,// degree on U: 2 control vertexes U
        1,// degree on V: 2 control vertexes on V
        [// U = 0
        [// V = 0..1;
        [1.0, -2.0, 0.0, 1], [1.0, -2.0, 0.0, 1]], // U = 1
        [// V = 0..1
        [0.0, 0.0, 0.0, 1], [0.0, 1.5, 0.0, 1]], // U = 2
        [// V = 0..1
        [-1.0, 0.0, 0.0, 1], [-1.0, 2.0, 0.0, 1]]],// translation of surface 
        );

        var nurbsEgg = new CGFnurbsSurface(3,// degree on U: 3 control vertexes U
        3,// degree on V: 2 control vertexes on V
        [// U = 0
        [// V = 0..1;
        [-1.5, 0, 0.0, 1], [-1.5, 0, 0.0, 1], [-1.5, 0, 0.0, 1], [-1.5, 0, 0.0, 1]], // U = 1
        [// V = 0..1
        [-1.5, -1.5, 0, 1], [-1.5, 0, 1.5, 1], [-1.5, 0, 1.5, 1], [-1.5, 1.5, 0, 1]], [// V = 0..1
        [2, -1.5, 0, 1], [2, 0, 2, 1], [2, 0, 2, 1], [2, 1.5, 0, 1]], // U = 2
        [// V = 0..1							 
        [1.5, 0, 0.0, 1], [1.5, 0, 0, 1], [1.5, 0, 0, 1], [1.5, 0, 0.0, 1]]],// translation of surface 
        );
        this.Leg2 = new CGFnurbsObject(this.scene,20,20,nurbsLeg2);
        this.Leg = new CGFnurbsObject(this.scene,20,20,nurbsLeg);
        this.Egg = new CGFnurbsObject(this.scene,20,20,nurbsEgg);

        this.legAppearance = new CGFappearance(this.scene);
        this.legAppearance.setAmbient(1, 0, 0, 1);
        this.legAppearance.setDiffuse(1, 0, 0, 1)
        this.legAppearance.setSpecular(1, 0, 0, 1);
        this.legAppearance.setShininess(200);
        this.legAppearance.loadTexture("images/red.png");

        this.eggAppearance = new CGFappearance(this.scene);
        this.eggAppearance.setAmbient(1, 140 / 255, 0, 1);
        this.eggAppearance.setDiffuse(1, 140 / 255, 0, 1)
        this.eggAppearance.setSpecular(1, 140 / 255, 0, 1);
        this.eggAppearance.setShininess(200);
        this.eggAppearance.loadTexture("images/egg.png");

    }
    ;display() {

        //meioOvo1
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.rotate(Math.PI, 1, 0, 0);
        this.eggAppearance.apply();
        this.Egg.display();
        this.scene.popMatrix();

        //meioOvo2
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.eggAppearance.apply();
        this.Egg.display();
        this.scene.popMatrix();

        //perna1
        this.scene.pushMatrix();
        this.scene.scale(0.8, 0.4, 0.4);
        this.scene.rotate(-Math.PI * 2 / 3, 1, 0, 0);
        this.scene.translate(-1.7, 2.5, -0.25);
        this.legAppearance.apply();
        this.Leg.display();
        this.scene.popMatrix();

        //perna1_2
        this.scene.pushMatrix();
        this.scene.scale(0.8, 0.4, 0.4);
        this.scene.rotate(-Math.PI * 2 / 3, 1, 0, 0);
        this.scene.translate(-1.7, 2.5, -0.25);
        this.legAppearance.apply();
        this.Leg.display();
        this.scene.popMatrix();

        //perna2
        this.scene.pushMatrix();
        this.scene.scale(0.8, 0.4, 0.4);
        this.scene.rotate(Math.PI * 2 / 3, 1, 0, 0);
        this.scene.translate(-1.7, 2.5, -0.25);
        this.legAppearance.apply();
        this.Leg.display();
        this.scene.popMatrix();

        //perna2_2
        this.scene.pushMatrix();
        this.scene.scale(0.8, 0.4, 0.4);
        this.scene.rotate(Math.PI * 2 / 3, 1, 0, 0);
        this.scene.translate(-1.7, 2.5, -0.25);
        this.legAppearance.apply();
        this.Leg2.display();
        this.scene.popMatrix();

        //perna3
        this.scene.pushMatrix();
        this.scene.scale(0.8, 0.4, 0.4);
        this.scene.translate(-1.7, 2.5, -0.25);
        this.legAppearance.apply();
        this.Leg.display();
        this.scene.popMatrix();
        
        //perna3_2
        this.scene.pushMatrix();
        this.scene.scale(0.8, 0.4, 0.4);
        this.scene.translate(-1.7, 2.5, -0.25);
        this.legAppearance.apply();
        this.Leg2.display();
        this.scene.popMatrix();

    }
    ;updateTexCoords() {}
    ;

}
;