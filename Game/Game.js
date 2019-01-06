var SERVER_PORT = 8081;
//position of the piece further away from the origin
var offsetX = 0.73;
var offsetY = 4.185;
var offsetZ = 0.605;

//each movie move is showed at every x ms
var MOVIE_RATIO = 1000;

//time (ms) between each animation increment recalculation
var ANIM_RATIO = 10;

//time (ms) that each move animation takes
var MOVE_TIME = 500;

//time (ms) that each dead piece move animation takes
var DEAD_TIME = 1000;
var DEAD_X = 0;
var DEAD_Z = 0;

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
var SCORE_1 = 49;
var SCORE_2 = 49;
/*time of each turn (seconds)*/
var TIME_LEFT = 30;
/*initial number of pieces on board*/
var NUMBER_PIECES = 30;


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

MODES = {
    HUMANS: 0,
    HUMAN_BOT: 1,
};

FACTOR = 10;

/*default game config*/
var DEFAULT_MODE = MODES.HUMANS;
var DEFAULT_LEVEL = LEVELS.HARD;

STATES = {
    WAITING: 0,
    STARTED: 1,
    DISPLAYED: 2,
    READY_TO_PICK_PIECE: 3,
    SELECTABLES1: 4,
    PIECE_CHOSEN: 5,
    ANIMATION: 6,
    READY_TO_PICK_MOVE: 7,
    SELECTABLES2: 8,
    MOVE_CHOSEN: 9,
    READY_TO_MOVE: 10,
    MOVED: 11,
    UPDATED: 12, //getUpdatedScores
    GAMEOVER: 13,
}


/**
 * Game
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
class Game {


    constructor(scene, init_board, init_turn, score1, score2, gameMode, gameLevel) {
        this.scene = scene;
        //  this.reset();


        this.tmpPiece = 0;
        this.pickedPiece = 0;
        this.colours = ['white', 'black'];
        this.init_board = init_board || INITIAL_BOARD;
        this.animationCounter = 0;
        this.board = [];
        this.gameStart = 0;
        this.gameStart2 = 0;
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
        this.gameMode = gameMode || DEFAULT_MODE;
        this.gameLevel = gameLevel || DEFAULT_LEVEL;
        this.piece2Move = null;
        this.moveWhere2 = null;
        this.state = STATES.WAITING;
        //this.pieces = Array.from({ length: this.init_board.length }, (v, k) => k + 1);
        this.pieces = []; //use coords from the piece(id) object
        //For undo and Film
        this.Undo = [];
        this.PastTabuleiros = [];
        this.PastScore1 = [];
        this.PastScore2 = [];

        this.saveArray = [this.board, this.currentColour];
        this.movie = false;
        this.movieIndex = 0;
        this.movieArray = [];
        this.displayMovie = false;
        this.lastMovie = 0;

        /*
                for (let i = 0; i < this.colours.length; i++) {
                    let colour_node = this.scene.graph.nodes[this.colours[i]];
                    mat4.identity(colour_node.transformMatrix);
                    mat4.translate(colour_node.transformMatrix, colour_node.transformMatrix, colour_node.position);
                    mat4.rotate(colour_node.transformMatrix, colour_node.transformMatrix, -Math.PI / 2, [1, 0, 0]);
                }*/


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
        let requestString = 'sendScore(' +
            JSON.stringify(tabuleiro).replace(/"/g, '') + ')';

        this.makeRequest(requestString, callback);

        /**gets 
         * -1 => not received
         * 0 => OK + number of valid Moves
         *  */
        // return callback;
    }


    blackBotMove(tabuleiro, callback) {
        let requestString = 'choose_move(' +
            JSON.stringify(tabuleiro).replace(/"/g, '') + ')';

        this.makeRequest(requestString, callback);
        /**gets 
         * -1 => not received   
         * 0 + tabuleiroFinal
         *  */
        // return callback;
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


    selectedPiece(tabuleiro, line, column, callback) {
        let requestString = 'selectedPiece(' +
            JSON.stringify(tabuleiro).replace(/"/g, '') + ',' +
            JSON.stringify(line).replace(/"/g, '') + ',' +
            JSON.stringify(column).replace(/"/g, '') + ')';
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






    //*************************************************************************************************
    //                             PROLOG COMMUNICATION FUNCTIONS                                    //
    //***********************************************************************************************//


    /*
     * clickando no botao, faz um setBoard(initialBoard)
     * recalcula score e turns 
     * display
     */
    undo() {
        if (this.Undo.length) {
            //Board
            var i = 1;
            //i++;

            let sizeBoards = this.PastTabuleiros.length - 1;

            this.board = this.PastTabuleiros[sizeBoards - i];
            //alert(this.board);
            //Indexes
            let sizeIndexes = this.Undo.length;
            this.Undo.pop();
            //Score1
            let scrIndex = this.PastScore1.length - 1;
            this.score1 = this.PastScore1[scrIndex - i];

            //Score2
            var scrIdx = this.PastScore2.length - 1;
            this.score2 = this.PastScore2[scrIdx - i];
            //Mudanca de estado
            this.state = STATES.READY_TO_PICK_PIECE;
            this.changeColours();
            this.displayBoard();
            console.log("last move undone");
        }
    }



    /*
     * clickando no botao, faz um setBoard(tabuleiroInicial)
     * recalcula score e turns 
     * display
     */
    restart() {
        this.reset();
        this.movie = false;
        this.displayMovie = false;
        this.movieArray = [];
        this.lastMovie = 0;
    }


    reset() {
        // this.scene = scene;
        this.tmpPiece = 0;
        this.pickedPiece = 0;
        this.colours = ['white', 'black'];
        this.init_board = INITIAL_BOARD;
        this.animationCounter = 0;
        this.board = [];
        this.gameStart = 0;
        this.gameStart2 = 0;
        this.running = true;
        this.gameOver = false;
        this.computer_playing = false;
        this.currentColour = this.colours[0];
        this.otherColour = (this.currentColour == this.colours[0] ? this.colours[1] : this.colours[0]) || this.colours[1];
        this.timeleft = 0;
        this.score1 = SCORE_1;
        this.score2 = SCORE_2;
        this.validReply = false;
        this.winner = null;
        this.gameMode = DEFAULT_MODE;
        this.gameLevel = DEFAULT_LEVEL;;
        this.piece2Move = null;
        this.moveWhere2 = null;
        this.state = STATES.WAITING;
        //this.pieces = Array.from({ length: this.init_board.length }, (v, k) => k + 1);
        this.pieces = []; //use coords from the piece(id) object
        //For undo and Film
        this.Undo = [];
        this.PastTabuleiros = [];
        this.PastScore1 = [];
        this.PastScore2 = [];

        this.saveArray = [this.board, this.currentColour];
        // this.movie = false;
        this.movieIndex = 0;
        //  this.movieArray = [];
        this.lastMovie = 0;
        this.displayMovie = false;
        this.start(this.gameMode, this.gameLevel);
    }



    /*
     * clickando no botao,
     * se nao houver jogo a decorrer e se tiver coisas nos arrays: 
     * setBoard
     * loop{
     * mov(guardado)
     * display}
     */
    playMovie() {
        console.log("begin playing movie");
        this.reset();
        this.movieArray.splice(-1, 1);
        this.movie = true;
        this.movieIndex = 0;
        this.states = STATES.READY_TO_PICK_PIECE;
    }

    SaveForMovie() {
        var d = new Date();
        var t = d.getTime();
        var tmp = [this.currentColour, this.otherColour, this.pieces, this.pickedPiece];
        this.movieArray.push(tmp);
        console.log("saved for movie, frame " + (this.movieArray.length));
    }

    //uncalled for
    /*
     * clickando no botao,
     * fica com this.save=tabuleiro,turn
     * this.save = new Game(scene,)
     * ->jogo
     */
    save2() {
        this.saveArray = [this.board, this.currentColour];
        console.log("game saved");
    }


    //uncalled for
    /*
     * clickando no botao,
     * setBoard(this.save)
     * ->jogo
     */
    load() {
        if (!!this.saveArray) {
            this.board = this.saveArray[0];
            this.currentColour = this.saveArray[1];
            this.currentColour == 'white' ? this.otherColour = 'black' : this.otherColour = 'white';
            this.displayBoard();
            console.log("game loaded");
        }
    }



    //*************************************************************************************************
    //                                          GAME UTILITIES                                       //
    //***********************************************************************************************/


    updateScore() {

        this.timeleft = TIME_LEFT;
        var d = new Date();
        var t = d.getTime();
        this.gameStart2 = t;
        this.state = STATES.READY_TO_PICK_PIECE;

        document.getElementById('score1').innerHTML = this.score1;
        document.getElementById('score2').innerHTML = this.score2;

        if (!this.score1) {

            this.state = STATES.GAMEOVER;
            this.gameOver = true;

            this.winner = this.otherColour;

        }
    }


    displayBoard() {

        this.translateBoard();
        // if (this.states == STATES.DISPLAYED)
        this.updateScore();
        //}
    }

    translateBoard() {

        this.pieces = [];
        for (var i = 0; i < this.board.length; i++) {

            for (var j = 0; j < this.board[i].length; j++) {

                if (this.board[i][j] != "empty") {
                    var tmp = new Piece(this.scene);
                    tmp.active = true;
                    tmp.colour = this.board[i][j];
                    tmp.id = i * this.board[j].length + j;
                    tmp.x = offsetX - incX * parseInt(i);
                    tmp.y = offsetY;
                    tmp.z = offsetZ - incZ * parseInt(j % 5);
                    tmp.line = parseInt(i);
                    tmp.column = parseInt(j % 5);
                    this.pieces.push(tmp);
                }
            }

        }
        //   this.scene.displayBoard();
        this.state = STATES.READY_TO_PICK_PIECE;

    }

    gameLoop() {

        if (this.movie && this.state != STATES.GAMEOVER) {
            console.log("beginning to show frame " + (this.movieIndex + 1));
            this.pieces = this.movieArray[this.movieIndex][2];
            this.currentColour = this.movieArray[this.movieIndex][0];
            this.otherColour = this.movieArray[this.movieIndex][1];

        }

        if (this.gameMode == MODES.HUMAN_BOT && this.currentColour == 'black' && !this.movie) {
            if (this.state == STATES.READY_TO_PICK_PIECE) {
                this.blackBotMove(this.board, this.verifyBotReply);
            }
        } else {
            if (this.state == STATES.READY_TO_PICK_PIECE) {
                this.PastTabuleiros.push(this.board);
                this.PastScore1.push(this.score1);
                this.PastScore2.push(this.score2);
                this.markSelectables(this.currentColour);
            }

            if (this.movie && this.displayMovie) {
                this.piece2Move = this.pieces[this.movieArray[this.movieIndex][3] - 1];

                this.markSelectables(this.otherColour);
            } else {
                if (this.state == STATES.PIECE_CHOSEN) {
                    this.scene.clearPickRegistration();
                    this.piece2Move = this.pieces[this.pickedPiece - 1];
                    this.selectedPiece(this.board, this.piece2Move.line, this.piece2Move.column, this.verifyPieceReply);
                }

                if (this.state == STATES.READY_TO_PICK_MOVE) {
                    this.tmpPiece = this.pickedPiece;
                    this.pickedPiece = 0;
                    this.resetError();
                    this.markSelectables(this.otherColour);
                }
            }
            if (this.movie && this.displayMovie) {
                this.moveWhere2 = this.pieces[this.movieArray[this.movieIndex][3] - 1];

                this.markSelectables(this.otherColour);
            } else {
                if (this.state == STATES.MOVE_CHOSEN) {
                    this.scene.clearPickRegistration();
                    this.moveWhere2 = this.pieces[this.pickedPiece - 1];
                    //  alert("line2: " + this.moveWhere2.line + "\ncol2: " + this.moveWhere2.column);
                    this.checkDifferenceIndexs(this.piece2Move.line, this.piece2Move.column, this.moveWhere2.line, this.moveWhere2.column, this.verifyAttackReply);;
                }
            }
        }

        if (this.state == STATES.ANIMATION) {
            this.animatePieces(this.piece2Move.id, this.moveWhere2.id);
        }
        if (this.state == STATES.READY_TO_MOVE) {
            this.move(this.board, this.piece2Move.line, this.piece2Move.column, this.moveWhere2.line, this.moveWhere2.column, this.currentColour, this.verifyMoveReply);

            let varIndexes = [this.piece2Move.line, this.piece2Move.column, this.moveWhere2.line, this.moveWhere2.column];
            this.Undo.push(varIndexes);
            //  this.displayBoard();
        }

        if (this.state == STATES.MOVED) {
            this.pickedPiece = 0;
            this.tmpPiece = 0;
            //Guarda todos os tabuleiros


            this.resetError();
            this.changeColours();
            this.getScore(this.board, this.verifyScoreReply);
        }

        if (this.state == STATES.UPDATED) {
            this.displayBoard();
            if (!this.movie) {
                this.SaveForMovie();
            }
        }

        if (this.movie && this.displayMovie) {
            console.log("showed movie frame " + (this.movieIndex + 1));
            this.displayMovie = false; //flag that is true from time to time 
            this.movieIndex++;
            if (this.movieIndex >= this.movieArray.length) {
                this.state = STATES.GAMEOVER;
                this.movie = false;
                console.log("movie finished");
            }

        }
    }



    start() {

        if (this.state == STATES.WAITING || this.state == STATES.GAMEOVER) {
            var d = new Date();
            var t = d.getTime();
            this.gameStart = t;
            this.gameStart2 = t;
            this.gameMode = this.scene.gameMode;
            this.gameLevel = this.scene.gameLevel;
            this.makeRequest("initialBoard", this.verifyTabReply);
            this.timeleft = TIME_LEFT;
            this.SaveForMovie();
            // if (this.state == STATES.DISPLAYED) {
            this.state = STATES.READY_TO_PICK_PIECE;
            //}
        }
    }

    verifyBotReply(data) {;
        let response = JSON.parse(data.target.response);

        if (data.target.status == 200) {

            this.piece2Move.line = response[0];
            this.piece2Move.column = response[1];
            this.moveWhere2.line = response[2];
            this.moveWhere2.column = response[3];
            this.validReply = true;
            this.resetError();
            this.displayBoard();
            this.state = STATES.READY_TO_MOVE;

        } else {

            this.showError(data.target.statusText);

            this.validReply = false;
        }
        console.log("Bot reply received with value: " + response);
    }



    verifyTabReply(data) {;
        let response = JSON.parse(data.target.response);

        if (data.target.status == 200) {

            this.board = response;
            this.validReply = true;
            this.resetError();
            this.displayBoard();
        } else {

            this.showError(data.target.statusText);

            this.validReply = false;
        }
        console.log("Initial Board reply received with value: " + response);
    }

    verifyPieceReply(data) {
        let response = JSON.parse(data.target.response);
        if (data.target.status == 200) {

            if (response == this.currentColour) {

                this.validReply = true;
                this.state = STATES.READY_TO_PICK_MOVE;
            } else {

                this.showError("wrong colour");
            }
        } else {

            this.showError(data.target.statusText);
            this.validReply = false;
        }
        console.log("Pick Piece reply received with value: " + response);
    }

    verifyAttackReply(data) {
        let response = JSON.parse(data.target.response);
        if (data.target.status == 200) {

            if (!isNaN(response)) {
                this.validReply = true;
                if (response == 0) {
                    this.state = STATES.READY_TO_MOVE;
                }
            }
        } else {

            this.showError(data.target.statusText);
            this.validReply = false;
        }
        console.log("Attack reply received with value: " + response);
    }

    verifyMoveReply(data) {
        let response = JSON.parse(data.target.response);
        if (data.target.status == 200) {

            this.board = response;
            this.validReply = true;
            this.state = STATES.MOVED;
        } else {

            this.showError(data.target.statusText);
            this.validReply = false;
        }
        console.log("Move reply received with value: " + response);
    }

    verifyScoreReply(data) {
        let response = JSON.parse(data.target.response);
        if (data.target.status == 200) {


            this.score1 = response[0];

            this.score2 = response[1];

            this.validReply = true;
            this.state = STATES.UPDATED;

        } else {

            this.showError(data.target.statusText);
            this.validReply = false;
        }
        console.log("Score reply received with value: " + response);
    }

    showError(msg) {

        document.getElementById('messages').innerHTML = msg;
    }

    resetError() {
        this.validReply = false;
        document.getElementById('messages').innerHTML = "";
    }

    changeColours() {
        let tmp = this.otherColour;
        this.otherColour = this.currentColour;
        this.currentColour = tmp;
    }

    markSelectables(which) {
        this.scene.setPickEnabled(true);

        for (i = 0; i < this.pieces.length; i++) {

            if (this.pieces[i].colour == which) {

                this.pieces[i].selectable = true;
            } else {

                this.pieces[i].selectable = false; //se assim optarmos
            }
        }
        this.state == STATES.READY_TO_PICK_PIECE ? this.state = STATES.SELECTABLES1 : this.state = STATES.SELECTABLES2;
    }

    //Make the request
    makeRequest(requestString, callback) {
        this.getPrologRequest(requestString, callback);
    }

    resetPickedPiece() {
        this.pickedPiece = 0;
        this.tmpPiece = 0;
        this.piece2Move = null;
        this.state = STATES.READY_TO_PICK_PIECE;
    }

    animatePieces(alivePiece, deadPiece) {
        var d = new Date();
        var t = d.getTime();
        this.pieceAnimationCalc(deadPiece, t);
        d = new Date();
        t = d.getTime();

        this.pieceAnimationCalc(alivePiece, t, "alive", deadPiece);

        if ((t - this.lastAnim) > ANIM_RATIO) { //ou atingir distancias
            this.state = STATES.READY_TO_MOVE;
        }
        this.lastAnim = t;
    }


    pieceAnimationCalc(id1, t1, typeIn, id2) {

        var t2 = t1;
        var type = typeIn || "dead";
        var x1 = this.pieces[id1].x;
        var z1 = this.pieces[id1].z;
        var x2 = x1;
        var z2 = z1;
        if (!!id2) {
            x2 = this.pieces[id2].x;
            z2 = this.pieces[id2].z;
        } else {
            x2 = DEAD_X;
            z2 = DEAD_Z;
        }
        var distTotal = Math.sqrt((x2 - x1) * (x2 - x1) + (z2 - z1) * (z2 - z1));
        var halfDist = distTotal / 2;
        //  while (t2 < (t1 + DEAD_TIME)) { // || (x==finalX  && y==finalY && z==finalZ)
        var distActual = Math.sqrt((this.pieces[id1].x - x1) * (this.pieces[id1].x - x1) + (this.pieces[id1].z - z1) * (this.pieces[id1].z - z1));
        var d = new Date();
        t2 = d.getTime();
        console.log("delta:" + delta);
        var delta = t2 - t1; //SERA DISTO!?
        var incX = ((x2 - x1) / DEAD_TIME) * delta;
        var incZ = ((z2 - z1) / DEAD_TIME) * delta;
        this.pieces[id1].x += incX;
        console.log("inc:" + this.pieces[id1].x);
        this.pieces[id1].z += incZ;
        if (type == "dead") {
            var away = Math.min(Math.abs(halfDist - distActual), Math.abs(distTotal - distActual));
            this.pieces[id1].y += 5 / (away * away);
        }
        console.log("t2:" + t2);
        console.log("T:" + (t1 + DEAD_TIME));
        if (t2 >= (t1 + DEAD_TIME)) {
            this.animEnd = true;
            this.lastAnim = 0;
        }
        //  }

    }
}