"use strict";

/**
 * Primitive that represents a rectangle in the x0y plane
 * @constructor
 * @param {CGFScene} scene - the scene to which this primitive will belong
 * @param {int} xleft - the X coordinate of the top left point
 * @param {int} yleft - the Y coordinate of the top left point
 * @param {int} xright - the X coordinate of the bottom right point
 * @param {int} yright - the Y coordinate of the bottom right point
 */
function PrimitiveRectangle(scene, xleft, yleft, xright, yright)
{
	CGFobject.call(this, scene);

	this.minX = xleft;
	this.maxX = xright;
	this.minY = yright;
	this.maxY = yleft;

	this.ampS = null;
	this.ampT = null;

	this.initBuffers();
};

PrimitiveRectangle.prototype = Object.create(CGFobject.prototype);
PrimitiveRectangle.prototype.constructor=PrimitiveRectangle;

/**
  * Initializes the rectangle's buffers
  */
PrimitiveRectangle.prototype.initBuffers = function()
{
	this.vertices = [
			this.minX, this.maxY, 0,
			this.minX, this.minY, 0,
			this.maxX, this.maxY, 0,
			this.maxX, this.minY, 0
	];

	this.indices = [
		  0, 1, 2,
			3, 2, 1
    ];

	this.normals = [
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
			0, 0, 1
	];

	//texCoords without amplification factor
	this.regTexCoords = [
		0, 0,
		0, Math.abs(this.maxY-this.minY),
		Math.abs(this.maxX-this.minX), 0,
		Math.abs(this.maxX-this.minX), Math.abs(this.maxY-this.minY)
	 ];

	this.texCoords = this.regTexCoords.slice();
	this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};

/**
  * Applies texture amplification factors to the texture coordinates
  * @param {int} ampS - amplification factor in the S dimension
  * @param {int} ampT - amplification factor in the T dimension
  */
PrimitiveRectangle.prototype.setTexCoords = function(ampS, ampT)
{
	if (this.ampS == ampS && this.ampT == ampT)
		return;

	this.ampS = ampS;
	this.ampT = ampT;

	for (let i = 0; i < this.texCoords.length; i+=2) {
        this.texCoords[i] = this.regTexCoords[i]/this.ampS;
        this.texCoords[i+1] = this.regTexCoords[i+1]/this.ampT;
    }

	this.updateTexCoordsGLBuffers();
}
