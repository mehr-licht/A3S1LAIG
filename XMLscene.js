//convert from degrees to rad
var DEGREE_TO_RAD = Math.PI / 180;

/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene {
    /**
     * @constructor
     * @param {MyInterface} myinterface 
     */
    constructor(myinterface) {
        super();

        this.appearance = null;

        this.wireframe = false;

        this.scaleFactor = 50.0;

        this.interface = myinterface;
        this.lightValues = {};
        this.scenesList = [];
        this.scenes = [];

        this.shaders = [];
        this.easyShader = "greenThrob";
        this.currentShader = "throbRed";

        this.CAMERA_ANIMATION_TIME = 1;

        this.lastTime = 0;
        this.currentDate = new Date();
        this.initialTime = this.currentDate.getTime();
        this.currScene = "FEUP";

        //CRIAR OBJECTO QUANDO escolhido o START GAME
        this.newGame = new Game(this);
        this.gameMode = MODES.HUMANS;
        this.gameLevel = LEVELS.HARD;
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.materialWhites = new CGFappearance(this);
        this.materialWhites.setAmbient(0.3, 0.2, 0.3, 1);
        this.materialWhites.setDiffuse(0.4, 0.3, 0.1, 1);
        this.materialWhites.setSpecular(0.5, 0.4, 0.6, 1);
        this.materialWhites.setShininess(120);

        this.materialBlacks = new CGFappearance(this);
        this.materialBlacks.setAmbient(0.1, 0.1, 0.1, 1);
        this.materialBlacks.setDiffuse(0.1, 0.1, 0.1, 1);
        this.materialBlacks.setSpecular(0.5, 0.5, 0.5, 1);
        this.materialBlacks.setShininess(120);

        this.materialHole = new CGFappearance(this);
        this.materialHole.setAmbient(0.0, 0.0, 0.0, 1);
        this.materialHole.setDiffuse(0.0, 0.0, 0.0, 1);
        this.materialHole.setSpecular(0.5, 0.5, 0.5, 1);
        this.materialHole.setShininess(120);

        this.hole = new MyCilinder(this, 0.5, 0.5, 2, 50, 50);

        this.materialDefault = new CGFappearance(this);

        this.shaders["throbRed"] = new CGFshader(this.gl, "shaders/shader.vert", "shaders/shader.frag");
        this.shaders["throbRed"].setUniformsValues({ selectedRed: 1.0, selectedGreen: 0.0, selectedBlue: 0.0 });

        this.shaders["greenThrob"] = new CGFshader(this.gl, "shaders/greenShader.vert", "shaders/greenShader.frag");
        this.shaders["greenThrob"].setUniformsValues({ selectedRed: 0.0, selectedGreen: 0.8, selectedBlue: 0.0 });

        this.animateCameraBool = false;
        this.cameras = [];
        this.gameCameraAnimation = null;
        this.currentScene = 1;
        this.currentCamera = 0;
        this.initCameras();

        this.sceneInited = false;
        this.keysPressed = false;

        this.piece = new CGFOBJModel(this, 'clobber.obj');

        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);

        this.setUpdatePeriod(100);


        this.setPickEnabled(true);
        this.shader = new CGFshader(this.gl, "shaders/MyShader.vert", "shaders/MyShader.frag");
    }

    update(currTime) {
        this.updateScaleFactor(currTime);
        //CAMERA ANIMATION
        /* if (this.animateCameraBool) {
             this.nextCamera();
             if (this.prevTime == -1) {
                 this.animateCamera(0);
             } else {
                 this.animateCamera(currTime - this.prevTime);
             }
         }*/

        if (this.startTime == 0 || this.startTime == null)
            this.startTime = currTime;

        this.elapsedTime = (currTime - this.startTime) / 1000;
        this.checkKeys();
        if (this.elapsedTime > 2) {
            if (this.graph.shown == true) {
                for (var nodeID in this.graph.nodes) {
                    if (this.graph.nodes[nodeID].animations != null) {
                        for (var each in this.graph.nodes[nodeID].animations) {
                            this.graph.nodes[nodeID].updateAnim(this.elapsedTime);
                        }
                    }
                }

                this.lastTime = currTime;
            }
        }
        this.time = (Math.cos(currTime / 200)) / 2 + 0.5;

        this.shader.setUniformsValues({ timeFactor: this.time });

        this.prevTime = currTime;
    }

    updateScaleFactor(date) {
        this.shaders[this.currentShader].setUniformsValues({ timeFactor: date % 100 });
    };

    setDefaultAppearance() {
        this.setAmbient(0.2, 0.4, 0.8, 1.0);
        this.setDiffuse(0.2, 0.4, 0.8, 1.0);
        this.setSpecular(0.2, 0.4, 0.8, 1.0);
        this.setShininess(10.0);
    }

    /**
     * Initializes the scene cameras.
     */
    initCameras() {
        //  this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
        this.cameras[0] = new CGFcamera(DEGREE_TO_RAD * 20, 0.1, 150, vec3.fromValues(12, 22, 2), vec3.fromValues(9, 3.5, 6));
        this.cameras[1] = new CGFcamera(DEGREE_TO_RAD * 20, 0.1, 150, vec3.fromValues(2.3, 22, 12), vec3.fromValues(5, 3.5, 8));

        this.camera = this.cameras[0];
    }



    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {
        var i = 0;
        // Lights index.

        // Reads the lights from the scene graph.
        for (var key in this.graph.lights) {
            if (i >= 8)
                break;
            // Only eight lights allowed by WebGL.

            if (this.graph.lights.hasOwnProperty(key)) {
                var light = this.graph.lights[key];

                //lights are predefined in cgfscene
                this.lights[i].setPosition(light[1][0], light[1][1], light[1][2], light[1][3]);
                this.lights[i].setAmbient(light[2][0], light[2][1], light[2][2], light[2][3]);
                this.lights[i].setDiffuse(light[3][0], light[3][1], light[3][2], light[3][3]);
                this.lights[i].setSpecular(light[4][0], light[4][1], light[4][2], light[4][3]);

                this.lights[i].setVisible(true);
                if (light[0])
                    this.lights[i].enable();
                else
                    this.lights[i].disable();

                this.lights[i].update();

                i++;
            }
        }
    }

    /* Handler called when the graph is finally loaded. 
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {
        //camera values
        for (var v in this.graph.views) {
            if (this.graph.views[v][0] == this.graph.defaultView) {
                this.camera = this.graph.views[v][1];
            }
        }
        if (this.currScene == "stranded") {
            this.texture1 = this.graph.textures[this.idtexture];
            this.texture2 = this.graph.textures[this.idwavemap];
        }
        this.camera.near = this.graph.near;
        this.camera.far = this.graph.far;

        this.interface.setActiveCamera(this.camera);

        this.axis = new CGFaxis(this, this.graph.axis_length);

        //ambient and background details according to parsed graph
        this.setGlobalAmbientLight(this.graph.ambientIllumination[0], this.graph.ambientIllumination[1], this.graph.ambientIllumination[2], this.graph.ambientIllumination[3]);

        this.gl.clearColor(this.graph.background[0], this.graph.background[1], this.graph.background[2], this.graph.background[3]);

        this.initLights();
        // Adds views dropdown.
        this.currView = this.graph.defaultView;
        this.changeCamera = this.currView;
        this.viewsList = [];
        for (var v in this.graph.views) {
            this.viewsList.push(this.graph.views[v][0])
        }

        var views = this.interface.gui.add(this, 'currView', this.viewsList).name('views');

        this.interface.addScenePicker();
        this.interface.addSettingsGroup(this.newGame);
        this.interface.addOptionsGroup();

        // Adds lights group.
        this.interface.addLightsGroup(this.graph.lights);

        this.animations = [];
        this.setUpdatePeriod(100 / 6);

        this.sceneInited = true;
    }

    /**
     * Displays the scene.
     */
    display() {

        this.handlePicking();

        this.clearPickRegistration();
        // ---- BEGIN Background, camera and axis setup

        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        //piece graveyard hole
        this.pushMatrix();

        this.translate(8.2, 3.8, 7.8);
        this.rotate(DEGREE_TO_RAD * 90, 1, 0, 0);
        this.scale(0.5, 0.5, 0.5);
        this.materialHole.apply();

        this.hole.display();
        this.popMatrix();


        this.pushMatrix();

        // Draw axis
        if (this.graph.loadedOk) {
            this.axis.display();
            this.setDefaultAppearance();
            var i = 0;
            for (var key in this.lightValues) {
                if (this.lightValues.hasOwnProperty(key)) {
                    if (this.lightValues[key]) {
                        this.lights[i].setVisible(true);
                        this.lights[i].enable();
                    } else {
                        this.lights[i].setVisible(false);
                        this.lights[i].disable();
                    }
                    this.lights[i].update();
                    i++;
                }
            }

            this.setCameraUsed();

            this.graph = this.scenes[this.currScene];

            this.graph.displayScene();

            var dd = new Date();
            var tt = dd.getTime();

            if (this.newGame.state != STATES.WAITING && this.newGame.state != STATES.GAMEOVER && this.newGame.timeleft <= 0) {

                //this.newGame.state = STATES.GAMEOVER;
                document.getElementById('messages').innerHTML = "time out: " + this.newGame.currentColour + " lost";
                this.newGame.winner = this.newGame.otherColour;
            } else if (this.newGame.state != STATES.GAMEOVER) {

                if (this.newGame.state == STATES.ANIMATION) {
                    this.newGame.animatePieces(this.newGame.piece2Move.id, this.newGame.moveWhere2.id);
                    /*  if () {
                          this.newGame.state = STATES.READY_TO_MOVE;
                      }*/
                }

                if (this.newGame.movie && (tt - this.newGame.lastMovie) > MOVIE_RATIO) {
                    if (this.newGame.lastMovie)
                        this.newGame.displayMovie = true;
                    this.newGame.lastMovie = tt;
                }
                if (this.newGame.state != STATES.WAITING) {

                    this.newGame.gameLoop();
                    document.getElementById('score1').innerHTML = this.newGame.score1;
                    document.getElementById('score2').innerHTML = this.newGame.score2;
                    document.getElementById('turn').innerHTML = this.newGame.currentColour;
                    var d = new Date();
                    var t = d.getTime();
                    this.newGame.timeleft = TIME_LEFT - ((t - this.newGame.gameStart2) / 1000);
                    var fixedNum = parseFloat(this.newGame.timeleft).toFixed(2);
                    document.getElementById('time').innerHTML = fixedNum;
                    fixedNum = parseFloat(((t - this.newGame.gameStart) / 1000)).toFixed(2);
                    document.getElementById('game_time').innerHTML = fixedNum;
                    document.getElementById('picked').innerHTML = this.newGame.pickedPiece;

                    if (!!this.newGame.piece2Move) {
                        document.getElementById('pieceline').innerHTML = 6 - (this.newGame.piece2Move.line);
                        document.getElementById('piececol').innerHTML = (String.fromCharCode(97 + this.newGame.piece2Move.column)).toUpperCase();
                    }

                    if (!!this.newGame.moveWhere2) {
                        document.getElementById('whereline').innerHTML = 6 - (this.newGame.moveWhere2.line);
                        document.getElementById('wherecol').innerHTML = (String.fromCharCode(97 + this.newGame.moveWhere2.column)).toUpperCase();
                    }

                    if (!this.newGame.score1) this.newGame.state = STATES.GAMEOVER;


                }
            } else {

                document.getElementById('info').innerHTML = this.newGame.winner + " WON";
            }


            if (this.newGame.state != 0) {

                this.displayBoard();
            } else {
                document.getElementById('messages').innerHTML = "";
                document.getElementById('info').innerHTML = "";
                document.getElementById('score1').innerHTML = "";
                document.getElementById('score2').innerHTML = "";
                document.getElementById('turn').innerHTML = "";
                document.getElementById('time').innerHTML = "";
                document.getElementById('game_time').innerHTML = "";
                document.getElementById('picked').innerHTML = "";
                document.getElementById('pieceline').innerHTML = "";
                document.getElementById('piececol').innerHTML = "";
                document.getElementById('whereline').innerHTML = "";
                document.getElementById('wherecol').innerHTML = "";
            }

        } else {
            // Draw axis
            this.axis.display();
        }

        this.popMatrix();

        //  
        // ---- END Background, camera and axis setup
        this.setActiveShader(this.defaultShader);
    }

    displayBoard() {

        for (i = 0; i < this.newGame.pieces.length; i++) {

            this.pushMatrix();
            this.translate(7, 0, 7);
            this.rotate(55 * DEGREE_TO_RAD, 0, 1, 0);
            //    this.scale(this.piecesCoords[i].scale, this.piecesCoords[i].scale, this.piecesCoords[i].scale);
            this.translate(this.newGame.pieces[i].x, this.newGame.pieces[i].y, this.newGame.pieces[i].z);

            // this.translate(-0.73, 4.185, 0.605);
            this.scale(0.10, 0.10, 0.10);
            if (this.newGame.pieces[i].selectable) {
                if (this.newGame.gameLevel == LEVELS.EASY) {
                    this.currentShader = this.easyShader;
                    this.setActiveShader(this.shaders[this.currentShader]);
                }

                this.registerForPick(i + 1, this.newGame.pieces[i]);
            }

            if (this.newGame.pieces[i].colour == "black") {
                this.materialBlacks.apply();
            } else if (this.newGame.pieces[i].colour == "white") {
                this.materialWhites.apply();
            }

            this.piece.display();
            this.setActiveShader(this.defaultShader)
            this.popMatrix();
        }

    }

    setCameraUsed() {
        if (this.currView != this.changeCamera) {
            for (var v in this.graph.views) {
                if (this.graph.views[v][0] == this.currView) {
                    this.camera = this.graph.views[v][1];
                }
            }
            this.changeCamera = this.currView;
            this.interface.setActiveCamera(this.camera);
        }
    }



    checkKeys() {
        if (this.gui.isKeyPressed("KeyM")) {
            for (var nn in this.graph.nodes) {
                this.graph.nodes[nn].defaultAsp = (this.graph.nodes[nn].defaultAsp + 1) % this.graph.nodes[nn].nMaterials;
                //alert("após "+this.graph.nodes[nn].defaultAsp);
                // this.graph.displayScene();
            }

        }
    }




    handlePicking() {
        if (this.pickMode == false) {
            if (this.pickResults != null && this.pickResults.length > 0) {
                for (var i = 0; i < this.pickResults.length; i++) {
                    var obj = this.pickResults[i][0];
                    if (obj != null)
                        if (obj) {
                            var customId = this.pickResults[i][1];
                            if (!this.newGame.gameOver)
                                console.log("Picked object: " + obj + ", with pick id " + customId);

                            this.newGame.pickedPiece = customId;

                            if (this.newGame.tmpPiece == this.newGame.pickedPiece) {
                                this.newGame.resetPickedPiece();
                            } else if (this.newGame.state == STATES.SELECTABLES1) {
                                this.newGame.state = STATES.PIECE_CHOSEN;
                            } else if (this.newGame.state == STATES.SELECTABLES2) {
                                this.newGame.state = STATES.MOVE_CHOSEN;
                            }
                        }
                }
                this.pickResults.splice(0, this.pickResults.length);
            }
        }
    }



    /* animateCamera(deltaTime) {
    if (!this.changingCamera)
        return;

            let boardCenter = vec3.fromValues(7, 3.5, 7);
          this.timeElapsed += deltaTime / 2000;
          let rotAngle = Math.PI * this.timeElapsed / this.CAMERA_ANIMATION_TIME;
          let nextCamera = this.cameras[this.currentCamera].rotate(boardCenter, rotAngle);
          console.log(nextCamera);
          this.camera = nextCamera;  }*/

    /* animateCamera(deltaTime) {
    if (!this.changingCamera)
        return;
            var animation = new CircularAnimation(this.scene, "cameraAnimation", this.CAMERA_ANIMATION_TIME, boardCenter, 5, 0, Math.PI);
            animation.update(this, dt); //este chama o "circular"/"linear"
            animation.apply(this); 
        }

    */

    animateCamera(deltaTime) {

        if (this.timeElapsed > this.CAMERA_ANIMATION_TIME) {
            this.changingCamera = false;
            this.currentCamera = (this.currentCamera + 1) % this.cameras.length;
            return;
        }

        let currCamera = this.cameras[this.currentCamera];
        let nextCamera = this.cameras[(this.currentCamera + 1) % this.cameras.length];

        //   let targetCenter = midPoint(currCamera.target, nextCamera.target);
        // let newX = ;
        // let newZ = ;
        // let newPoint = vec3.fromValues(newX, Y, newZ);
        let positionCenter = midPoint(currCamera.position, nextCamera.position);

        // let targetRadius = distance(targetCenter, nextCamera.target);
        let positionRadius = distance(currCamera.position, nextCamera.position);

        this.timeElapsed += deltaTime / 2000;
        let cameraAngle = Math.PI * this.timeElapsed / this.CAMERA_ANIMATION_TIME;
        let multiplier = this.currentCamera ? 1 : -1;

        let positionPosition = [
            positionCenter[0] + multiplier * positionRadius * Math.sin(cameraAngle),
            positionCenter[1],
            positionCenter[2] + multiplier * positionRadius * Math.cos(cameraAngle),
            1
        ];

        this.camera = new CGFcamera(DEGREE_TO_RAD * 20, 0.1, 150,
            positionPosition, vec3.fromValues(5, 3.5, 8));
    }


    //***********************************************************************************************
    //***                                     Game gui functions                                ***//
    //******************************************************************************************** */

    /**
     * starts a new game
     */
    startGame() {
        this.newGame.start(this.newGame.gameMode, this.newGame.gameLevel);
    }

    /**
     * restarts the current game
     */
    restart() {
        this.newGame.restart();
    }

    /**
     * undoes the last move
     */
    undo() {
        this.newGame.undo();
    }

    /**
     * saves the current state of the game to be loaded later
     */
    save() {
        this.newGame.save2();
    }

    /**
     * loads an earlier saved state of the game
     */
    load() {
        this.newGame.load();
    }

    /**
     * replays the movie of the game that has ended
     */
    movie() {
        // if (this.newGame.state == STATES.GAMEOVER)
        this.newGame.playMovie();
    }

    /**
     * exits the current game
     */
    quitGame() {
        this.newGame.state = STATES.WAITING;
    }



    /**
     * prepares for the camera animation
     */
    nextCamera() {
        this.changingCamera = true;
        this.timeElapsed = 0;
    }
}

/**
 * calcculates the middle point between two points
 * @param {*} point1 self-explanatory
 * @param {*} point2 self-explanatory
 */
function midPoint(point1, point2) {
    return [(point1[0] + point2[0]) / 1.5, (point1[1] + point2[1]) / 1.5, (point1[2] + point2[2]) / 1.5, (point1[3] + point2[3]) / 1.5];
}

/**
 * calculates the distance between two points
 * @param {*} point1 self-explanatory
 * @param {*} point2 self-explanatory
 */
function distance(point1, point2) {
    return Math.sqrt(Math.pow(point1[0] - point2[0], 2) + Math.pow(point1[1] - point2[1], 2) + Math.pow(point1[2] - point2[2], 2));
}