/**
 * MyComponentNode class, representing an intermediate node in the scene graph.
 * @constructor
 **/

function MyComponentNode(graph, nodeID) {
    this.graph = graph;

    this.nodeID = nodeID;

    // IDs of child nodes.
    this.children = [];

    // IDs of child nodes.
    this.leaves = [];

    // The material ID.
    this.materialID = null;

    // The texture ID.
    this.textureID = null;

    //The animations this node has
    //this.animations = [];

    //the animation ID
    this.animationID = null;

    this.transformMatrix = mat4.create();
    mat4.identity(this.transformMatrix);


    this.animRefs = [];

    this.animMatrix = mat4.create();
    mat4.identity(this.animMatrix);

    this.time = 0;
    this.currAnimation = 0;
    this.combIte = 0;
    this.currentSection = 0;



}

/**
 * Adds the reference (ID) of another node to this node's children array.
 */
MyComponentNode.prototype.addChild = function(nodeID) {
    this.children.push(nodeID);
}

/**
 * Adds a leaf to this node's leaves array.
 */
MyComponentNode.prototype.addLeaf = function(leaf) {
    this.leaves.push(leaf);
}

/**
 * Adds an animation reference to this node's animation references array.
 */
MyComponentNode.prototype.addAnim = function(animRef) {
    this.animRefs.push(animRef);
}

/**
 * Gets this node's children
 */
MyComponentNode.prototype.getChildren = function() {
    return this.children;
}


/**
 * Updates the Animation Matrix for the Node
 * @param dt Time between interrupts in miliseconds
 */
MyComponentNode.prototype.updateAnim = function(dt) {

    // dt /= 1000; //implica rapidez de updates

    for (var i = 0; i < this.animations.length; i++) { //POR CAUSA DESTE FOR FAZia UMA ANIMAÇÃO DE CADA VEZ

        var animation = this.graph.animations[this.animations[i]];
        //alert("animation.animTime=" + animation.animTime + ">= dt=" + dt);
        //if (animation.animTime < dt) {
        // alert("cN=" + dt);
        animation.update(this, dt); //este chama o "circular"/"linear"

        // break;
        // }
        /*else {
                   // alert("animation=" + this.animations[i] + "\ndt=" + dt + "\nanimDur=" + animation.animTime
                   dt -= animation.animTime;
               }*/
    }
}