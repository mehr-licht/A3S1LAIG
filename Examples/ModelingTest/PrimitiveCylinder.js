/**
* Primitive that represents a cylinder with configurable dimensions
* and whose base is on the x0y plan
* @constructor
* @param {CGFScene} scene - the scene to which this primitive will belong
* @param {int} height - the height of the cylinder
* @param {int} bottomR - the radius of the bottom lid
* @param {int} topR - the radius of the top lid
* @param {int} stacks - the number of stacks
* @param {int} slices - the number of slices
* @param {boolean} topcap - flag that indicates whether to include the top lid or not
* @param {boolean} botcap - flag that indicates whether to include the bottom lid or not
*/
function PrimitiveCylinder(scene, height, bottomR, topR, stacks, slices, topcap, botcap)
{
	CGFobject.call(this,scene);

    this.slices = slices;
    this.stacks = stacks;
    this.height = height;
    this.bottomR = bottomR;
    this.topR = topR;
    this.diff = topR - bottomR;
    this.topcap = topcap;
    this.botcap = botcap;
    this.cap = new PrimitivePolygon(scene, slices);

	this.initBuffers();
};

PrimitiveCylinder.prototype = Object.create(CGFobject.prototype);
PrimitiveCylinder.prototype.constructor = PrimitiveCylinder;

/**
* Initializes the cylinder's buffers, calculating
* all the coordinates based on the definitions
* set on the constructor
*/
PrimitiveCylinder.prototype.initBuffers = function()
{
	this.vertices = [];

	this.indices = [];

	this.normals = [];

	this.texCoords = [];

    angle = 2*Math.PI / this.slices;
    ds = 1.0 / this.slices;
    dt = 1.0 / this.stacks;
    dr = this.diff / this.stacks;
    dh = this.height / this.stacks;

    for (i = 0, j = 0, s = 0.0; i < this.slices; i++, s += ds)
    {
    	for (k = 0.0, t = 1.0, r = this.bottomR; k < this.height; k += dh, j += 4, t -= dt, r += dr)
    	{
    		this.vertices.push(Math.cos(i*angle)*r, Math.sin(i*angle)*r, k);
    		this.normals.push(Math.cos(i*angle)*r, Math.sin(i*angle)*r, 0);
    		this.texCoords.push(s, t);

    		this.vertices.push(Math.cos(i*angle)*(r+dr), Math.sin(i*angle)*(r+dr), k+dh);
    		this.normals.push(Math.cos(i*angle)*(r+dr), Math.sin(i*angle)*(r+dr), 0);
    		this.texCoords.push(s, t - dt);

    		this.vertices.push(Math.cos((i+1)*angle)*r, Math.sin((i+1)*angle)*r, k);
    		this.normals.push(Math.cos((i+1)*angle)*r, Math.sin((i+1)*angle)*r, 0);
    		this.texCoords.push(s + ds, t);

    		this.vertices.push(Math.cos((i+1)*angle)*(r+dr), Math.sin((i+1)*angle)*(r+dr), k+dh);
    		this.normals.push(Math.cos((i+1)*angle)*(r+dr), Math.sin((i+1)*angle)*(r+dr), 0);
    		this.texCoords.push(s + ds, t - dt);

    		this.indices.push(j + 1, j, j + 3);
    		this.indices.push(j + 2, j + 3, j);
    		this.indices.push(j + 3, j, j + 1);
    		this.indices.push(j, j + 3, j + 2);
    /*
    		if (k == 0 && this.botcap == 1)
    		{
    			this.vertices.push(0, 0, 0);
    			this.normals.push(0, 0, -1);
    			this.texCoords.push(0, 0);
    			this.indices.push(j + 4, j + 2, j);
    			j++;
    		}

    		if (k + dh >= this.height && this.topcap == 1)
    		{
    			this.vertices.push(0, 0, this.height);
    			this.normals.push(0, 0, 1);
    			this.texCoords.push(0, 0);
    			this.indices.push(j + 1, j + 3, j + 4);
    			j++;
    		}*/
    	}
    }

	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};

PrimitiveCylinder.prototype.display = function()
{
    if (this.topcap)
    {
        this.scene.pushMatrix();
		this.scene.translate(0, 0, 1);
        this.scene.scale(this.topR, this.topR, 1);
        this.cap.display();
        this.scene.popMatrix();

		this.scene.pushMatrix();
		this.scene.translate(0, 0, 1);
		this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.scale(this.topR, this.topR, 1);
        this.cap.display();
        this.scene.popMatrix();
    }
    if (this.botcap)
    {
        this.scene.pushMatrix();
		this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.scale(this.bottomR, this.bottomR, 1);
        this.cap.display();
        this.scene.popMatrix();

		this.scene.pushMatrix();
        this.scene.scale(this.bottomR, this.bottomR, 1);
        this.cap.display();
        this.scene.popMatrix();
    }
    this.drawElements(this.primitiveType);
};

/**
* Applies texture amplification factors to the texture coordinates.
* It does nothing, but it is required in all primitive classes
* @param {int} ampS - amplification factor in the S dimension
* @param {int} ampT - amplification factor in the T dimension
*/
PrimitiveCylinder.prototype.setTexCoords = function(ampS, ampT){}
