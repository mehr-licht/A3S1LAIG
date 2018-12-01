"use strict";

/**
 * Primitive that represents a triangle defined by its 3 points
 * @constructor
 * @param {CGFScene} scene - the scene to which this primitive will belong
 * @param {int} x1 - X coordinate of the first point
 * @param {int} y1 - Y coordinate of the first point
 * @param {int} z1 - Z coordinate of the first point
 * @param {int} x2 - X coordinate of the second point
 * @param {int} y2 - Y coordinate of the second point
 * @param {int} z2 - Z coordinate of the second point
 * @param {int} x3 - X coordinate of the third point
 * @param {int} y3 - Y coordinate of the third point
 * @param {int} z3 - Z coordinate of the third point
 */
function PrimitiveTriangle(scene, x1, y1, z1, x2, y2, z2, x3, y3, z3)
{
	CGFobject.call(this, scene);

	this.ampT = null;
	this.ampS = null;

	this.initBuffers(x1, y1, z1, x2, y2, z2, x3, y3, z3);
};

PrimitiveTriangle.prototype = Object.create(CGFobject.prototype);
PrimitiveTriangle.prototype.constructor=PrimitiveTriangle;

/**
  * Initializes the triangle's buffers
  */
PrimitiveTriangle.prototype.initBuffers = function (x1, y1, z1, x2, y2, z2, x3, y3, z3)
{
	let vertex_A = vec3.fromValues(x1,y1,z1);
	let vertex_B = vec3.fromValues(x2,y2,z2);
	let vertex_C = vec3.fromValues(x3,y3,z3);

	let AB = vec3.create();
	vec3.sub(AB,vertex_B,vertex_A);
	let AC = vec3.create();
	vec3.sub(AC,vertex_C,vertex_A);

	this.vertices = [
		x1, y1, z1,
		x2, y2, z2,
		x3, y3, z3
	];

	this.indices = [
		0, 1, 2
	];

	// Normals
	let N = vec3.create();
	vec3.cross(N,AB,AC);
	vec3.normalize(N,N);

	this.normals = [
		N[0],N[1],N[2],
		N[0],N[1],N[2],
		N[0],N[1],N[2]
	];

	//Dot Product to get the angle
	let beta = Math.acos(vec3.dot(AB,AC)/(vec3.len(AB)*vec3.len(AC)));

	//TexCoords of the top vertex, C
	let C = [Math.cos(beta) * vec3.len(AC), Math.sin(beta) * vec3.len(AC)];

	this.texCoords = [
		0, 0,
		vec3.length(AB), 0,
		C[0], C[1]
	];

	this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};

/**
  * Applies texture amplification factors to the texture coordinates
  * @param {int} ampS - amplification factor in the S dimension
  * @param {int} ampT - amplification factor in the T dimension
  */
PrimitiveTriangle.prototype.setTexCoords = function (ampS, ampT)
{
	if (this.ampS == ampS && this.ampT == ampT)
		return;

	this.ampS = ampS;
	this.ampT = ampT;

	for (let i = 0; i < this.texCoords.length; i+=2) {
		this.texCoords[i] = this.texCoords[i]/this.ampS;
		this.texCoords[i+1] = this.texCoords[i+1]/this.ampT;
	}

	this.updateTexCoordsGLBuffers();
};
