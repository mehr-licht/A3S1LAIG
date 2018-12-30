/**
 * Piece
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
class Piece {

    constructor(scene, id, x, y, z, scale, active, colour) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.z = z;
        this.scale = scale;
        this.colour = colour;
        this.active = active;
    }




    enhancePiece(type) {
        switch (type) {
            case "valid":
                //shader para verde
                break;
            case "invalid":
                //shader para vermelho
                break;
            case "none":
                //sem shader
                break;
            default:
                break;
        }
    }
}