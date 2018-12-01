"use strict";

function Counter(scene, digit1, digit0, label)
{
    this.scene = scene;
    this.d1 = digit1;
    this.d0 = digit0;
    console.log("D: " + digit1 + " " + digit0);
    this.triangle1 = new PrimitiveTriangle(scene, 0, 1, 0, 0, 0, 0, 0, 0, 1);
    this.triangle2 = new PrimitiveTriangle(scene, 2, 0, 0, 2, 1, 0, 2, 0, 1);
    this.plane = new PrimitiveRectangle(scene, 0, 1, 2, 0);
    this.plane.setTexCoords(2, 1);

    this.digits = {
        "0": new CGFtexture(this.scene, "scenes/textures/numbers/zero.png"),
        "1": new CGFtexture(this.scene, "scenes/textures/numbers/one.png"),
        "2": new CGFtexture(this.scene, "scenes/textures/numbers/two.png"),
        "3": new CGFtexture(this.scene, "scenes/textures/numbers/three.png"),
        "4": new CGFtexture(this.scene, "scenes/textures/numbers/four.png"),
        "5": new CGFtexture(this.scene, "scenes/textures/numbers/five.png"),
        "6": new CGFtexture(this.scene, "scenes/textures/numbers/six.png"),
        "7": new CGFtexture(this.scene, "scenes/textures/numbers/seven.png"),
        "8": new CGFtexture(this.scene, "scenes/textures/numbers/eight.png"),
        "9": new CGFtexture(this.scene, "scenes/textures/numbers/nine.png")
    };
    this.label = new CGFtexture(this.scene, label);
}
Counter.prototype.constructor = Counter;

Counter.prototype.updateDigits = function(d1, d0)
{
    this.d1 = d1;
    this.d0 = d0;
};

Counter.prototype.display = function()
{
    this.scene.pushMatrix();
        this.triangle1.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
        this.triangle2.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
        this.scene.translate(2, 0, 0);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.plane.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.plane.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
        this.scene.translate(0, 0, 1);
        this.scene.rotate(-Math.PI / 4, 1, 0, 0);
        this.scene.scale(1, Math.sqrt(2), 1);
        this.plane.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
        let s = new CGFappearance(this.scene);
        s.setTexture(this.digits[this.d1]);
        s.apply();
        //this.digits[this.d1].bind();
        this.scene.translate(0.1, 0.1, 0.91);
        this.scene.rotate(-Math.PI / 4, 1, 0, 0);
        this.scene.scale(0.4, 0.9, 0.4);
        this.plane.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
        this.digits[this.d0].bind();
        this.scene.translate(1.1, 0.1, 0.91);
        this.scene.rotate(-Math.PI / 4, 1, 0, 0);
        this.scene.scale(0.4, 0.9, 0.4);
        this.plane.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
        this.label.bind();
        this.scene.translate(0.1, 0.8, 0.201);
        this.scene.rotate(-Math.PI / 4, 1, 0, 0);
        this.scene.scale(0.9, 0.2, 0.4);
        this.plane.display();
    this.scene.popMatrix();

    for (let tex in this.digits)
    {
        this.digits[tex].unbind();
    }
    this.label.unbind();
};
