function createVShapeWithRectangles() {
    var comp = getActiveComposition();
    if (!comp) {
        alert("Please select a composition.");
        return;
    }

    var backgroundColor = [1, 1, 1]; 
    var backgroundLayer = comp.layers.addSolid(backgroundColor, "Background", comp.width, comp.height, 1.0);
    backgroundLayer.moveToEnd();

    var rectangleLayer1 = createRectangle(comp, "Rectangle Layer 1", 45, [50, 200], [0, 0, 1, 1]);
    var rectangleLayer2 = createRectangle(comp, "Rectangle Layer 2", 135, [50, 200], [0, 0, 1, 1]);

    animateRectangle(rectangleLayer1, 2, [50, 0],[1086, 540]);
    animateRectangle(rectangleLayer2, 2, [comp.width - 50, 0], [769, 540]);
}

function getActiveComposition() {
    var comp = app.project.activeItem;
    return (comp && comp instanceof CompItem) ? comp : null;
}

function createRectangle(comp, name, rotation, size, color) {
    var layer = comp.layers.addShape();
    layer.name = name;

    var group = layer.property("Contents").addProperty("ADBE Vector Group");
    var rectangle = group.property("Contents").addProperty("ADBE Vector Shape - Rect");
    rectangle.property("Size").setValue(size);

    layer.property("Transform").property("Rotation").setValue(rotation);
    layer.property("Transform").property("Scale").setValue([300, 300]);

    var fill = group.property("Contents").addProperty("ADBE Vector Graphic - Fill");
    fill.property("Color").setValue(color);

    return layer;
}

function animateRectangle(layer, duration, startPosition, endPosition) {
    layer.property("Transform").property("Position").setValuesAtTimes([0, duration], [startPosition, endPosition]);
}

createVShapeWithRectangles()
