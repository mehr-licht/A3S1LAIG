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

        //   var FEUP = new MySceneGraph("FEUP.xml", this);
        // var stranded = new MySceneGraph("stranded.xml", this);
        // this.scenes['FEUP'] = new MySceneGraph("FEUP.xml", this);
        //this.scenes['stranded'] = new MySceneGraph("stranded.xml", this);
        //  this.scenes.push(FEUP);
        //      this.scenes.push(stranded);

        this.shaderObjects = [];
        this.lastTime = 0;
        let currentDate = new Date();
        this.initialTime = currentDate.getTime();
        this.currScene = "FEUP";

        //CRIAR OBJECTO QUANDO escolhido o START GAME, por ora feito aqui
        this.newGame = new Game()
        this.gameMode = "Player vs Player";
        this.gameLevel = "Easy";
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

        this.materialDefault = new CGFappearance(this);

        this.sceneInited = false;
        this.keysPressed = false;
        this.initCameras();
        this.piece = new CGFOBJModel(this, 'clobber.obj');

        /*   this.pieces = [];
           this.piecesCoords = [];
           for (var i = 0; i < 30; i++) {
               this.pieces.push(this.piece);
               var tmp = new Piece();
               tmp.id = i;
               tmp.colour = (i % 2 == 0 ? this.materialWhites : this.materialBlacks);
               tmp.x = offsetX - incX * parseInt(i / 5);
               tmp.y = offsetY;
               tmp.z = offsetZ - incZ * parseInt(i % 5);
               tmp.scale = 0.2;
               tmp.active = true;
               this.piecesCoords.push(tmp);

           }
          */
        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);

        this.setUpdatePeriod(100);
        //msecs
        //this.scenes.push(new MySceneGraph('stranded.xml', this));
        //this.scenes.push(new MySceneGraph('FEUP.xml', this));



        this.setPickEnabled(true);
        this.shader = new CGFshader(this.gl, "shaders/MyShader.vert", "shaders/MyShader.frag");
    }

    update(currTime) {
        // this.updateScaleFactor(currTime);
        /*
                if (this.prevTime == -1) {
                    //this.animateCamera(0);
                    this.graph.update(0);
                } else {
                    //this.animateCamera(currTime - this.prevTime);
                    this.graph.update(currTime - this.prevTime);
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

        /*  if (typeof this.newGame != "undefined" && !this.newGame.gameOver)
              this.updateTime(currTime);*/

        this.prevTime = currTime;
    }

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
        this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
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

        // this.logPicking();
        this.handlePicking(); //Só 1 destes 2

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

        //  

        /*
                this.pushMatrix();

                // this.materialBlacks.apply();
                this.materialDefault.apply();
                this.testPiece.display();

                this.popMatrix();*/


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
            // console.log(this.currScene); //TIRAR ISTO - isto FAZ COm que funcione (mesmo assim repete guis - meter flag?)
            // this.graph = this.scenes[this.currScene];


            this.graph.displayScene();
            //console.log(this.currScene);


            // registar para picking
            // por cada elemento que queiramos pickar (pecas)
            //depois sempre que uma for comida deixa de ser pickable => clearPickRegistration(id)

            // draw objects

            for (i = 0; i < this.newGame.pieces.length; i++) {
                this.pushMatrix();
                this.translate(7, 0, 7);
                this.rotate(55 * DEGREE_TO_RAD, 0, 1, 0);
                //    this.scale(this.piecesCoords[i].scale, this.piecesCoords[i].scale, this.piecesCoords[i].scale);
                this.translate(this.newGame.pieces[i].x, this.newGame.pieces[i].y, this.newGame.pieces[i].z);

                // this.translate(-0.73, 4.185, 0.605);
                this.scale(0.10, 0.10, 0.10);
                this.registerForPick(i + 1, this.newGame.pieces[i]);

                if (this.newGame.pieces[i].colour == "black") {

                    this.materialBlacks.apply();
                } else if (this.newGame.pieces[i].colour == "white") {

                    this.materialWhites.apply();
                }

                this.piece.display();
                this.popMatrix();
            }


        } else {
            // Draw axis
            this.axis.display();
        }

        this.popMatrix();

        //  
        // ---- END Background, camera and axis setup

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

    //apagar - serve de teste para saber se estamos a seleccionar os objectos
    logPicking() {
        if (this.pickMode == false) {
            if (this.pickResults != null && this.pickResults.length > 0) {
                for (var i = 0; i < this.pickResults.length; i++) {
                    var obj = this.pickResults[i][0];
                    if (obj) {
                        var customId = this.pickResults[i][1];
                        this.newGame.pickedPiece = customId;
                        console.log("Picked object: " + obj + ", with pick id " + customId);
                    }
                }
                this.pickResults.splice(0, this.pickResults.length);
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
                            // if (this.newGame.running) {
                            // obj.pickedShader = 1;
                            this.newGame.pickedPiece = customId;
                            //  this.newGame.picked(obj);
                            this.newGame.state == 1 ? this.newGame.state = 2 : this.newGame.state = 4;
                            // }
                        }
                }
                this.pickResults.splice(0, this.pickResults.length);
            }
        }
    }

    animateCamera(deltaTime) {
        if (!this.changingCamera)
            return;

        // *0.95 is to avoid flickering when the animation surpasses the expected camera position
        if (this.timeElapsed > this.CAMERA_ANIMATION_TIME * 0.7) {
            this.changingCamera = false;
            this.currentCamera = (this.currentCamera + 1) % this.cameras.length;
            return;
        }

        let currCamera = this.cameras[this.currentCamera];
        let nextCamera = this.cameras[(this.currentCamera + 1) % this.cameras.length];

        let targetCenter = midPoint(currCamera.target, nextCamera.target);
        let positionCenter = midPoint(currCamera.position, nextCamera.position);

        let targetRadius = distance(targetCenter, nextCamera.target);
        let positionRadius = distance(positionCenter, nextCamera.position);

        this.timeElapsed += deltaTime / 2000;
        let cameraAngle = Math.PI * this.timeElapsed / this.CAMERA_ANIMATION_TIME;
        let multiplier = this.currentCamera ? 1 : -1;

        let targetPosition = [
            targetCenter[0] + multiplier * targetRadius * Math.sin(cameraAngle),
            targetCenter[1],
            targetCenter[2] + multiplier * targetRadius * Math.cos(cameraAngle),
            1
        ];

        let positionPosition = [
            positionCenter[0] + multiplier * positionRadius * Math.sin(cameraAngle),
            positionCenter[1],
            positionCenter[2] + multiplier * positionRadius * Math.cos(cameraAngle),
            1
        ];

        this.camera = new CGFcamera(currCamera.fov, currCamera.near, currCamera.far,
            positionPosition, targetPosition);
    };

    startGame() {
        this.newGame.start(this.newGame.gameMode, this.newGame.gameLevel);
    }

    quitGame() {
        this.newGame.quit();
    }

    undo() {
        this.newGame.undo();
    }

    movie() {
        this.newGame.movie();
    }

}