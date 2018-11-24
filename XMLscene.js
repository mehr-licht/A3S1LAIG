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

        this.terrainShader = new CGFshader(this.gl,"shaders/texture3.vert","shaders/texture3.frag");
        this.waterShader = new CGFshader(this.gl,"shaders/uScale.vert","shaders/uScale.frag");

        this.terrainShader.setUniformsValues({
            uSampler2: 1
        });
        this.waterShader.setUniformsValues({
            uSampler2: 1
        });

    }

    update(currTime) {
        //this.initCameras();   
        if (this.startTime == 0 || this.startTime == null)
            this.startTime = currTime;

        this.elapsedTime = (currTime - this.startTime) / 1000;
        this.checkKeys();

        if (this.graph.shown == true) {
            for (var nodeID in this.graph.nodes) {
                if (this.graph.nodes[nodeID].animations != null) {
                    for (var each in this.graph.nodes[nodeID].animations) {
                        // var esta = this.graph.nodes[nodeID].animations[each];
                        // this.graph.animations[esta].update(this.elapsedTime); // .update(this.totalTime);
                        this.graph.nodes[nodeID].updateAnim(this.elapsedTime);
                    }
                }
            }
            this.lastTime = currTime;
        }

        var factor = (Math.sin((currTime * 3.0) % 3141 * 0.0002) + 1.0) * 0.5;
        this.waterShader.setUniformsValues({
            timeFactor: this.time
        });

    }

    setDefaultAppearance() {
        this.setAmbient(0.2, 0.4, 0.8, 1.0);
        this.setDiffuse(0.2, 0.4, 0.8, 1.0);
        this.setSpecular(0.2, 0.4, 0.8, 1.0);
        this.setShininess(10.0);
    }
    ;/**
     * Initializes the scene cameras.
     */
    initCameras() {
        this.camera = new CGFcamera(0.4,0.1,500,vec3.fromValues(15, 15, 15),vec3.fromValues(0, 0, 0));
    }

    updateScaleFactor(v) {// this.testShaders[1].setUniformsValues({ normScale: this.scaleFactor });
    //this.testShaders[2].setUniformsValues({ normScale: this.scaleFactor });
    //this.testShaders[5].setUniformsValues({ normScale: this.scaleFactor });

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

        // Adds lights group.
        this.interface.addLightsGroup(this.graph.lights);

        this.animations = [];
        this.setUpdatePeriod(100 / 6);

        this.sceneInited = true;
        //alert(this.graph.animations['rotunda'].initialAngle);
    }

    /**
     * Displays the scene.
     */
    display() {
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
            // Displays the scene (MySceneGraph function).
            this.graph.displayScene();

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
}
