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
        this.newGraph = this.graph;
        this.appearance = null;

        this.wireframe = false;

        this.scaleFactor = 50.0;

        this.interface = myinterface;
        this.lightValues = {};
        this.scenesList = [];
        this.lastTime = 0;
        let currentDate = new Date();
        this.initialTime = currentDate.getTime();
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.sceneInited = false;
        this.keysPressed = false;
        this.initCameras();

        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);

        this.setUpdatePeriod(100);
        //msecs

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
        this.camera = new CGFcamera(0.4,0.1,500,vec3.fromValues(15, 15, 15),vec3.fromValues(0, 0, 0));
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

        this.axis = new CGFaxis(this,this.graph.axis_length);

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

        this.currScene = "feup";
        this.changeScene = this.currScene;
        this.scenesList = ["feup", "naufragio"];
        var scenes = this.interface.gui.add(this, 'currScene', this.scenesList).name('Scenes');

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
            this.setScene('feup');
            // Displays the scene (MySceneGraph function).
            this.graph.displayScene();

            // gegistar para picking
            // por cada elemento que queiramos pickar (pecas)
            //depois sempre que uma for comida deixa de ser pickable => clearPickRegistration(id)

            /*       for (i = 0; i < this.graph.pecas.length; i++) {
                //this.pushMatrix();
                //this.translate(i * 2, 0, 0);
                this.registerForPick(i + 1, this.graph.pecas[i]);
                //this.objects[i].display();
                //this.popMatrix();
            }*/

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

    setScene(scene) {
        if (this.currScene != this.changeScene) {
            for (var v in this.scenesList) {
                if (this.scenesList[v] == this.currScene) {
                    this.scene = this.scenesList[v];
                }
            }
            this.changeScene = this.currScene;

            if (scene == 'feup') {
                let filename = getUrlVars()['file'] || "FEUP.xml";
                this.cameras = [];
                this.graph = new MySceneGraph(filename,this);
            } else {
                let filename = getUrlVars()['file'] || "stranded.xml";
                this.cameras = [];
                this.graph = new MySceneGraph(filename,this);
            }

            //this.newGraph = new MySceneGraph(filename, this);
            //this.graph.reader.open('scenes/' + filename, this);
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
}
