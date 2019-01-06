/**
 * MyInterface class, creating a GUI interface.
 */
class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
        var dat = this;
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {

        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI();

        // add a group of controls (and open/expand by defult)

        var update = function() {
            requestAnimationFrame(update);

        }

        update();

        this.initKeys();

        return true;
    }

    initKeys() {
        this.scene.gui = this;
        this.processKeyboard = function() {};
        this.activeKeys = {};
    }
    processKeyDown(event) {
        this.activeKeys[event.code] = true;
    }
    processKeyUp(event) {
        this.activeKeys[event.code] = false;
    }
    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
    }



    /**
     * Adds a folder containing the IDs of the lights passed as parameter.
     * @param {array} lights
     */
    addLightsGroup(lights) {

        var group = this.gui.addFolder("Lights");
        group.open();

        for (var key in lights) {
            if (lights.hasOwnProperty(key)) {
                this.scene.lightValues[key] = lights[key][0];
                group.add(this.scene.lightValues, key);
            }
        }
    }

    /**
     * dropdown to choose the scene
     */
    addScenePicker() {
        this.gui.add(this.scene, "currScene", ["FEUP", "stranded"]).name("Scene");
    }

    /**
     * group of all the game settings
     */
    addSettingsGroup(game) {
        var group = this.gui.addFolder("Settings");
        group.open();
        var ModeOptions = {
            "Humans": 0,
            "BlackBot": 1
        }
        var LevelOptions = {
            "Easy": 0,
            "Regular": 1
        }
        group.add(this.scene, "gameMode", ModeOptions).name("Game Mode");
        group.add(this.scene, "gameLevel", LevelOptions).name("Game Level");
    }

    /**
     * group of all the options about the game
     */
    addOptionsGroup() {
        var group = this.gui.addFolder("Options");
        group.open();
        group.add(this.scene, "startGame").name("Start Game");
        group.add(this.scene, "restart").name("Restart Game");
        group.add(this.scene, "undo").name("Undo");
        group.add(this.scene, "save").name("Save Game");
        group.add(this.scene, "load").name("Load Game");
        group.add(this.scene, "movie").name("Movie");
        group.add(this.scene, "quitGame").name("Quit Game");
    }


}