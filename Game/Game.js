var SERVER_PORT = 8081;
//position of the piece further away from the origin
var offsetX = 0.73;
var offsetY = 4.185;
var offsetZ = 0.605;


//distance from each board cell to its neighbours
var incX = 0.292;
var incZ = 0.3025;


/*initial board*/
var INITIAL_BOARD = [
    ['black', 'white', 'black', 'white', 'black'],
    ['white', 'black', 'white', 'black', 'white'],
    ['black', 'white', 'black', 'white', 'black'],
    ['white', 'black', 'white', 'black', 'white'],
    ['black', 'white', 'black', 'white', 'black'],
    ['white', 'black', 'white', 'black', 'white']
];
/*score points at the beginning of a regular game*/
var SCORE_1 = 99;
var SCORE_2 = 99;
/*time of each turn (seconds)*/
var TIME_LEFT = 30;
/*initial number of pieces on board*/
var NUMBER_PIECES = 30;

/*default game config*/
var DEFAULT_MODE = "Player vs Player";
var DEFAULT_LEVEL = "Easy";

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

STATES = {
    WAITING: 0,
    STARTED: 1,
    DISPLAYED: 2,
    READY_TO_PICK_PIECE: 3,
    SELECTABLES1: 4,
    PIECE_CHOSEN: 5,
    READY_TO_PICK_MOVE: 6,
    SELECTABLES2: 7,
    MOVE_CHOSEN: 8,
    MOVED: 9,
    UPDATED: 10, //getUpdatedScores
    GAMEOVER: 11,
}


/**
 * Game
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
class Game {


    constructor(scene, init_board, init_turn, score1, score2, gameMode, gameLevel) {
        this.scene = scene;

        this.pickedPiece = 0;
        this.colours = ['white', 'black'];
        this.init_board = init_board || INITIAL_BOARD;
        this.animationCounter = 0;
        this.board = [];
        this.answer = "";
        this.running = true;
        this.gameOver = false;
        this.computer_playing = false;
        this.currentColour = init_turn || this.colours[0];
        this.otherColour = (this.currentColour == this.colours[0] ? this.colours[1] : this.colours[0]) || this.colours[1];
        this.timeleft = 0;
        this.score1 = score1 || SCORE_1;
        this.score2 = score2 || SCORE_2;
        this.validReply = false;
        this.winner = null;
        this.gameMode = DEFAULT_MODE || gameMode;
        this.gameLevel = DEFAULT_LEVEL || gameLevel;
        this.piece2Move = null;
        this.state = STATES.WAITING;
        //this.pieces = Array.from({ length: this.init_board.length }, (v, k) => k + 1);
        this.pieces = []; //use coords from the piece(id) object

        var start = Date.now();


        /*
                for (let i = 0; i < this.colours.length; i++) {
                    let colour_node = this.scene.graph.nodes[this.colours[i]];
                    mat4.identity(colour_node.transformMatrix);
                    mat4.translate(colour_node.transformMatrix, colour_node.transformMatrix, colour_node.position);
                    mat4.rotate(colour_node.transformMatrix, colour_node.transformMatrix, -Math.PI / 2, [1, 0, 0]);
                }*/
        document.getElementById('turn').innerHTML = 'Player 1';

    }

    //*************************************************************************************************
    //                             PROLOG COMMUNICATION FUNCTIONS                                    //
    //***********************************************************************************************//
    getPrologRequest(requestString, onSuccess, onError, port) {
        let requestPort = 8081;
        let request = new XMLHttpRequest();
        request.open('GET', 'http://localhost:' + requestPort + '/' + requestString, false); //( reqType,address, asyncProc) 
        request.onload = onSuccess.bind(this) || function(data) { console.log("Request successful. Reply: " + data.target.response); };
        request.onerror = onError || this.prologRequestError;
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
     * Update Score
     */
    
    getScore(tabuleiro, callback) {
            let Score;
            let requestString = 'sendScore(' +
            JSON.stringify(tabuleiro).replace(/"/g, '') + ')';
            //+ ',' + JSON.stringify(Score) + ')';
            console.log("ini0123");
             this.makeRequest(requestString, callback);
            console.log("ini02");
            /**gets 
             * -1 => not received
             * 0 + tabuleiroFinal
            */
     }


    /**
     * Move
     * order of the elements PROLOG:
     * move(InitialBoard,RowIndex,ColumnIndex,PP_RowIndex,PP_ColumnIndex,Colour)
     */
    move(tabuleiro, pecaX, pecaY, destX, destY, color, callback) {
        let requestString = 'move(' +
            JSON.stringify(tabuleiro).replace(/"/g, '') + ',' +
            JSON.stringify(pecaX).replace(/"/g, '') + ',' +
            JSON.stringify(pecaY).replace(/"/g, '') + ',' +
            JSON.stringify(destX).replace(/"/g, '') + ',' +
            JSON.stringify(destY).replace(/"/g, '') + ',' +
            JSON.stringify(color).replace(/"/g, '') + ')';

        this.makeRequest(requestString, callback);
        /**gets 
         * -1 => not received   
         * 0 + tabuleiroFinal
         *  */
        // return callback;
    }


    validMoves(tabuleiro, line, column, colour, callback) {
        let requestString = 'validMoves(' +
            JSON.stringify(tabuleiro).replace(/"/g, '') + ',' +
            JSON.stringify(line).replace(/"/g, '')      + ',' +
            JSON.stringify(column).replace(/"/g, '')    + ',' +
            JSON.stringify(colour).replace(/"/g, '')    + ')';

        this.makeRequest(requestString, callback);
        /**gets 
         * -3 => piece is isolated
         * -2 => wrong colour chosen
         * -1 => not received
         * 0 => OK
         *  */
        //return callback
    }

    checkDifferenceIndexs(pecaX, pecaY, destX, destY, callback) {
        let requestString = 'checkDifferenceIndexs(' +
            JSON.stringify(pecaX).replace(/"/g, '') + ',' +
            JSON.stringify(pecaY).replace(/"/g, '') + ',' +
            JSON.stringify(destX).replace(/"/g, '') + ',' +
            JSON.stringify(destY).replace(/"/g, '') + ')';

        this.makeRequest(requestString, callback);
        /**gets 
         * -3 => empty space
         * -2 => to wrong colour
         * -1 => not received
         * 0 => OK
         *  */
        // return callback;
    }

    getScore(tabuleiro, callback) {
        let requestString = 'sendScore(' +
            JSON.stringify(tabuleiro).replace(/"/g, '') + ')';
        this.makeRequest(requestString, callback);
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
        var newG = new Game(scene, this.init_board, this.init_turn, this.score1, this.score2, this.pieces, this.piecesCoords, this.gameMode, this.gameLevel);
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
        console.log("u_00");
        if (this.score1) {
            console.log("u_01");
            document.getElementById('score1').innerHTML = this.score1;
            console.log("u_02");
            document.getElementById('score2').innerHTML = this.score2;
            console.log("u_03");
        } else {
            console.log("u_04");
            this.state = STATES.GAMEOVER;
            this.gameOver = true;
            console.log("u_05");
            this.winner = this.otherColour;
            console.log("u_06");
        }

        this.state = STATES.READY_TO_PICK_PIECE;

    }


    displayBoard() {

        this.translateBoard();
        if (this.states == STATES.DISPLAYED)
            this.updateScore();

    }

    translateBoard() {

        for (var i = 0; i < this.board.length; i++) {

            for (var j = 0; j < this.board[i].length; j++) {

                if (this.board[i][j] != "empty") {

                    var tmp = new Piece();

                    tmp.active = true;
                    tmp.colour = this.board[i][j];
                    tmp.id = j;
                    tmp.x = offsetX - incX * parseInt(i);
                    tmp.y = offsetY;
                    tmp.z = offsetZ - incZ * parseInt(j % 5);
                    tmp.line = parseInt(j / 5);
                    tmp.column = parseInt(j % 5);
                    this.pieces.push(tmp);

                }
            }
        }
        //   this.scene.displayBoard();
        this.state = STATES.DISPLAYED;

    }

    gameLoop() {

        this.timeleft = TIME_LEFT;
        // alert("antes " + this.state);
        if (this.state == STATES.READY_TO_PICK_PIECE) {
            console.log("gl_01");
            this.markSelectables(this.currentColour);
            console.log("gl_02");
            //  alert("apos " + this.state);
        }



        if (this.state == STATES.PIECE_CHOSEN) {
            console.log("L_00");
            this.piece2Move = this.pieces[this.pickedPiece - 1];
            this.validMoves(this.board, this.piece2Move.line, this.piece2Move.column, this.currentColour, this.verifyPieceReply);
            this.pickedPiece = 0;
            this.resetError();
            console.log("L_01");
        }




        if (this.state == STATES.READY_TO_PICK_MOVE)
            this.markSelectables(this.otherColour);

        if (this.state == STATES.MOVE_CHOSEN) {
            console.log("L_02");

            moveWhere2 = this.pieces[this.pickedPiece - 1];
            this.checkDifferenceIndexs(this.piece2Move.line, this.piece2Move.column, moveWhere2.line, moveWhere2.column, this.verifyAttackReply);
            console.log("L_03");
            this.pickedPiece = 0;

            //VERIFICACAO JOGADA DENTRO DO TEMPO - MUDAR PARA INTERRUPCAO QUANDO timeleft atinge 0
            if (this.timeleft) {
                this.timeleft = 0;
            } else {
                this.winner = this.otherColour;
                document.getElementById('messages').innerHTML = 'YouTookTooMuchTime';
                document.getElementById('info').innerHTML = this.winner;
            }
            console.log("L_04");
            this.resetError();

            // while (!this.validReply) {
            this.move(this.board, this.piece2Move.line, this.piece2Move.column, moveWhere2.line, moveWhere2.column, this.verifyMoveReply);
            //  }
            console.log("L_05");
            this.resetError();
        }
        if (this.state == STATES.MOVED) {
            this.changeColours();

            // while (!this.validReply) {
            this.getScore(this.board, this.verifyScoreReply);
            // }
            console.log("L_06");
            this.resetError();
        }
        //   if (this.state == STATES.UPDATED) {
        this.displayBoard();
        // }

    }



    start() {
        this.makeRequest("initialBoard", this.verifyTabReply);
        if (this.state == STATES.DISPLAYED) {
            this.state = STATES.READY_TO_PICK_PIECE;
            while (!this.gameover) {
                //this.state = STATES.GAMEOVER
                this.gameLoop();
            }
        }
        document.getElementById('info').innerHTML = this.winner;
        */
    }


    verifyTabReply(data) {

        this.answer = JSON.parse(data.target.response);
        // this.answer = data.target.response;
        let response = this.answer;
        console.log("t_1");
        console.log(response);
        if (response) {
            console.log("t_2");
            this.board = response;
            this.validReply = true;
            this.resetError();
        //    this.displayBoard();
            console.log("t_3");

        } else {
            console.log("t_4");
            this.showError(response);
            console.log("t_5");
            this.validReply = false;
        }

    }

    verifyPieceReply(data) {
        let response = JSON.parse(data.target.response);
        if (response[0]) {
            this.validReply = true;
            this.state = STATES.PIECE_CHOSEN;
        } else {
            this.showError(response[0]);
            this.validReply = false;
        }

    }

    verifyAttackReply(data) {
        let response = JSON.parse(data.target.response);
        if (response[0]) {
            this.validReply = true;
            this.state = STATES.MOVE_CHOSEN;
        } else {
            this.showError(response[0]);
            this.validReply = false;
        }
    }

    verifyMoveReply(data) {
        let response = JSON.parse(data.target.response);
        if (response[0]) {
            this.board = response[1];
            this.validReply = true;
            this.state = STATES.MOVED;
        } else {
            this.showError(response[0]);
            this.validReply = false;
        }
    }

    verifyScoreReply(data) {
 console.log("Teste subF 1");       

        let response = JSON.parse(data.target.response);
        console.log("Teste subF 1");
        if (response[0]) {
            //garantir que a resposta do prolog é que score1 é de quem está a jogar ou switchCase do lado de cá
            console.log("Teste subF 2");
            this.score1 = response[1];
            console.log("Teste subF 3");
            this.score2 = response[2];
            console.log("Teste subF 4");
            this.validReply = true;
            this.state = STATES.UPDATED;
        } else {
            this.showError(response[0]);
            this.validReply = false;
        }
    }

    showError(func, code) {
        var msg = "";
        switch (code) {
            case (1):
                msg = "wrong";
                break;
            default:
                break;

        }
        //translate code into msg (de acordo com func  ou code independente?)
        document.getElementById('messages').innerHTML = func + " : " + msg;
    }

    resetError() {
        this.validReply = false;
        document.getElementById('messages').innerHTML = "";
    }

    changeColours() {
        let tmp = this.otherColour;
        this.otherColour = this.currentColour;
        this.currentColour = temp;
    }

    markSelectables(which) {

        for (i = 0; i < this.pieces.length; i++) {

            if (this.pieces[i].colour == which) {

                this.pieces[i].selectable = true;
            } else {

                this.pieces[i].selectable = false; //se assim optarmos
            }
        }
        this.state == 3 ? this.state = 4 : this.state = 7;
    }

    //Make the request
    makeRequest(requestString, callback) {
        this.getPrologRequest(requestString, callback);
    }

    //Handle the Reply
    handleReply(data) {
        this.answer = data.target.response;
        this.validReply = true;
    }
}