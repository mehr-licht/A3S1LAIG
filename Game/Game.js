var SERVER_PORT = 8081;
/*initial board*/
var INITIAL_BOARD = [
    [black, white, black, white, black],
    [white, black, white, black, white],
    [black, white, black, white, black],
    [white, black, white, black, white],
    [black, white, black, white, black],
    [white, black, white, black, white]
];
/*score points at the beginning of a regular game*/
var SCORE_1 = 49;
var SCORE_2 = 49;
/*time of each turn (seconds)*/
var TIME_LEFT = 30;


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


    constructor(scene, init_board, init_turn, score1, score2) {
        this.scene = scene;

        this.colors = ['white', 'black'];
        this.init_board = init_board || INITIAL_BOARD;
        this.animationCounter = 0;
        this.board = new Board(scene, this);
        this.running = true;
        this.gameOver = false;
        this.computer_playing = false;
        this.currentColor = init_turn || this.colors[0];
        this.otherColor = (this.currentColor == this.colors[0] ? this.colors[1] : this.colors[0]) || this.colors[1];
        this.timeleft = 0;
        this.score1 = score1 || SCORE_1;
        this.score2 = score2 || SCORE_2;
        this.validReply = false;
        this.winner = null;

        var start = Date.now();
        var newG = new Game(scene, init_board, init_turn, score1, score2);
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
     * Initial Board
     */
    InitialBoard(tabuleiro, callback) {
        let requestString = 'initialBoard(' +
            JSON.stringify(tabuleiro).replace(/"/g, '') + ')';
        this.getPrologRequest(requestString, callback);
        /**gets 
         * -1 => not received
         * 0 + tabuleiroFinal
         *  */
        // return callback;
    }


    /**
     * Move
     */
    move(tabuleiro, pecaX, pecaY, destX, destY, callback) {
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


    validMoves(tabuleiro, line, column, color, callback) {
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

    checkDifferenceIndexes(pecaX, pecaY, destX, destY, callback) {
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

    jogadasValidas(tabuleiro, color, callback) {
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


    updateScore() {
        //garantir que a resposta do prolog é que score1 é de quem está a jogar ou switchCase do lado de cá
        if (this.score1) {
            //campoEstaCor = this.score1;
            //campoOutraCor = this.score2;
        } else {
            this.gameOver = true;
            this.winner = this.otherColor;
        }


    }


    displayBoard() {
        if (this.board == INITIAL_BOARD) {
            this.pieces = [];
            this.piecesCoords = [];
            for (var i = 0; i < 30; i++) {
                this.pieces.push(this.piece);
                var tmp = new Piece();
                tmp.id = i;
                tmp.colour = (i % 2 == 0 ? this.scene.materialWhites : this.scene.materialBlacks);
                tmp.x = offsetX - incX * parseInt(i / 5);
                tmp.y = offsetY;
                tmp.z = offsetZ - incZ * parseInt(i % 5);
                tmp.scale = 0.2;
                tmp.active = true;
                this.piecesCoords.push(tmp);

            }
        }
        //mostra this.board;

        //caso geral.temos que seguir o ID da peca quando há movimento e nos saves

        //por cada piece no board
        //se piece.active mostra no piece.x piece.y piece.z
        /*
         
        */
        this.updateScore();
    }



    gameLoop() {
        this.timeleft = TIME_LEFT;
        this.markSelectables(current);
        //wait for a click
        while (!validReply) {
            this.validMoves(this.board, line, column, this.currentColor, this.verifyPieceReply());
        }
        this.resetError();
        this.markSelectables(other);
        //wait for a click
        while (!validReply) {
            this.checkDifferenceIndexes(pecaX, pecaY, destX, destY, this.verifyAttackReply());
        }
        /*VERIFICACAO JOGADA DENTRO DO TEMPO - MUDAR PARA INTERRUPCAO QUANDO timeleft atinge 0*/
        if (this.timeleft) {
            this.timeleft = 0;
        } else {
            this.winner = this.otherColor;
            //msg=YouTookTooMuchTime
        }
        this.resetError();
        while (!validReply) {
            this.move(this.board, pecaX, pecaY, destX, destY, this.verifyMoveReply());
        }
        this.resetError();
        this.changeColors();
        this.displayBoard();
        while (!validReply) {
            this.jogadasValidas(this.board, this.verifyScoreReply());
        }
        this.resetError();
        this.updateScore();
    }



    start() {
        while (!validReply) {
            InitialBoard(this.board, this.verifyTabReply());
        }
        this.resetError();
        this.displayBoard();
        while (!this.gameOver) {
            this.gameLoop();
        }

    }



    verifyTabReply() {
        let response = JSON.parse(data.target.response);
        if (response[0]) {
            this.Board = response[1];
            return true;
        } else {
            this.showError(response[0]);
            return false;
        }
    }

    verifyPieceReply() {
        let response = JSON.parse(data.target.response);
        if (response[0]) {
            return true;
        } else {
            this.showError(response[0]);
            return false;
        }
    }

    verifyAttackReply() {
        let response = JSON.parse(data.target.response);
        if (response[0]) {
            return true;
        } else {
            this.showError(response[0]);
            return false;
        }
    }

    verifyMoveReply() {
        let response = JSON.parse(data.target.response);
        if (response[0]) {
            this.Board = response[1];
            return true;
        } else {
            this.showError(response[0]);
            return false;
        }
    }

    verifyScoreReply() {
        let response = JSON.parse(data.target.response);
        if (response[0]) {
            //garantir que a resposta do prolog é que score1 é de quem está a jogar ou switchCase do lado de cá
            this.score1 = response[1];
            this.score2 = response[2];
            return true;
        } else {
            this.showError(response[0]);
            return false;
        }
    }

    showError(func, code) {
        //translate code into msg (de acordo com func  ou code independente?)
        //document.getElementById('errorMessage').innerText = func + " : " + msg;  
    }

    resetError() {
        this.validReply = false;
        //document.getElementById('errorMessage').innerText = ""; 
    }

    changeColors() {
        let tmp = this.otherColor;
        this.otherColor = this.currentColor;
        this.currentColor = temp;
    }

    markSelectables(which) {
        //por cada piece
        //if(piece.color == which) marcar Selectable
        //if(não alcancavel) desmarcar Selectable //se assim optarmos
    }

    translateBoard() {
        //transforma this.board em linha-coluna
        //e linha-coluna em coords já com offset
    }
}