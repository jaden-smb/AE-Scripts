(function() {

    // Create a new window with the title "Shape Generator"
    var win = new Window("palette", "Advanced Shape and Particle Generator", undefined);
    win.orientation = "column";
    win.alignChildren = ["fill", "top"];
    win.spacing = 10;
    win.margins = 16;

    // Create a panel for the shape checkboxes
    var shapePanel = win.add("panel", undefined, "Select Shapes");
    shapePanel.orientation = "column";
    shapePanel.alignChildren = ["left", "top"];
    shapePanel.spacing = 10;
    shapePanel.margins = 10;

    var rectangleCheckbox = shapePanel.add("checkbox", undefined, "Rectangle");
    var circleCheckbox = shapePanel.add("checkbox", undefined, "Circle");
    var triangleCheckbox = shapePanel.add("checkbox", undefined, "Triangle");
    var starCheckbox = shapePanel.add("checkbox", undefined, "Star");

    // Create a panel for the particle system checkboxes
    var particleSystemPanel = win.add("panel", undefined, "Select Particle System");
    particleSystemPanel.orientation = "column";
    particleSystemPanel.alignChildren = ["left", "top"];
    particleSystemPanel.spacing = 10;
    particleSystemPanel.margins = 10;

    var fireCheckbox = particleSystemPanel.add("checkbox", undefined, "Fire");
    var bubbleCheckbox = particleSystemPanel.add("checkbox", undefined, "Bubble");
    var snowCheckbox = particleSystemPanel.add("checkbox", undefined, "Snow");
    var rainCheckbox = particleSystemPanel.add("checkbox", undefined, "Rain");
    var hairCheckbox = particleSystemPanel.add("checkbox", undefined, "Hair");
    var starBurstCheckbox = particleSystemPanel.add("checkbox", undefined, "Star Burst");
    var shatterCheckbox = particleSystemPanel.add("checkbox", undefined, "Shatter");

    // Create a button to generate the shapes
    var generateButton = win.add("button", undefined, "Generate Shapes and Particles");
    generateButton.alignment = ["fill", "bottom"];

    generateButton.onClick = function() {
        // Get the active composition
        var comp = getActiveComposition();
        if (!comp) {
            alert("Please select a composition.");
            return;
        }

        // Create the shapes
        var shapeTypes = [];
        if (rectangleCheckbox.value) shapeTypes.push(0);
        if (circleCheckbox.value) shapeTypes.push(1);
        if (triangleCheckbox.value) shapeTypes.push(2);
        if (starCheckbox.value) shapeTypes.push(3);
        createRandomShapes(comp, shapeTypes);

        // Create particle system
        var selectedParticleType = null;
        if (fireCheckbox.value) selectedParticleType = "Fire";
        else if (bubbleCheckbox.value) selectedParticleType = "Bubble";
        else if (snowCheckbox.value) selectedParticleType = "Snow";
        else if (rainCheckbox.value) selectedParticleType = "Rain";
        else if (hairCheckbox.value) selectedParticleType = "Hair";
        else if (starCheckbox.value) selectedParticleType = "Star Burst";
        else if (shatterCheckbox.value) selectedParticleType = "Shatter";

        if (selectedParticleType) {
            createParticleSystem(comp, selectedParticleType);
        }
    };

    // Show the window
    win.show();

    // Returns the active composition, or null if no composition is active
    function getActiveComposition() {
        if (!app.project || !app.project.activeItem || !(app.project.activeItem instanceof CompItem)) {
            return null;
        }
        return app.project.activeItem;
    }

    // Create a random shape in the given composition
    function createRandomShape(comp, i) {
        var shapeType = Math.floor(Math.random() * 4);
        var name = "Shape " + (i + 1);
        var rotation = Math.random() * 360;
        var size = [Math.random() * 500 + 200, Math.random() * 500 + 200];
        var color = [Math.random(), Math.random(), Math.random(), 1];
        var scaleX = Math.random() * 80 + 20; // Increase the range to 20-100
        var scaleY = Math.random() * 80 + 20; // Increase the range to 20-100

        // Random position offset from the center, limited to avoid clutter
        var positionOffset = [
            (Math.random() - 0.5) * comp.width * 0.5,
            (Math.random() - 0.5) * comp.height * 0.5
        ];

        var shape;
        switch (shapeType) {
            case 0:
                shape = createRectangle(comp, name, rotation, size, color, scaleX, scaleY);
                break;
            case 1:
                shape = createCircle(comp, name, rotation, size, color, scaleX, scaleY);
                break;
            case 2:
                shape = createTriangle(comp, name, rotation, size, color, scaleX, scaleY);
                break;
            case 3:
                shape = createStar(comp, name, rotation, size, color, scaleX, scaleY);
                break;
        }

        // Set the position of the shape
        if (shape) {
            var centerPosition = [comp.width / 2, comp.height / 2];
            shape.property("Transform").property("Position").setValue([
                centerPosition[0] + positionOffset[0],
                centerPosition[1] + positionOffset[1]
            ]);
        }

        return shape;
    }

    // Shuffle an array
    function shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i]; // Use a temporary variable for swapping
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }

    // Animate a random number of shapes
    function animateShapes(comp, shapes) {
        var numShapesToAnimate = Math.floor(Math.random() * shapes.length) + 1; // Change here
        var shuffledShapes = shuffleArray(shapes);
        for (var i = 0; i < numShapesToAnimate; i++) {
            var shapeToAnimate = shuffledShapes[i];
            animateRandomShapes(shapeToAnimate, Math.random() * 5, [Math.random() * comp.width, Math.random() * comp.height], [Math.random() * comp.width, Math.random() * comp.height]);
        }
    }

    // Create a random number of random shapes in the given composition
    function createRandomShapes(comp) {
        var numShapes = Math.floor(Math.random() * 10) + 1;
        var createdShapes = [];
        for (var i = 0; i < numShapes; i++) {
            createdShapes.push(createRandomShape(comp, i));
        }

        var backgroundColor = [Math.random(), Math.random(), Math.random()];
        createBackgroundLayer(comp, backgroundColor);
        animateShapes(comp, createdShapes);
    }

    function createParticleSystem(comp, particleType) {
        if (!comp || !comp.layers) {
            return null;
        }

        var particleLayerColor = [1, 1, 1];
        if (particleType === "Snow" || particleType === "Rain") {
            particleLayerColor = [0, 0, 0];
        }

        var particleLayer = comp.layers.addSolid(particleLayerColor, "Particle Layer", comp.width, comp.height, 1.0);
        if (!particleLayer) {
            return null;
        }

        switch (particleType) {
            case "Fire":
                var particleSystem = particleLayer.property("Effects").addProperty("CC Particle World");
                particleSystem.property("Producer Size").setValue([comp.width, comp.height, 0]);
                particleSystem.property("Birth Rate").setValue(0.1);
                particleSystem.property("Longevity").setValue(2);
                particleSystem.property("Velocity").setValue(0.1);
                particleSystem.property("Gravity").setValue(0);
                particleSystem.property("Size").setValue(1);
                particleSystem.property("Color").setValue([1, 0, 0]);
                break;
            case "Bubble":
                var bubbleSystem = particleLayer.property("Effects").addProperty("CC Bubbles");
                bubbleSystem.property("Producer Size").setValue([comp.width, comp.height, 0]);
                bubbleSystem.property("Birth Rate").setValue(0.1);
                bubbleSystem.property("Longevity").setValue(2);
                bubbleSystem.property("Velocity").setValue(0.1);
                bubbleSystem.property("Gravity").setValue(0);
                bubbleSystem.property("Size").setValue(1);
                bubbleSystem.property("Color").setValue([1, 0, 0]);
                break;
            case "Snow":
                var snowSystem = particleLayer.property("Effects").addProperty("CC Snowfall");
                particleLayer.adjustmentLayer = true;
                snowSystem.property("Producer Size").setValue([comp.width, comp.height, 0]);
                snowSystem.property("Birth Rate").setValue(0.1);
                snowSystem.property("Longevity").setValue(2);
                snowSystem.property("Velocity").setValue(0.1);
                snowSystem.property("Gravity").setValue(0);
                snowSystem.property("Size").setValue(1);
                snowSystem.property("Color").setValue([1, 1, 1]);
                break;
            case "Rain":
                var rainSystem = particleLayer.property("Effects").addProperty("CC Rain");
                particleLayer.adjustmentLayer = true;
                rainSystem.property("Producer Size").setValue([comp.width, comp.height, 0]);
                rainSystem.property("Birth Rate").setValue(0.1);
                rainSystem.property("Longevity").setValue(2);
                rainSystem.property("Velocity").setValue(0.1);
                rainSystem.property("Gravity").setValue(0);
                rainSystem.property("Size").setValue(1);
                rainSystem.property("Color").setValue([0, 0, 1]);
                break;
            case "Hair":
                var hairSystem = particleLayer.property("Effects").addProperty("CC Hair");
                hairSystem.property("Producer Size").setValue([comp.width, comp.height, 0]);
                hairSystem.property("Birth Rate").setValue(0.1);
                hairSystem.property("Longevity").setValue(2);
                hairSystem.property("Velocity").setValue(0.1);
                hairSystem.property("Gravity").setValue(0);
                hairSystem.property("Size").setValue(1);
                hairSystem.property("Color").setValue([1, 1, 1]);
                break;
            case "Star Burst":
                var starBurstSystem = particleLayer.property("Effects").addProperty("CC Star Burst");
                starBurstSystem.property("Producer Size").setValue([comp.width, comp.height, 0]);
                starBurstSystem.property("Birth Rate").setValue(0.1);
                starBurstSystem.property("Longevity").setValue(2);
                starBurstSystem.property("Velocity").setValue(0.1);
                starBurstSystem.property("Gravity").setValue(0);
                starBurstSystem.property("Size").setValue(1);
                starBurstSystem.property("Color").setValue([1, 1, 1]);
                break;
            default:
                alert("Invalid particle type: " + particleType);
                break;
        }

        particleLayer.property("Transform").property("Position").setValue([comp.width / 2, comp.height / 2]);

        return particleLayer;
    }

    // Creates a rectangle in the given composition with the given properties and returns it
    function createRectangle(comp, name, rotation, size, color, scaleX, scaleY) {
        if (!comp || !comp.layers) {
            return null;
        }
        var layer = comp.layers.addShape();
        if (!layer) {
            return null;
        }

        var group = layer.property("Contents").addProperty("ADBE Vector Group");
        var rectangle = group.property("Contents").addProperty("ADBE Vector Shape - Rect");
        rectangle.property("Size").setValue(size);

        layer.property("Transform").property("Rotation").setValue(rotation);
        layer.property("Transform").property("Scale").setValue([scaleX, scaleY]);
        var fill = group.property("Contents").addProperty("ADBE Vector Graphic - Fill");
        fill.property("Color").setValue(color);

        return layer;
    }

    // Creates a circle in the given composition with the given properties and returns it
    function createCircle(comp, name, rotation, size, color, scaleX, scaleY) {
        if (!comp || !comp.layers) {
            return null;
        }
        var layer = comp.layers.addShape();
        if (!layer) {
            return null;
        }

        var group = layer.property("Contents").addProperty("ADBE Vector Group");
        var ellipse = group.property("Contents").addProperty("ADBE Vector Shape - Ellipse");
        ellipse.property("Size").setValue(size);

        layer.property("Transform").property("Rotation").setValue(rotation);
        layer.property("Transform").property("Scale").setValue([scaleX, scaleY]);
        var fill = group.property("Contents").addProperty("ADBE Vector Graphic - Fill");
        fill.property("Color").setValue(color);

        return layer;
    }

    // Creates a triangle in the given composition with the given properties and returns it
    function createTriangle(comp, name, rotation, size, color, scaleX, scaleY) {
        if (!comp || !comp.layers) {
            return null;
        }
        var layer = comp.layers.addShape();
        if (!layer) {
            return null;
        }

        var group = layer.property("Contents").addProperty("ADBE Vector Group");
        var path = group.property("Contents").addProperty("ADBE Vector Shape - Group");
        var pathProperty = path.property("ADBE Vector Shape");
        var trianglePath = new Shape();
        trianglePath.vertices = [
            [0, -size[1] / 2],
            [-size[0] / 2, size[1] / 2],
            [size[0] / 2, size[1] / 2]
        ];
        trianglePath.closed = true;
        pathProperty.setValue(trianglePath);

        layer.property("Transform").property("Rotation").setValue(rotation);
        layer.property("Transform").property("Scale").setValue([scaleX, scaleY]);
        var fill = group.property("Contents").addProperty("ADBE Vector Graphic - Fill");
        fill.property("Color").setValue(color);

        return layer;
    }

    // Creates a star in the given composition with the given properties and returns it
    function createStar(comp, name, rotation, size, color, scaleX, scaleY) {
        if (!comp || !comp.layers) {
            return null;
        }
        var layer = comp.layers.addShape();
        if (!layer) {
            return null;
        }

        var group = layer.property("Contents").addProperty("ADBE Vector Group");
        var path = group.property("Contents").addProperty("ADBE Vector Shape - Group");
        var pathProperty = path.property("ADBE Vector Shape");
        var starPath = new Shape();
        starPath.vertices = [
            [0, -size[1] / 2],
            [size[0] / 4, -size[1] / 4],
            [size[0] / 2, 0],
            [size[0] / 4, size[1] / 4],
            [0, size[1] / 2],
            [-size[0] / 4, size[1] / 4],
            [-size[0] / 2, 0],
            [-size[0] / 4, -size[1] / 4]
        ];
        starPath.closed = true;
        pathProperty.setValue(starPath);

        layer.property("Transform").property("Rotation").setValue(rotation);
        layer.property("Transform").property("Scale").setValue([scaleX, scaleY]);
        var fill = group.property("Contents").addProperty("ADBE Vector Graphic - Fill");
        fill.property("Color").setValue(color);

        return layer;
    }

    function createBackgroundLayer(comp, backgroundColor) {
        var backgroundLayer = comp.layers.addSolid(backgroundColor, "Background", comp.width, comp.height, 1.0);
        backgroundLayer.moveToEnd();
    }

    // Animates the given layer from the start position to the end position over the given duration
    function animateRandomShapes(layer, duration, startPosition, endPosition) {
        layer.property("Transform").property("Position").setValuesAtTimes([0, duration], [startPosition, endPosition]);
    }
})();