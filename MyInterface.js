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
    };
    processKeyUp(event) {
        this.activeKeys[event.code] = false;
    };
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

    addScenePicker() {
        this.gui.add(this.scene, "currScene", ["FEUP", "naufragio"]).name("Scene");
    };

    addSettingsGroup(game) {
        var group = this.gui.addFolder("Settings");
        group.open();

        group.add(this.scene, "gameMode", ["Player vs Player", "Player vs Bot", "Bot vs Bot"]).name("Game Mode");
        group.add(this.scene, "gameLevel", ["Easy", "Hard"]).name("Game Level");
        //var controller = group.add(this.scene, "rotationCamera").name("Camera Rotation");

        /*  controller.onChange(function() {
              game.setCamera();
          });*/
    };

    addOptionsGroup() {
        var group = this.gui.addFolder("Options");
        group.open();

        group.add(this.scene, "startGame").name("Start Game");
        group.add(this.scene, "undo").name("Undo");
        group.add(this.scene, "quitGame").name("Quit Game");
        group.add(this.scene, "movie").name("Movie");
    };


}