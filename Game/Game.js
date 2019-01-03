var SERVER_PORT = 8081;
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
var SCORE_1 = 49;
var SCORE_2 = 49;
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
     * Initial Board
     */
    /*
        InitialBoard(callback) {
            let requestString = 'initialBoard';
            console.log("ini01");
             this.makeRequest(requestString, callback);
            console.log("ini02");
            /**gets 
             * -1 => not received
             * 0 + tabuleiroFinal
             *  
            // return callback;
        }*/


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
            JSON.stringify(line).replace(/"/g, '') + ',' +
            JSON.stringify(column).replace(/"/g, '') + ',' +
            JSON.stringify(colour).replace(/"/g, '') + ')';

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

    jogadasValidas(tabuleiro, colour, callback) {
        let requestString = 'jogadasValidas(' +
            JSON.stringify(tabuleiro).replace(/"/g, '') + ',' +
            JSON.stringify(colour).replace(/"/g, '') + ')';
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
            this.gameOver = true;
            console.log("u_05");
            this.winner = this.otherColour;
            console.log("u_06");
        }


    }


    displayBoard() {
        /* COMO ESTAVA NO XMLscene */
        /* if (this.board == INITIAL_BOARD) {

             for (var i = 0; i < NUMBER_PIECES; i++) {
                 // this.pieces.push(this.piece);
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
         }*/
        console,
        console.log("d_00");
        //  this.unstringify();
        console.log("dANTES");
        this.translateBoard();
        console,
        console.log("d_01");
        this.updateScore();
        console,
        console.log("d_02");
    }


    /* unstringify() {
         alert("ENTROU");
         this.board = JSON.stringify(this.board).replace(/black/g, "black");
         alert("W00");
         this.board = JSON.stringify(this.board).replace(/white/g, "white");
         alert("W01");
         this.board = JSON.stringify(this.board).replace(/empty/g, "empty");
         alert(this.board);
     }*/

    translateBoard() {
        console.log("b_00");
        for (var i = 0; i < this.Board.length; i++) {
            console.log("b_01");
            for (var j = 0; j < this.Board[i].length; j++) {
                console.log("b_02");
                if (this.Board[i][j] != "empty") {
                    console.log("b_03");
                    var tmp = new Piece();
                    tmp.active = true;
                    console.log(this.Board[i][j]);
                    tmp.colour = this.Board[i][j];
                    tmp.id = j;
                    tmp.x = offsetX - incX * parseInt(j / 5);
                    // tmp.cell = j;
                    tmp.y = offsetZ - incZ * parseInt(j % 5);
                    tmp.line = parseInt(j / 5);
                    tmp.column = parseInt(j % 5);
                    this.pieces.push(tmp);
                    console.log("b_04");
                }
            }
        }
    }

    gameLoop() {
        alert("loop");
        this.timeleft = TIME_LEFT;
        this.markSelectables(this.currentColour);

        //while (!this.validReply) {
        if (this.pickedPiece) {
            piece2Move = this.pieces[this.pickedPiece - 1];
            this.validMoves(this.board, piece2Move.line, piece2Move.column, this.currentColour, this.verifyPieceReply.bind(this));
        }
        //}
        this.pickedPiece = 0;
        this.resetError();
        this.markSelectables(this.otherColour);

        //  while (!this.validReply) {
        if (this.pickedPiece) {
            moveWhere2 = this.pieces[this.pickedPiece - 1];
            this.checkDifferenceIndexs(piece2Move.line, piece2Move.column, moveWhere2.line, moveWhere2.column, this.verifyAttackReply.bind(this));
        }
        // }
        this.pickedPiece = 0;
        /*VERIFICACAO JOGADA DENTRO DO TEMPO - MUDAR PARA INTERRUPCAO QUANDO timeleft atinge 0*/
        if (this.timeleft) {
            this.timeleft = 0;
        } else {
            this.winner = this.otherColour;
            document.getElementById('messages').innerHTML = 'YouTookTooMuchTime';
            document.getElementById('info').innerHTML = this.winner;
        }
        this.resetError();

        // while (!this.validReply) {
        this.move(this.board, piece2Move.line, piece2Move.column, moveWhere2.line, moveWhere2.column, this.verifyMoveReply.bind(this));
        //  }
        this.resetError();
        this.changeColours();
        this.displayBoard();
        // while (!this.validReply) {
        this.jogadasValidas(this.board, this.verifyScoreReply.bind(this));
        // }
        this.resetError();
        this.updateScore();
    }



    start() {
        this.makeRequest("initialBoard", this.verifyTabReply);

        while (!this.gameOver) {
            this.gameLoop();
        }
        document.getElementById('info').innerHTML = this.winner;
    }


    verifyTabReply(data) {
        this.answer = JSON.parse(data.target.response);
        // this.answer = data.target.response;
        let response = this.answer;
        console.log("t_1");
        console.log(response);
        if (response) {
            console.log("t_2");
            this.Board = response;
            this.validReply = true;
            this.resetError();
            this.displayBoard();
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
        } else {
            this.showError(response[0]);
            this.validReply = false;
        }
    }

    verifyAttackReply(data) {
        let response = JSON.parse(data.target.response);
        if (response[0]) {
            this.validReply = true;
        } else {
            this.showError(response[0]);
            this.validReply = false;
        }
    }

    verifyMoveReply(data) {
        let response = JSON.parse(data.target.response);
        if (response[0]) {
            this.Board = response[1];
            this.validReply = true;
        } else {
            this.showError(response[0]);
            this.validReply = false;
        }
    }

    verifyScoreReply(data) {
        let response = JSON.parse(data.target.response);
        if (response[0]) {
            //garantir que a resposta do prolog é que score1 é de quem está a jogar ou switchCase do lado de cá
            this.score1 = response[1];
            this.score2 = response[2];
            this.validReply = true;
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
        //por cada piece
        //if(piece.colour == which) marcar Selectable }else{nao selectable}
        //if(não alcancavel) desmarcar Selectable //se assim optarmos
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