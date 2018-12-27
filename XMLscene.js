var DEGREE_TO_RAD = Math.PI / 180;
var offsetX = 0.73;
var offsetY = 4.185;
var offsetZ = 0.605;
var incX = 0.292;
var incZ = 0.3025;

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
        this.gameEnvironments = [];

        this.lastTime = 0;
        let currentDate = new Date();
        this.initialTime = currentDate.getTime();
        this.currScene = "FEUP";
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

        this.pieces = [];
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
        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);

        this.setUpdatePeriod(100);
        //msecs

        this.scenes.push(new MySceneGraph('FEUP.xml', this));
        this.scenes.push(new MySceneGraph('stranded.xml', this));


        this.setPickEnabled(true);

    }

    update(currTime) {
        // this.updateScaleFactor(currTime);

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
        this.texture1 = this.graph.textures[this.idtexture];
        this.texture2 = this.graph.textures[this.idwavemap];

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
        this.interface.addSettingsGroup(this.game);
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

        this.logPicking();
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


        if (this.sceneInited) {
            // Draw axis

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

            this.scenes[this.currScene].displayScene();
            console.log(this.currScene); //TIRAR ISTO - FAZ COm que funcione e repete guis


            // registar para picking
            // por cada elemento que queiramos pickar (pecas)
            //depois sempre que uma for comida deixa de ser pickable => clearPickRegistration(id)

            // draw objects
            for (i = 0; i < this.pieces.length; i++) {
                this.pushMatrix();
                this.translate(7, 0, 7);
                this.rotate(55 * DEGREE_TO_RAD, 0, 1, 0);
                //    this.scale(this.piecesCoords[i].scale, this.piecesCoords[i].scale, this.piecesCoords[i].scale);
                this.translate(this.piecesCoords[i].x, this.piecesCoords[i].y, this.piecesCoords[i].z);
                // this.translate(-0.73, 4.185, 0.605);
                this.scale(0.10, 0.10, 0.10);
                this.registerForPick(i + 1, this.pieces[i]);

                this.piecesCoords[i].colour.apply();

                this.pieces[i].display();
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
                        console.log("Picked object: " + obj + ", with pick id " + customId);
                    }
                }
                this.pickResults.splice(0, this.pickResults.length);
            }
        }
    }


    startGame() {
        this.game.start(this.gameMode, this.gameLevel);
    }

    quitGame() {
        this.game.quit();
    }

    undo() {
        this.game.undo();
    }

    movie() {
        this.game.movie();
    }

}