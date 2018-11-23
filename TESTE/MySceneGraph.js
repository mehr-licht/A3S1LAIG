var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var AMBIENT_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var TRANSFORMATIONS_INDEX = 6;
var PRIMITIVES_INDEX = 7;
var COMPONENTS_INDEX = 8;

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
    /**
     * @constructor
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;

        this.nodes = [];

        this.idRoot = null;
        // The id of the root element.

        this.axisCoords = [];

        // File reading 
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */
        this.reader.open('scenes/' + filename, this);
    }

    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "yas")
            return "root tag <yas> missing";

        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        var error;

        // Processes each node, verifying errors.

        // scene
        var index;
        if ((index = nodeNames.indexOf("scene")) == -1)
            return "tag <scene> missing";
        else {
            if (index != SCENE_INDEX)
                this.onXMLMinorError("tag <scene> out of order");

            //Parse scene block 

            if ((error = this.parseScene(nodes[index])) != null)
                return error;
        }

        // <views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order");

            //Parse views block 
            if ((error = this.parseViews(nodes[index])) != null)
                return error;
        }

        // <ambient>
        if ((index = nodeNames.indexOf("ambient")) == -1)
            return "tag <ambient> missing";
        else {
            if (index != AMBIENT_INDEX)
                this.onXMLMinorError("tag <ambient> out of order");

            //Parse ambient block 
            if ((error = this.parseAmbient(nodes[index])) != null)
                return error;
        }

        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order");

            //Parse lights block 
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }

        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order");

            //Parse TEXTURES block 
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");

            //Parse MATERIALS block 
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        // <transformations>
        if ((index = nodeNames.indexOf("transformations")) == -1)
            return "tag <transformations> missing";
        else {
            if (index != TRANSFORMATIONS_INDEX)
                this.onXMLMinorError("tag <transformations> out of order");

            //Parse TRANSFORMATIONS block 
            if ((error = this.parseTransformations(nodes[index])) != null)
                return error;
        }

        // <primitives>
        if ((index = nodeNames.indexOf("primitives")) == -1)
            return "tag <primitives> missing";
        else {
            if (index != PRIMITIVES_INDEX)
                this.onXMLMinorError("tag <primitives> out of order");

            //Parse PRIMITIVES block 
            if ((error = this.parsePrimitives(nodes[index])) != null)
                return error;
        }

        // <components> //usar o nodes do exemplo
        if ((index = nodeNames.indexOf("components")) == -1)
            return "tag <components> missing";
        else {
            if (index != COMPONENTS_INDEX)
                this.onXMLMinorError("tag <components> out of order");

            //Parse COMPONENTS block 
            if ((error = this.parseComponents(nodes[index])) != null)
                return error;
        }
    }

    /**
     * Parses the <scene> block.
     */
    parseScene(sceneNode) {

        this.idRoot = this.reader.getString(sceneNode, 'root');
        this.axis_length = Number(this.reader.getString(sceneNode, 'axis_length'));

        this.axisCoords['x'] = [this.axis_length, 0, 0];
        this.axisCoords['y'] = [0, this.axis_length, 0];
        this.axisCoords['z'] = [0, 0, this.axis_length];
    }

    /**
     * Parses the <views> block.
     */
    parseViews(viewsNode) {
        var defaultView = viewsNode.getAttribute("default");

        var children = viewsNode.children;
        this.views = [];
        this.views = [];
        this.views = [];
        this.defaultView = "";
        var views = [];
        this.defaultTexture = "defaultTexture";
        this.defaultMaterial = "defaultMaterial";

        for (var i = 0; i < viewsNode.children.length; i++) {
            views.push(viewsNode.children[i].nodeName);
        }

        for (var i = 0; i < children.length; i++) {

            var indexPerspective = views.indexOf("perspective");
            var perspectiveId = children[i].getAttribute("id");


            if (this.views[perspectiveId] != null)
                return "ID must be unique for each perspective (conflict: ID = " + perspectiveId + ")";

            var newCamera = [0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0)];




            //ORTHO
            var indexOrtho = views.indexOf("ortho");

            // (default values)
            this.near = 0.1;
            this.far = 500;
            this.axis_length = 1;

            if (indexOrtho == -1) {
                this.onXMLMinorError("Perspective missing; assuming 'near = 0.1' and 'far = 500'");
                var orthoNear = 0.1;
                var orthoFar = 500;
                var orthoLeft = 10;
                var orthoRight = 10;
                var orthoTop = 10;
                var orthoBottom = 10;

                newCamera = [perspectiveId, new CGFcameraOrtho(orthoLeft, orthoRight, orthoBottom, orthoTop, orthoNear, orthoFar, vec4.fromValues(0, 10, 10, 1), vec4.fromValues(0, 0, 0, 1), vec3.fromValues(0, 1, 0))];
                this.views.push(newCamera);


                if (perspectiveId = defaultView) {
                    this.defaultView = perspectiveId;
                }

            }

            if (indexPerspective == -1) {
                this.onXMLMinorError("Perspective missing; assuming 'near = 0.1', 'far = 500' and 'angle = 90'\nfrom: x=10 y=5 z=12  and  to: x=0 y=1 z=0");
                var perspectiveNear = 0.1;
                var perspectiveFar = 500;
                var perspectiveAngle = 90;
                var fromxxValue = 10;
                var fromyyValue = 5;
                var fromzzValue = 12;
                var toxxValue = 0;
                var toyyValue = 1;
                var tozzValue = 0;

                if (perspectiveAngle < 0 || perspectiveAngle == null || isNaN(perspectiveAngle)) {
                    this.onXMLMinorError("Missing angle value in the perspective");
                }
                newCamera = [perspectiveId, new CGFcamera(perspectiveAngle, perspectiveNear, perspectiveFar, vec3.fromValues(fromxxValue, fromyyValue, fromzzValue), vec3.fromValues(toxxValue, toyyValue, tozzValue))];

                this.views.push(newCamera);

                if (perspectiveId = defaultView) {
                    this.defaultView = perspectiveId;
                }

            } else if (perspectiveId == null) {
                this.onXMLMinorError("No Perspective ID defined");
            }


            if (children[i].nodeName == 'ortho') {
                var fromNodes = children[i].children;
                var orthoNear = Number(children[i].getAttribute("near"));
                var orthoFar = Number(children[i].getAttribute("far"));
                var orthoLeft = Number(children[i].getAttribute("left"));
                var orthoRight = Number(children[i].getAttribute("right"));
                var orthoTop = Number(children[i].getAttribute("top"));
                var orthoBottom = Number(children[i].getAttribute("bottom"));
                var fromxxValue = this.reader.getFloat(fromNodes[0], 'x');
                var fromyyValue = this.reader.getFloat(fromNodes[0], 'y');
                var fromzzValue = this.reader.getFloat(fromNodes[0], 'z');
                var toxxValue = this.reader.getFloat(fromNodes[1], 'x');
                var toyyValue = this.reader.getFloat(fromNodes[1], 'y');
                var tozzValue = this.reader.getFloat(fromNodes[1], 'z');

                newCamera = [perspectiveId, new CGFcameraOrtho(orthoLeft, orthoRight, orthoBottom, orthoTop, orthoNear, orthoFar, vec4.fromValues(fromxxValue, fromyyValue, fromzzValue, 1), vec4.fromValues(toxxValue, toyyValue, tozzValue, 1), vec3.fromValues(0, 1, 0))];
                this.views.push(newCamera);

                if (perspectiveId = defaultView) {
                    this.defaultView = perspectiveId;
                }

            } else if (children[i].nodeName == 'perspective') {
                var fromNodes = children[i].children;
                var perspectiveNear = Number(children[i].getAttribute("near"));
                var perspectiveFar = Number(children[i].getAttribute("far"));
                var perspectiveAngle = DEGREE_TO_RAD*Number(children[i].getAttribute("angle"));
                var fromxxValue = this.reader.getFloat(fromNodes[0], 'x');
                var fromyyValue = this.reader.getFloat(fromNodes[0], 'y');
                var fromzzValue = this.reader.getFloat(fromNodes[0], 'z');
                var toxxValue = this.reader.getFloat(fromNodes[1], 'x');
                var toyyValue = this.reader.getFloat(fromNodes[1], 'y');
                var tozzValue = this.reader.getFloat(fromNodes[1], 'z');

                if (perspectiveAngle < 0 || perspectiveAngle == null || isNaN(perspectiveAngle)) {
                    this.onXMLMinorError("Missing angle value in the perspective");
                }

                newCamera = [perspectiveId, new CGFcamera(perspectiveAngle, perspectiveNear, perspectiveFar, vec3.fromValues(fromxxValue, fromyyValue, fromzzValue), vec3.fromValues(toxxValue, toyyValue, tozzValue))];
                this.views.push(newCamera);


                if (perspectiveId = defaultView) {
                    this.defaultView = perspectiveId;
                }
            }

            if (!(this.near != null && !isNaN(this.near))) {
                this.near = 0.1;
                this.onXMLMinorError("unable to parse value for near plane; assuming 'near = 0.1'");
            } else if (!(this.far != null && !isNaN(this.far))) {
                this.far = 500;
                this.onXMLMinorError("unable to parse value for far plane; assuming 'far = 500'");
            }

            if (this.near >= this.far)
                return "'near' must be smaller than 'far'";


        }

        console.log("Parsed views");
        return null;

    }

    /**
     * Parses the <ambient> block.
     * @param {ambient block element} ambientNode
     */
    parseAmbient(ambientNode) {
        // Reads the ambient and background values.
        var children = ambientNode.children;
        var nodeNames = [];
        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        // Retrieves the global ambient illumination.
        this.ambientIllumination = [0, 0, 0, 1];
        var ambientIndex = nodeNames.indexOf("ambient");
        if (ambientIndex != -1) {
            // R.
            var r = this.reader.getFloat(children[ambientIndex], 'r');
            if (r != null) {
                if (isNaN(r))
                    return "ambient 'r' is a non numeric value on the ILLUMINATION block";
                else if (r < 0 || r > 1)
                    return "ambient 'r' must be a value between 0 and 1 on the ILLUMINATION block"
                else
                    this.ambientIllumination[0] = r;
            } else
                this.onXMLMinorError("unable to parse R component of the ambient illumination; assuming R = 0");

            // G.
            var g = this.reader.getFloat(children[ambientIndex], 'g');
            if (g != null) {
                if (isNaN(g))
                    return "ambient 'g' is a non numeric value on the ILLUMINATION block";
                else if (g < 0 || g > 1)
                    return "ambient 'g' must be a value between 0 and 1 on the ILLUMINATION block"
                else
                    this.ambientIllumination[1] = g;
            } else
                this.onXMLMinorError("unable to parse G component of the ambient illumination; assuming G = 0");

            // B.
            var b = this.reader.getFloat(children[ambientIndex], 'b');
            if (b != null) {
                if (isNaN(b))
                    return "ambient 'b' is a non numeric value on the ILLUMINATION block";
                else if (b < 0 || b > 1)
                    return "ambient 'b' must be a value between 0 and 1 on the ILLUMINATION block"
                else
                    this.ambientIllumination[2] = b;
            } else
                this.onXMLMinorError("unable to parse B component of the ambient illumination; assuming B = 0");

            // A.
            var a = this.reader.getFloat(children[ambientIndex], 'a');
            if (a != null) {
                if (isNaN(a))
                    return "ambient 'a' is a non numeric value on the ILLUMINATION block";
                else if (a < 0 || a > 1)
                    return "ambient 'a' must be a value between 0 and 1 on the ILLUMINATION block"
                else
                    this.ambientIllumination[3] = a;
            } else
                this.onXMLMinorError("unable to parse A component of the ambient illumination; assuming A = 1");
        } else
            this.onXMLMinorError("global ambient illumination undefined; assuming Ia = (0, 0, 0, 1)");

        // Retrieves the background clear color.
        this.background = [0, 0, 0, 1];
        var backgroundIndex = nodeNames.indexOf("background");
        if (backgroundIndex != -1) {
            // R.
            var r = this.reader.getFloat(children[backgroundIndex], 'r');
            if (r != null) {
                if (isNaN(r))
                    return "background 'r' is a non numeric value on the ILLUMINATION block";
                else if (r < 0 || r > 1)
                    return "background 'r' must be a value between 0 and 1 on the ILLUMINATION block"
                else
                    this.background[0] = r;
            } else
                this.onXMLMinorError("unable to parse R component of the background colour; assuming R = 0");

            // G.
            var g = this.reader.getFloat(children[backgroundIndex], 'g');
            if (g != null) {
                if (isNaN(g))
                    return "background 'g' is a non numeric value on the ILLUMINATION block";
                else if (g < 0 || g > 1)
                    return "background 'g' must be a value between 0 and 1 on the ILLUMINATION block"
                else
                    this.background[1] = g;
            } else
                this.onXMLMinorError("unable to parse G component of the background colour; assuming G = 0");

            // B.
            var b = this.reader.getFloat(children[backgroundIndex], 'b');
            if (b != null) {
                if (isNaN(b))
                    return "background 'b' is a non numeric value on the ILLUMINATION block";
                else if (b < 0 || b > 1)
                    return "background 'b' must be a value between 0 and 1 on the ILLUMINATION block"
                else
                    this.background[2] = b;
            } else
                this.onXMLMinorError("unable to parse B component of the background colour; assuming B = 0");

            // A.
            var a = this.reader.getFloat(children[backgroundIndex], 'a');
            if (a != null) {
                if (isNaN(a))
                    return "background 'a' is a non numeric value on the ILLUMINATION block";
                else if (a < 0 || a > 1)
                    return "background 'a' must be a value between 0 and 1 on the AMBIENT block"
                else
                    this.background[3] = a;
            } else
                this.onXMLMinorError("unable to parse A component of the background colour; assuming A = 1");
        } else
            this.onXMLMinorError("background clear colour undefined; assuming (R, G, B, A) = (0, 0, 0, 1)");

        this.log("Ambient illumination");

        return null;
    }

    /**
     * Parses the <LIGHTS> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {

        var children = lightsNode.children;

        this.lights = [];
        var numLights = 0;

        var grandChildren = [];
        var nodeNames = [];

        //0 a 1  omni ou spot
        for (var os = 0; os < children.length; os++) {
            //  var lightId = this.reader.getString(children[os], 'id');
            if (children[os].nodeName != "omni" && children[os].nodeName != "spot") {
                this.onXMLMinorError("line 589 - unknown tag <" + children[os].nodeName + ">");
                continue;
            }



            if (children[os].nodeName == "omni") { //omni

                var lightId = this.reader.getString(children[os], 'id');

                //Get enable attribute 
                var enabledValue = true;
                if (this.reader.getString(children[os], 'enabled') == null) {
                    this.onXMLMinorError("enable value missing for ID = " + lightId + "; assuming 'true'");
                }
                if (this.reader.getString(children[os], 'enabled') != 't') {
                    enabledValue = false;
                }
                //array dos filhos       
                var especeficNetos = children[os].children;

                var dataPosicoesEspecefic = [];
                for (var it2 = 0; it2 < especeficNetos.length; it2++) {
                    dataPosicoesEspecefic.push(especeficNetos[it2].nodeName);
                }

                var indexLocation = dataPosicoesEspecefic.indexOf("location");
                var indexAmbient = dataPosicoesEspecefic.indexOf("ambient");
                var indexDiffuse = dataPosicoesEspecefic.indexOf("diffuse");
                var indexSpecular = dataPosicoesEspecefic.indexOf("specular");

                var spotPosition = [];
                spotPosition.push(Number(especeficNetos[indexLocation].getAttribute('x')));
                spotPosition.push(Number(especeficNetos[indexLocation].getAttribute('y')));
                spotPosition.push(Number(especeficNetos[indexLocation].getAttribute('z')));
                spotPosition.push(Number(especeficNetos[indexLocation].getAttribute('w')));

                var spotAmbient = [];
                spotAmbient.push(Number(especeficNetos[indexAmbient].getAttribute('r')));
                spotAmbient.push(Number(especeficNetos[indexAmbient].getAttribute('g')));
                spotAmbient.push(Number(especeficNetos[indexAmbient].getAttribute('b')));
                spotAmbient.push(Number(especeficNetos[indexAmbient].getAttribute('a')));

                var spotDiffuse = [];
                spotDiffuse.push(Number(especeficNetos[indexDiffuse].getAttribute('r')));
                spotDiffuse.push(Number(especeficNetos[indexDiffuse].getAttribute('g')));
                spotDiffuse.push(Number(especeficNetos[indexDiffuse].getAttribute('b')));
                spotDiffuse.push(Number(especeficNetos[indexDiffuse].getAttribute('a')));

                var spotSpecular = [];
                spotSpecular.push(Number(especeficNetos[indexSpecular].getAttribute('r')));
                spotSpecular.push(Number(especeficNetos[indexSpecular].getAttribute('g')));
                spotSpecular.push(Number(especeficNetos[indexSpecular].getAttribute('b')));
                spotSpecular.push(Number(especeficNetos[indexSpecular].getAttribute('a')));

                var finalGlobalValues = [];
                finalGlobalValues.push(enabledValue);
                finalGlobalValues.push(spotPosition);
                finalGlobalValues.push(spotAmbient);
                finalGlobalValues.push(spotDiffuse);
                finalGlobalValues.push(spotSpecular);

                this.lights[lightId] = finalGlobalValues;

                numLights++;

            }
            if (children[os].nodeName == "spot") {

                //spot

                if (children[os].nodeName != "spot") {
                    this.onXMLMinorError("line 605 - unknown tag <" + children[os].nodeName + ">");

                    continue;
                }

                // Get id of the current light.
                var lightId = this.reader.getString(children[os], 'id');
                if (lightId == null)
                    return "no ID defined for light";

                // Checks for repeated IDs.
                if (this.lights[lightId] != null)
                    return "ID must be unique for each light (conflict: ID = " + lightId + ")";

                //Get enable attribute 
                var enableLight = true;
                if (this.reader.getString(children[os], 'enabled') == null) {
                    this.onXMLMinorError("enable value missing for ID = " + lightId + "; assuming 'true'");
                }
                if (this.reader.getString(children[os], 'enabled') != 't') {
                    enableLight = false;
                }

                //Get angle attribute
                var angleLight;
                if (this.reader.getFloat(children[os], 'angle') == null) {
                    this.onXMLMinorError("angle value missing for ID = " + lightId + "; assuming '1'");
                    angleLight = 1;
                }
                angleLight = this.reader.getFloat(children[os], 'angle');

                //Get exponent attribute 
                var exponentLight;
                if (this.reader.getFloat(children[os], 'exponent') == null) {
                    this.onXMLMinorError("exponent value missing for ID = " + lightId + "; assuming '1'");
                }
                exponentLight = this.reader.getFloat(children[os], 'exponent');

                grandChildren = children[os].children;
                // Specifications for the current light.

                nodeNames = [];
                for (var j = 0; j < grandChildren.length; j++) {
                    nodeNames.push(grandChildren[j].nodeName);
                }

                // Gets indices of each element.

                var targetIndex = nodeNames.indexOf("target");
                var locationIndex = nodeNames.indexOf("location");
                var ambientIndex = nodeNames.indexOf("ambient");
                var diffuseIndex = nodeNames.indexOf("diffuse");
                var specularIndex = nodeNames.indexOf("specular");

                // Retrieves the light location.
                var locationLight = [];
                if (locationIndex != -1) {
                    // x
                    var x = this.reader.getFloat(grandChildren[locationIndex], 'x');
                    if (!(x != null && !isNaN(x)))
                        return "unable to parse x-coordinate of the light location for ID = " + lightId;
                    else
                        locationLight.push(x);

                    // y
                    var y = this.reader.getFloat(grandChildren[locationIndex], 'y');
                    if (!(y != null && !isNaN(y)))
                        return "unable to parse y-coordinate of the light location for ID = " + lightId;
                    else
                        locationLight.push(y);

                    // z
                    var z = this.reader.getFloat(grandChildren[locationIndex], 'z');
                    if (!(z != null && !isNaN(z)))
                        return "unable to parse z-coordinate of the light location for ID = " + lightId;
                    else
                        locationLight.push(z);

                    // w
                    var w = this.reader.getFloat(grandChildren[locationIndex], 'w');
                    if (!(w != null && !isNaN(w) && w >= 0 && w <= 1))
                        return "unable to parse x-coordinate of the light location for ID = " + lightId;
                    else
                        locationLight.push(w);
                } else
                    return "light location undefined for ID = " + lightId;

                // Retrieves the light target.
                var targetLight = [];
                if (targetIndex != -1) {
                    // x
                    var x = this.reader.getFloat(grandChildren[targetIndex], 'x');
                    if (!(x != null && !isNaN(x)))
                        return "unable to parse x-coordinate of the light target for ID = " + lightId;
                    else
                        targetLight.push(x);

                    // y
                    var y = this.reader.getFloat(grandChildren[targetIndex], 'y');
                    if (!(y != null && !isNaN(y)))
                        return "unable to parse y-coordinate of the light target for ID = " + lightId;
                    else
                        targetLight.push(y);

                    // z
                    var z = this.reader.getFloat(grandChildren[targetIndex], 'z');
                    if (!(z != null && !isNaN(z)))
                        return "unable to parse z-coordinate of the light target for ID = " + lightId;
                    else
                        targetLight.push(z);

                } else
                    return "light target undefined for ID = " + lightId;

                // Retrieves the ambient component.
                var ambientIllumination = [];
                if (ambientIndex != -1) {
                    // R
                    var r = this.reader.getFloat(grandChildren[ambientIndex], 'r');
                    if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                        return "unable to parse R component of the ambient illumination for ID = " + lightId;
                    else
                        ambientIllumination.push(r);

                    // G
                    var g = this.reader.getFloat(grandChildren[ambientIndex], 'g');
                    if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                        return "unable to parse G component of the ambient illumination for ID = " + lightId;
                    else
                        ambientIllumination.push(g);

                    // B
                    var b = this.reader.getFloat(grandChildren[ambientIndex], 'b');
                    if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                        return "unable to parse B component of the ambient illumination for ID = " + lightId;
                    else
                        ambientIllumination.push(b);

                    // A
                    var a = this.reader.getFloat(grandChildren[ambientIndex], 'a');
                    if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                        return "unable to parse A component of the ambient illumination for ID = " + lightId;
                    else
                        ambientIllumination.push(a);
                } else
                    return "ambient component undefined for ID = " + lightId;

                // Retrieves the diffuse component
                var diffuseIllumination = [];
                if (diffuseIndex != -1) {
                    // R
                    var r = this.reader.getFloat(grandChildren[diffuseIndex], 'r');
                    if (r != null) {
                        if (isNaN(r))
                            return "diffuse 'r' is a non numeric value on the LIGHTS block";
                        else if (r < 0 || r > 1)
                            return "diffuse 'r' must be a value between 0 and 1 on the LIGHTS block"
                        else
                            diffuseIllumination.push(r);
                    } else
                        return "unable to parse R component of the diffuse illumination for ID = " + lightId;

                    // G
                    var g = this.reader.getFloat(grandChildren[diffuseIndex], 'g');
                    if (g != null) {
                        if (isNaN(g))
                            return "diffuse 'g' is a non numeric value on the LIGHTS block";
                        else if (g < 0 || g > 1)
                            return "diffuse 'g' must be a value between 0 and 1 on the LIGHTS block"
                        else
                            diffuseIllumination.push(g);
                    } else
                        return "unable to parse G component of the diffuse illumination for ID = " + lightId;

                    // B
                    var b = this.reader.getFloat(grandChildren[diffuseIndex], 'b');
                    if (b != null) {
                        if (isNaN(b))
                            return "diffuse 'b' is a non numeric value on the LIGHTS block";
                        else if (b < 0 || b > 1)
                            return "diffuse 'b' must be a value between 0 and 1 on the LIGHTS block"
                        else
                            diffuseIllumination.push(b);
                    } else
                        return "unable to parse B component of the diffuse illumination for ID = " + lightId;

                    // A
                    var a = this.reader.getFloat(grandChildren[diffuseIndex], 'a');
                    if (a != null) {
                        if (isNaN(a))
                            return "diffuse 'a' is a non numeric value on the LIGHTS block";
                        else if (a < 0 || a > 1)
                            return "diffuse 'a' must be a value between 0 and 1 on the LIGHTS block"
                        else
                            diffuseIllumination.push(a);
                    } else
                        return "unable to parse A component of the diffuse illumination for ID = " + lightId;
                } else
                    return "diffuse component undefined for ID = " + lightId;

                // Retrieves the specular component
                var specularIllumination = [];
                if (specularIndex != -1) {
                    // R
                    var r = this.reader.getFloat(grandChildren[specularIndex], 'r');
                    if (r != null) {
                        if (isNaN(r))
                            return "specular 'r' is a non numeric value on the LIGHTS block";
                        else if (r < 0 || r > 1)
                            return "specular 'r' must be a value between 0 and 1 on the LIGHTS block"
                        else
                            specularIllumination.push(r);
                    } else
                        return "unable to parse R component of the specular illumination for ID = " + lightId;

                    // G
                    var g = this.reader.getFloat(grandChildren[specularIndex], 'g');
                    if (g != null) {
                        if (isNaN(g))
                            return "specular 'g' is a non numeric value on the LIGHTS block";
                        else if (g < 0 || g > 1)
                            return "specular 'g' must be a value between 0 and 1 on the LIGHTS block"
                        else
                            specularIllumination.push(g);
                    } else
                        return "unable to parse G component of the specular illumination for ID = " + lightId;

                    // B
                    var b = this.reader.getFloat(grandChildren[specularIndex], 'b');
                    if (b != null) {
                        if (isNaN(b))
                            return "specular 'b' is a non numeric value on the LIGHTS block";
                        else if (b < 0 || b > 1)
                            return "specular 'b' must be a value between 0 and 1 on the LIGHTS block"
                        else
                            specularIllumination.push(b);
                    } else
                        return "unable to parse B component of the specular illumination for ID = " + lightId;

                    // A
                    var a = this.reader.getFloat(grandChildren[specularIndex], 'a');
                    if (a != null) {
                        if (isNaN(a))
                            return "specular 'a' is a non numeric value on the LIGHTS block";
                        else if (a < 0 || a > 1)
                            return "specular 'a' must be a value between 0 and 1 on the LIGHTS block"
                        else
                            specularIllumination.push(a);
                    } else
                        return "unable to parse A component of the specular illumination for ID = " + lightId;
                } else
                    return "specular component undefined for ID = " + lightId;

                // Light global information.
                this.lights[lightId] = [enableLight, locationLight, ambientIllumination, diffuseIllumination, specularIllumination];

                numLights++;


                if (numLights == 0)
                    return "at least one light must be defined";
                else if (numLights > 8)
                    this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");
            }
        }
        this.log("Parsed lights");

        return null;
    }

    /**
     * Parses the <TEXTURES> block. 
     * @param {textures block element} 
     */
    parseTextures(texturesNode) {

        this.textures = [];
        var eachTexture = texturesNode.children;
        // Each texture.

        var oneTextureDefined = false;

        for (var i = 0; i < eachTexture.length; i++) {

            var nodeName = eachTexture[i].nodeName;
            if (nodeName == "texture") {

                // Retrieves texture ID.
                var textureID = this.reader.getString(eachTexture[i], 'id');
                if (textureID == null)
                    return "failed to parse texture ID";

                // Checks if ID is valid.
                if (this.textures[textureID] != null)
                    return "texture ID must unique (conflict with ID = " + textureID + ")";

                var filepath = this.reader.getString(eachTexture[i], 'file');
                if (filepath == null)
                    return "unable to parse texture file path for ID = " + textureID;

                if (filepath == null)
                    return "file path undefined for texture with ID = " + textureID;

                var texture = new CGFtexture(this.scene, filepath);

                this.textures[textureID] = texture;
                oneTextureDefined = true;
            } else {

                this.onXMLMinorError("line 904 - unknown tag name <" + nodeName + ">");
            }
        }

        if (!oneTextureDefined) {

            return "at least one texture must be defined in the TEXTURES block";
        }

        console.log("Parsed textures");

        return null;
    }

    /**
     * Parses the <MATERIALS> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        var children = materialsNode.children;
        // Each material.

        this.materials = [];

        var oneMaterialDefined = false;

        for (var i = 0; i < children.length; i++) {


            if (children[i].nodeName != "material") {
                this.onXMLMinorError("line 929 - unknown tag name <" + children[i].nodeName + ">");
                continue;
            }

            var materialID = this.reader.getString(children[i], 'id');
            if (materialID == null)
                return "no ID defined for material";

            if (this.materials[materialID] != null)
                return "ID must be unique for each material (conflict: ID = " + materialID + ")";

            var materialSpecs = children[i].children;

            var nodeNames = [];

            for (var j = 0; j < materialSpecs.length; j++)
                nodeNames.push(materialSpecs[j].nodeName);

            // Determines the values for each field.
            // Shininess.
            var shininess = this.reader.getString(children[i], 'shininess');

            if (shininess == null)
                return "unable to parse shininess value for material with ID = " + materialID;
            else if (isNaN(shininess))
                return "'shininess' is a non numeric value";
            else if (shininess <= 0)
                return "'shininess' must be positive";

            // Specular component.
            var specularIndex = nodeNames.indexOf("specular");
            if (specularIndex == -1)
                return "no specular component defined for material with ID = " + materialID;
            var specularComponent = [];
            // R.
            var r = this.reader.getFloat(materialSpecs[specularIndex], 'r');
            if (r == null)
                return "unable to parse R component of specular reflection for material with ID = " + materialID;
            else if (isNaN(r))
                return "specular 'r' is a non numeric value on the MATERIALS block";
            else if (r < 0 || r > 1)
                return "specular 'r' must be a value between 0 and 1 on the MATERIALS block"
            specularComponent.push(r);
            // G.
            var g = this.reader.getFloat(materialSpecs[specularIndex], 'g');
            if (g == null)
                return "unable to parse G component of specular reflection for material with ID = " + materialID;
            else if (isNaN(g))
                return "specular 'g' is a non numeric value on the MATERIALS block";
            else if (g < 0 || g > 1)
                return "specular 'g' must be a value between 0 and 1 on the MATERIALS block";
            specularComponent.push(g);
            // B.
            var b = this.reader.getFloat(materialSpecs[specularIndex], 'b');
            if (b == null)
                return "unable to parse B component of specular reflection for material with ID = " + materialID;
            else if (isNaN(b))
                return "specular 'b' is a non numeric value on the MATERIALS block";
            else if (b < 0 || b > 1)
                return "specular 'b' must be a value between 0 and 1 on the MATERIALS block";
            specularComponent.push(b);
            // A.
            var a = this.reader.getFloat(materialSpecs[specularIndex], 'a');
            if (a == null)
                return "unable to parse A component of specular reflection for material with ID = " + materialID;
            else if (isNaN(a))
                return "specular 'a' is a non numeric value on the MATERIALS block";
            else if (a < 0 || a > 1)
                return "specular 'a' must be a value between 0 and 1 on the MATERIALS block";
            specularComponent.push(a);

            // Diffuse component.
            var diffuseIndex = nodeNames.indexOf("diffuse");
            if (diffuseIndex == -1)
                return "no diffuse component defined for material with ID = " + materialID;
            var diffuseComponent = [];
            // R.
            r = this.reader.getFloat(materialSpecs[diffuseIndex], 'r');
            if (r == null)
                return "unable to parse R component of diffuse reflection for material with ID = " + materialID;
            else if (isNaN(r))
                return "diffuse 'r' is a non numeric value on the MATERIALS block";
            else if (r < 0 || r > 1)
                return "diffuse 'r' must be a value between 0 and 1 on the MATERIALS block";
            diffuseComponent.push(r);
            // G.
            g = this.reader.getFloat(materialSpecs[diffuseIndex], 'g');
            if (g == null)
                return "unable to parse G component of diffuse reflection for material with ID = " + materialID;
            else if (isNaN(g))
                return "diffuse 'g' is a non numeric value on the MATERIALS block";
            else if (g < 0 || g > 1)
                return "diffuse 'g' must be a value between 0 and 1 on the MATERIALS block";
            diffuseComponent.push(g);
            // B.
            b = this.reader.getFloat(materialSpecs[diffuseIndex], 'b');
            if (b == null)
                return "unable to parse B component of diffuse reflection for material with ID = " + materialID;
            else if (isNaN(b))
                return "diffuse 'b' is a non numeric value on the MATERIALS block";
            else if (b < 0 || b > 1)
                return "diffuse 'b' must be a value between 0 and 1 on the MATERIALS block";
            diffuseComponent.push(b);
            // A.
            a = this.reader.getFloat(materialSpecs[diffuseIndex], 'a');
            if (a == null)
                return "unable to parse A component of diffuse reflection for material with ID = " + materialID;
            else if (isNaN(a))
                return "diffuse 'a' is a non numeric value on the MATERIALS block";
            else if (a < 0 || a > 1)
                return "diffuse 'a' must be a value between 0 and 1 on the MATERIALS block";
            diffuseComponent.push(a);

            // Ambient component.
            var ambientIndex = nodeNames.indexOf("ambient");
            if (ambientIndex == -1)
                return "no ambient component defined for material with ID = " + materialID;
            var ambientComponent = [];
            // R.
            r = this.reader.getFloat(materialSpecs[ambientIndex], 'r');
            if (r == null)
                return "unable to parse R component of ambient reflection for material with ID = " + materialID;
            else if (isNaN(r))
                return "ambient 'r' is a non numeric value on the MATERIALS block";
            else if (r < 0 || r > 1)
                return "ambient 'r' must be a value between 0 and 1 on the MATERIALS block";
            ambientComponent.push(r);
            // G.
            g = this.reader.getFloat(materialSpecs[ambientIndex], 'g');
            if (g == null)
                return "unable to parse G component of ambient reflection for material with ID = " + materialID;
            else if (isNaN(g))
                return "ambient 'g' is a non numeric value on the MATERIALS block";
            else if (g < 0 || g > 1)
                return "ambient 'g' must be a value between 0 and 1 on the MATERIALS block";
            ambientComponent.push(g);
            // B.
            b = this.reader.getFloat(materialSpecs[ambientIndex], 'b');
            if (b == null)
                return "unable to parse B component of ambient reflection for material with ID = " + materialID;
            else if (isNaN(b))
                return "ambient 'b' is a non numeric value on the MATERIALS block";
            else if (b < 0 || b > 1)
                return "ambient 'b' must be a value between 0 and 1 on the MATERIALS block";
            ambientComponent.push(b);
            // A.
            a = this.reader.getFloat(materialSpecs[ambientIndex], 'a');
            if (a == null)
                return "unable to parse A component of ambient reflection for material with ID = " + materialID;
            else if (isNaN(a))
                return "ambient 'a' is a non numeric value on the MATERIALS block";
            else if (a < 0 || a > 1)
                return "ambient 'a' must be a value between 0 and 1 on the MATERIALS block";
            ambientComponent.push(a);

            // Emission component.
            var emissionIndex = nodeNames.indexOf("emission");
            if (emissionIndex == -1)
                return "no emission component defined for material with ID = " + materialID;
            var emissionComponent = [];
            // R.
            r = this.reader.getFloat(materialSpecs[emissionIndex], 'r');
            if (r == null)
                return "unable to parse R component of emission for material with ID = " + materialID;
            else if (isNaN(r))
                return "emisson 'r' is a non numeric value on the MATERIALS block";
            else if (r < 0 || r > 1)
                return "emisson 'r' must be a value between 0 and 1 on the MATERIALS block";
            emissionComponent.push(r);
            // G.
            g = this.reader.getFloat(materialSpecs[emissionIndex], 'g');
            if (g == null)
                return "unable to parse G component of emission for material with ID = " + materialID;
            if (isNaN(g))
                return "emisson 'g' is a non numeric value on the MATERIALS block";
            else if (g < 0 || g > 1)
                return "emisson 'g' must be a value between 0 and 1 on the MATERIALS block";
            emissionComponent.push(g);
            // B.
            b = this.reader.getFloat(materialSpecs[emissionIndex], 'b');
            if (b == null)
                return "unable to parse B component of emission for material with ID = " + materialID;
            else if (isNaN(b))
                return "emisson 'b' is a non numeric value on the MATERIALS block";
            else if (b < 0 || b > 1)
                return "emisson 'b' must be a value between 0 and 1 on the MATERIALS block";
            emissionComponent.push(b);
            // A.
            a = this.reader.getFloat(materialSpecs[emissionIndex], 'a');
            if (a == null)
                return "unable to parse A component of emission for material with ID = " + materialID;
            else if (isNaN(a))
                return "emisson 'a' is a non numeric value on the MATERIALS block";
            else if (a < 0 || a > 1)
                return "emisson 'a' must be a value between 0 and 1 on the MATERIALS block";
            emissionComponent.push(a);

            // Creates material with the specified characteristics.
            var newMaterial = new CGFappearance(this.scene);
            newMaterial.setShininess(shininess);
            newMaterial.setAmbient(ambientComponent[0], ambientComponent[1], ambientComponent[2], ambientComponent[3]);
            newMaterial.setDiffuse(diffuseComponent[0], diffuseComponent[1], diffuseComponent[2], diffuseComponent[3]);
            newMaterial.setSpecular(specularComponent[0], specularComponent[1], specularComponent[2], specularComponent[3]);
            newMaterial.setEmission(emissionComponent[0], emissionComponent[1], emissionComponent[2], emissionComponent[3]);
            this.materials[materialID] = newMaterial;

            oneMaterialDefined = true;

        }

        if (!oneMaterialDefined)
            return "at least one material must be defined on the MATERIALS block";

        this.log("Parsed materials");
        return null;

    }

    /**
     * Parses the <transformations> block index 6.
     * @param {transformations block element} transformationsNode
     */
    parseTransformations(transformationsNode) {
        var children = transformationsNode.children;
        // Each transformation.

        this.transformations = [];

        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "transformation") {
                this.onXMLMinorError("line 1164 - unknown tag name <" + children[i].nodeName + ">");
                continue;
            }

            var transformationID = this.reader.getString(children[i], 'id');
            if (transformationID == null)
                return "no ID defined for transformation";

            var transformMatrix = mat4.create();

            if (this.transformations[transformationID] != null)
                return "ID must be unique for each transformation (conflict: ID = " + transformationID + ")";

            var transformationSpecs = children[i].children;


            // Retrieves possible transformations.
            for (var j = 0; j < transformationSpecs.length; j++) {
                this.scene.loadIdentity(transformMatrix);

                switch (transformationSpecs[j].nodeName) {
                    case "translate":

                        // Retrieves translation parameters.
                        var x = Number(transformationSpecs[j].getAttribute("x"));

                        if (x == null) {
                            this.onXMLMinorError("unable to parse x-coordinate of translation; discarding transform");
                            break;
                        } else if (isNaN(x))
                            return "non-numeric value for x-coordinate of translation (node ID = " + nodeID + ")";
                        var y = Number(transformationSpecs[j].getAttribute("y"));

                        if (y == null) {
                            this.onXMLMinorError("unable to parse y-coordinate of translation; discarding transform");
                            break;
                        } else if (isNaN(y))
                            return "non-numeric value for y-coordinate of translation (node ID = " + nodeID + ")";
                        var z = Number(transformationSpecs[j].getAttribute("z"));

                        if (z == null) {
                            this.onXMLMinorError("unable to parse z-coordinate of translation; discarding transform");
                            break;
                        } else if (isNaN(z))
                            return "non-numeric value for z-coordinate of translation (node ID = " + nodeID + ")";

                        mat4.translate(transformMatrix, transformMatrix, [x, y, z]);

                        break;
                    case "rotate":

                        // Retrieves rotation parameters.

                        var axis = this.reader.getItem(transformationSpecs[j], 'axis', ['x', 'y', 'z']);

                        if (axis == null) {
                            this.onXMLMinorError("unable to parse rotation axis; discarding transform");
                            break;
                        }
                        var angle = Number(transformationSpecs[j].getAttribute("angle"));

                        if (angle == null) {
                            this.onXMLMinorError("unable to parse rotation angle; discarding transform");
                            break;
                        } else if (isNaN(angle))
                            return "non-numeric value for rotation angle (node ID = " + nodeID + ")";

                        mat4.rotate(transformMatrix, transformMatrix, angle * DEGREE_TO_RAD, this.axisCoords[axis]);

                        break;
                    case "scale":

                        // Retrieves scale parameters.

                        var sx = Number(transformationSpecs[j].getAttribute("x"));
                        var sy = Number(transformationSpecs[j].getAttribute("y"));
                        var sz = Number(transformationSpecs[j].getAttribute("z"));


                        if (sx == null) {
                            this.onXMLMinorError("unable to parse x component of scaling; discarding transform");
                            break;
                        } else if (isNaN(sx))
                            return "non-numeric value for x component of scaling (node ID = " + nodeID + ")";

                        if (sy == null) {
                            this.onXMLMinorError("unable to parse y component of scaling; discarding transform");
                            break;
                        } else if (isNaN(sy))
                            return "non-numeric value for y component of scaling (node ID = " + nodeID + ")";

                        if (sz == null) {
                            this.onXMLMinorError("unable to parse z component of scaling; discarding transform");
                            break;
                        } else if (isNaN(sz))
                            return "non-numeric value for z component of scaling (node ID = " + nodeID + ")";

                        mat4.scale(transformMatrix, transformMatrix, [sx, sy, sz]);

                        break;

                    default:
                        break;
                }

                this.transformations[transformationID] = new MyComponentNode(this, transformationID);
                this.transformations[transformationID].transform = transformMatrix;

            }

        }

        this.log("Parsed transformations");
        return null;

    }

    /**
     * Parses the <primitives> block.
     * @param {primitives block element} primitivessNode
     */
    parsePrimitives(primitivesNode) {

        var children = primitivesNode.children;
        var onePrimitiveDefined = false;

        // Each transformation.
        var nodeID;
        this.primitives = [];
        for (var i = 0; i < children.length; i++) {
            if (children[i].nodeName == "primitive") {

                // Retrieves primitive ID.
                var primitivavalida = false;
                var primitive = "";
                var args = [];
                var primitiveID = this.reader.getString(children[i], 'id');

                var primitiveSpecs = children[i].children;

                if (primitiveID == null)
                    return "failed to parse primitive ID";

                // Checks if ID is valid.
                if (this.primitives[primitiveID] != null)
                    return "primitive ID must unique (conflict with ID = " + primitiveID + ")";

                // Retrieves primitive specifications.
                for (var j = 0; j < primitiveSpecs.length; j++) {
                    var name = primitiveSpecs[j].nodeName;

                    if (name != null) { //if (name == 'rectangle' || name == 'cylinder' || name == 'cilinder' || name == 'sphere' || name == 'triangle' || name == 'thorus') {

                        args.push(name);
                        primitive = name;

                    } else {

                        this.onXMLError("invalid primitive <" + primitiveID + ">");
                        continue;
                    }

                    for (var attr = 0; attr < primitiveSpecs[j].attributes.length; attr++) {

                        args.push(primitiveSpecs[j].getAttribute(primitiveSpecs[j].attributes[attr].nodeName));
                        primitivavalida = true;
                    }

                    if (primitivavalida) {
                        this.primitives[primitiveID] = [primitive, args];
                        onePrimitiveDefined = true;
                    }
                }
            } else
                this.onXMLMinorError("unknown tag name <" + nodeName + ">");
        }
        if (!onePrimitiveDefined)
            return "at least one primitive must be defined on the primitives block";

        this.log("Parsed primitives");
        return null;
    }

    /**
     * Parses the <components> block.
     * @param {components block element} componentsNode
     */
    parseComponents(componentsNode) {


        // Traverses nodes.
        var children = componentsNode.children;

        for (var i = 0; i < children.length; i++) {
            var nodeName;

            if ((nodeName = children[i].nodeName) == "root") {
                // Retrieves root node.
                console.log(children[i].nodeName);
                if (this.idRoot != null)
                    return "there can only be one root node";
                else {
                    var root = this.reader.getString(children[i], 'id');
                    if (root == null)
                        return "failed to retrieve root node ID";
                    this.idRoot = root;
                }
            } else if (nodeName == "component") {

                // Retrieves node ID.
                var nodeID = this.reader.getString(children[i], 'id');

                if (nodeID == null)
                    return "failed to retrieve node ID";
                // Checks if ID is valid.
                if (this.nodes[nodeID] != null)
                    return "node ID must be unique (conflict: ID = " + nodeID + ")";

                this.log("Processing node " + nodeID);

                // Creates node.
                this.nodes[nodeID] = new MyComponentNode(this, nodeID);
                var componentData = children[i].children;
                var componentDataNames = [];
                var possibleValues = ["materials", "texture", "transformation", "children"];
                for (var j = 0; j < componentData.length; j++) {
                    var name = componentData[j].nodeName;
                    componentDataNames.push(componentData[j].nodeName);

                    // Warns against possible invalid tag names.
                    if (possibleValues.indexOf(name) == -1)
                        this.onXMLMinorError("line 1316 - unknown tag <" + name + ">");
                }

                // Retrieves material ID.
                var materialIndex = componentDataNames.indexOf("materials");

                if (materialIndex == -1)
                    return "material must be defined (node ID = " + nodeID + ")";

                this.nodes[nodeID].materials = [];
                this.nodes[nodeID].defaultAsp = 0;
                this.nodes[nodeID].nMaterials = 0;
                for (var index = 0; index < componentData[materialIndex].children.length; index++) {


                    var materialID = this.reader.getString(componentData[materialIndex].children[index], 'id');

                    if (materialID == null)
                        return "unable to parse material ID (node ID = " + nodeID + ")";

                    if (materialID != "inherit" && this.materials[materialID] == null)
                        return "ID does not correspond to a valid material (node ID = " + nodeID + "\nmaterial ID = " + materialID + ")";


                    if (materialID == "none" || materialID == null) {

                        materialID = "defaultMaterial";
                        if (nodeID == this.idRoot) {
                            rootNode.defaultAsp = index;
                        } else {
                            this.nodes[nodeID].defaultAsp = index;
                        }
                    }

                    this.nodes[nodeID].materials[index] = materialID;
                    this.nodes[nodeID].nMaterials++;

                }

                // Retrieves texture ID.
                var textureIndex = componentDataNames.indexOf("texture");
                if (textureIndex == -1)
                    return "texture must be defined (node ID = " + nodeID + ")";
                var textureID = this.reader.getString(componentData[textureIndex], 'id');


                var textureS = Number(componentData[textureIndex].getAttribute("length_s"));
                if (textureS == null) {
                    textureS = 1;
                    this.onXMLMinorError("unable to parse texture length_s (node ID = " + nodeID + ") - asssuming 1");
                    break;
                }

                var textureT = Number(componentData[textureIndex].getAttribute("length_t"));
                if (textureT == null) {
                    textureT = 1;
                    this.onXMLMinorError("unable to parse texture length_t (node ID = " + nodeID + ") - asssuming 1");
                    break;
                }

                if (textureID == null)
                    return "unable to parse texture ID (node ID = " + nodeID + ")";

                if (textureID != "inherit" && textureID != "none" && this.textures[textureID] == null)
                    return "ID does not correspond to a valid texture (node ID = " + nodeID + ")";

                this.nodes[nodeID].textureID = textureID;
                this.nodes[nodeID].length_s = textureS;
                this.nodes[nodeID].length_t = textureT;

                // Retrieves information about children.
                var descendantsIndex = componentDataNames.indexOf("children");
                if (descendantsIndex == -1)
                    return "an intermediate node must have descendants";

                var descendants = componentData[descendantsIndex].children;

                var sizeChildren = 0;
                var type;
                var transformMatrix = mat4.create();

                //retrieves possible transformations
                for (var d = 0; d < componentData.length; d++) {
                    if (componentData[d].nodeName == "transformation") {

                        var transformationSpecs = componentData[d].children;
                        this.scene.loadIdentity(transformMatrix);
                        for (var t = 0; t < transformationSpecs.length; t++) {



                            switch (transformationSpecs[t].nodeName) {
                                case "translate":

                                    // Retrieves translation parameters.
                                    var x = Number(transformationSpecs[t].getAttribute("x"));


                                    if (x == null) {
                                        this.onXMLMinorError("unable to parse x-coordinate of translation; discarding transform");
                                        break;
                                    } else if (isNaN(x))
                                        return "non-numeric value for x-coordinate of translation (node ID = " + nodeID + ")";
                                    var y = Number(transformationSpecs[t].getAttribute("y"));


                                    if (y == null) {
                                        this.onXMLMinorError("unable to parse y-coordinate of translation; discarding transform");
                                        break;
                                    } else if (isNaN(y))
                                        return "non-numeric value for y-coordinate of translation (node ID = " + nodeID + ")";
                                    var z = Number(transformationSpecs[t].getAttribute("z"));

                                    if (z == null) {
                                        this.onXMLMinorError("unable to parse z-coordinate of translation; discarding transform");
                                        break;
                                    } else if (isNaN(z))
                                        return "non-numeric value for z-coordinate of translation (node ID = " + nodeID + ")";

                                    mat4.translate(transformMatrix, transformMatrix, [x, y, z]);

                                    break;
                                case "rotate":

                                    // Retrieves rotation parameters.

                                    var axis = this.reader.getItem(transformationSpecs[t], 'axis', ['x', 'y', 'z']);

                                    if (axis == null) {
                                        this.onXMLMinorError("unable to parse rotation axis; discarding transform");
                                        break;
                                    }
                                    var angle = Number(transformationSpecs[t].getAttribute("angle"));

                                    if (angle == null) {
                                        this.onXMLMinorError("unable to parse rotation angle; discarding transform");
                                        break;
                                    } else if (isNaN(angle))
                                        return "non-numeric value for rotation angle (node ID = " + nodeID + ")";

                                    mat4.rotate(transformMatrix, transformMatrix, angle * DEGREE_TO_RAD, this.axisCoords[axis]);

                                    break;
                                case "scale":

                                    //Retrieves scaling parameters

                                    var sx = Number(transformationSpecs[t].getAttribute("x"));
                                    var sy = Number(transformationSpecs[t].getAttribute("y"));
                                    var sz = Number(transformationSpecs[t].getAttribute("z"));

                                    if (sx == null) {
                                        this.onXMLMinorError("unable to parse x component of scaling; discarding transform");
                                        break;
                                    } else if (isNaN(sx))
                                        return "non-numeric value for x component of scaling (node ID = " + nodeID + ")";

                                    if (sy == null) {
                                        this.onXMLMinorError("unable to parse y component of scaling; discarding transform");
                                        break;
                                    } else if (isNaN(sy))
                                        return "non-numeric value for y component of scaling (node ID = " + nodeID + ")";

                                    if (sz == null) {
                                        this.onXMLMinorError("unable to parse z component of scaling; discarding transform");
                                        break;
                                    } else if (isNaN(sz))
                                        return "non-numeric value for z component of scaling (node ID = " + nodeID + ")";

                                    mat4.scale(transformMatrix, transformMatrix, [sx, sy, sz]);

                                    break;


                                case "transformationref":

                                    // Retrieves transformation ID.
                                    var transformationID = transformationSpecs[t].getAttribute("id");

                                    if (transformationID == null)
                                        return "unable to parse transformation ID (node ID = " + nodeID + ")";

                                    this.nodes[nodeID].transformationID = transformationID;

                                    transformMatrix = this.transformations[transformationID].transform;
                                    break;

                                default:
                                    break;
                            }



                        }
                        this.nodes[nodeID].transform = transformMatrix;
                    }

                }


                for (var j = 0; j < descendants.length; j++) {

                    if (descendants[j].nodeName == "componentref") {

                        type = "component";
                        var currentID = this.reader.getString(descendants[j], 'id');

                        this.log("   Descendant: " + currentID);

                        if (currentID == null) {
                            this.onXMLMinorError("unable to parse descendant id");
                        } else if (currentID == nodeID) {
                            return "a node may not be a child of its own";
                        } else {
                            this.nodes[nodeID].type = "component";
                            this.nodes[nodeID].addChild(currentID);
                            sizeChildren++;
                        }
                    } else if (descendants[j].nodeName == "primitiveref") {

                        var nomePrim = this.reader.getString(descendants[j], 'id');

                        var type = this.primitives[nomePrim][1][0];
                        var argss = [];

                        for (var attr = 1; attr < this.primitives[nomePrim][1].length; attr++) {
                            argss.push(this.primitives[nomePrim][1][attr]);

                        }

                        if (type != null)
                            this.log("   Leaf: " + type);
                        else
                            console.warn("Error in leaf");

                        var leafType = descendants[j].attributes.getNamedItem('id').value;
                        this.nodes[nodeID].type = "primitive";
                        this.nodes[nodeID].addLeaf(new MyPrimitiveNode(this, type, argss));

                        sizeChildren++;
                    } else
                        this.onXMLMinorError("line 1505 - unknown tag <" + descendants[j].nodeName + ">");

                }
                if (sizeChildren == 0)
                    return "at least one descendant must be defined for each intermediate node";
            } else
                this.onXMLMinorError("line 1511 - unknown tag name <" + nodeName);
        }

        this.log("Parsed components");
        return null;
    }

    /**
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }

    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }



    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {

        var rootNode = this.nodes[this.idRoot];

        var matriz = mat4.create();

        this.scene.pushMatrix();
        this.scene.loadIdentity(matriz);
        this.scene.popMatrix();

        var textura = this.textures["defaultTexture"];
        if (this.textures[rootNode.textureID] != null) {
            textura = this.textures[rootNode.textureID][0];
        }
        this.processNode(rootNode, matriz, textura, this.materials[rootNode.materials[rootNode.defaultAsp]], 1, 1);

    }

    processNode(node, tg, parTex, parAsp, parS, parT) {

        var textura = this.textures["defaultTexture"]; //por oposição a = parTex;
        var material = parAsp;
        var ampS = parS;
        var ampT = parT;

        this.scene.pushMatrix();
        if (node != null) {
            if (this.nodes[node.nodeID].transform != null) {
                this.scene.multMatrix(this.nodes[node.nodeID].transform);
            }

            if (node.textureId == 'none')
                console.log("texture NONE");

            if (node.textureID != null) {

                switch (node.textureID) {
                    case 'inherit':
                        textura = parTex;
                        break;
                    case 'none':
                 //       textura.unbind();
                        break;
                    default:
                        textura = this.textures[node.textureID];
                        break;
                }

            }

            if (node.textureID != "none" && node.textureID != "inherit") {
                if (node.length_t != null) {
                    
                    ampT = node.length_t;
                } else {
                    ampT = 1;
                    this.onXMLMinorError("length_t undefined, assuming 1 for " + node.NodeID);
                }

                if (node.length_s != null) {
                    ampS = node.length_s;
                } else {
                    ampS = 1;
                    this.onXMLMinorError("length_s undefined, assuming 1 for " + node.NodeID);
                }
            } 

            if (node.materials[node.defaultAsp] == "none" || node.materials[node.defaultAsp] == null) {
                this.onXMLMinorError("Material Id can not be none");
            } else if (node.materials[node.defaultAsp] == "inherit") {
                material = parAsp;
            } else {
                material = this.materials[this.nodes[node.nodeID].materials[this.nodes[node.nodeID].defaultAsp]];
               //material = this.materials[this.nodes[node.nodeID].defaultAsp];
            }

            for (var i = 0; i < node.children.length; i++) {
                this.processNode(this.nodes[node.children[i]], this.nodes[node.nodeID].transform, textura, material, ampS, ampT);
            }

            if (material != null) {
                material.apply();
            }

            if (textura != null) {
                textura.bind();
            }

            for (var j = 0; j < node.leaves.length; j++) {
                   node.leaves[j].updateTexCoords(ampS, ampT);
                node.leaves[j].display();
            }
        }
        this.scene.popMatrix();
    }
}