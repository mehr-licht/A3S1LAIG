var SERVER_PORT = 8081;

ERRORS = {
    ISOLATED: -3,
    WRONG_COLOR: -2,
    NOT_RECEIVED: -1,
    OK: 0,

};

LEVELS = {
    EASY: 0,
    HARD: 1
};

initialBoard = [];

/**
 * Game
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
class Game {


    constructor(scene, init_board, init_turn) {
        this.scene = scene;
        this.currentPlayer = 0;
        this.colors = ['white', 'black'];
        //  this.players = [[0,1],[0,2]];
        //this.color_bases = [[[8,0,10],[8,0,12]],[[8,0,-10],[8,0,-12]]];
        // this.piece_bases = [[[-8,0,-10],[-6,0,-10],[-4,0,-10],[-2,0,-10]],[[-8,0,10],[-6,0,10],[-4,0,10],[-2,0,10]]];
        this.init_board = init_board;
        this.animationCounter = 0;
        this.board = new Board(scene, this);
        this.running = true;
        this.over = false;
        this.computer_playing = false;
        this.turn = init_turn || this.colors[0];
        var start = Date.now();
        var newG = new Game(scene, init_board, init_turn);
        this.save = { start, newG };

        for (let i = 0; i < this.colors.length; i++) {
            let color_node = this.scene.graph.nodes[this.colors[i]];
            mat4.identity(color_node.transformMatrix);
            mat4.translate(color_node.transformMatrix, color_node.transformMatrix, color_node.position);
            mat4.rotate(color_node.transformMatrix, color_node.transformMatrix, -Math.PI / 2, [1, 0, 0]);
        }
        document.getElementById('turn').innerText = 'Player 1';

    }

    //*************************************************************************************************
    //                             PROLOG COMMUNICATION FUNCTIONS                                    //
    //***********************************************************************************************//
    getPrologRequest(requestString, onSuccess, onError, port) {
        let requestPort = port || SERVER_PORT;
        let request = new XMLHttpRequest();
        request.open('GET', 'http://localhost:' + requestPort + '/' + requestString, true);

        request.onload = onSuccess;

        request.onerror = onError || prologRequestError;

        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send();
    }

    prologRequestError(data) {
        console.log('Prolog request error:');
        console.log(data);
    }

    //*************************************************************************************************
    //                        FUNCTIONS TO SEND COMMANDS TO PROLOG AND GET RESPONSES                 //
    //***********************************************************************************************//

    /**
     * Move

     */
    move(tabuleiro, pecaX, pecaY, destX, destY) {
        let requestString = 'mov(' +
            JSON.stringify(tabuleiro).replace(/"/g, '') + ',' +
            JSON.stringify(pecaX).replace(/"/g, '') + ',' +
            JSON.stringify(pecaY).replace(/"/g, '') + ',' +
            JSON.stringify(destX).replace(/"/g, '') + ',' +
            JSON.stringify(destY).replace(/"/g, '') + ')';

        this.getPrologRequest(requestString, callback);
        /**gets 
         * -1 => not received
         * 0 + tabuleiroFinal
         *  */
        // return callback;
    }


    validMoves(tabuleiro, line, column, color) {
        let requestString = 'validMoves(' +
            JSON.stringify(tabuleiro).replace(/"/g, '') + ',' +
            JSON.stringify(line).replace(/"/g, '') + ',' +
            JSON.stringify(column).replace(/"/g, '') + ',' +
            JSON.stringify(color).replace(/"/g, '') + ')';

        this.getPrologRequest(requestString, callback);
        /**gets 
         * -3 => piece is isolated
         * -2 => wrong color chosen
         * -1 => not received
         * 0 => OK
         *  */
        //return callback
    }

    checkDifferenceIndexes(pecaX, pecaY, destX, destY) {
        let requestString = 'checkDifferenceIndexes(' +
            JSON.stringify(pecaX).replace(/"/g, '') + ',' +
            JSON.stringify(pecaY).replace(/"/g, '') + ',' +
            JSON.stringify(destX).replace(/"/g, '') + ',' +
            JSON.stringify(destY).replace(/"/g, '') + ')';

        this.getPrologRequest(requestString, callback);
        /**gets 
         * -3 => empty space
         * -2 => to wrong color
         * -1 => not received
         * 0 => OK
         *  */
        // return callback;
    }

    jogadasValidas(tabuleiro, color) {
        let requestString = 'jogadasValidas(' +
            JSON.stringify(tabuleiro).replace(/"/g, '') + ',' +
            JSON.stringify(color).replace(/"/g, '') + ')';
        this.getPrologRequest(requestString, callback);
        /**gets 
         * -1 => not received
         * 0 => OK + number of valid Moves
         *  */
        // return callback;
    }


    /*
        gameOver(tabuleiro,color) {
            let requestString = 'game_over(' +
            JSON.stringify(tabuleiro).replace(/"/g, '') + ',' +
            JSON.stringify(color).replace(/"/g, '') + ')';
        this.getPrologRequest(requestString, callback);
         }*/


    //*************************************************************************************************
    //                             PROLOG COMMUNICATION FUNCTIONS                                    //
    //***********************************************************************************************//


    /*
     * clickando no botao, faz um setBoard(initialBoard)
     * recalcula score e turns 
     * display
     */
    undo() {

    }


    /*
     * clickando no botao, faz um setBoard(tabuleiroInicial)
     * recalcula score e turns 
     * display
     */
    reset() {

    }



    /*
     * clickando no botao,
     * se nao houver jogo a decorrer e se tiver coisas nos arrays: 
     * setBoard
     * loop{
     * mov(guardado)
     * display}
     */
    film() {

    }

    //uncalled for
    /*
     * clickando no botao,
     * fica com this.save=tabuleiro,turn
     * this.save = new Game(scene,)
     * ->jogo
     */
    save() {
        var now = new Date();
        var newG = new Game(scene, init_board, this.turn);
        this.save = {
            now,
            newG
        };
    }


    //uncalled for
    /*
     * clickando no botao,
     * setBoard(this.save)
     * ->jogo
     */
    load(which) {
        //   new Date().toLocaleString()
        //  this.Game = new Game(scene,which.newG.board,which.newG.turn);
    }



    //*************************************************************************************************
    //                                          GAME UTILITIES                                       //
    //***********************************************************************************************/
    setBoard(board) {
        this.board = board;
    }

    getBoard() {
        return this.board;
    }



}