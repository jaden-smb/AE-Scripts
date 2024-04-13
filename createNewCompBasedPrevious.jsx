var selectedLayers = [];

function createUI() {
    var win = createWindow();
    var activeComp = getActiveComp();

    if (!activeComp) {
        alert("No active composition.");
        return;
    }

    var layers = activeComp.layers;
    var checkboxes = createCheckboxes(win, layers);

    createSelectAllButton(win, checkboxes);
    createCompButton(win, activeComp, layers, checkboxes);

    win.show();
}

function createWindow() {
    var win = new Window("dialog", "Create New Comp With Selected Layers");
    win.orientation = "column";
    return win;
}

function getActiveComp() {
    var activeComp = app.project.activeItem;
    return (activeComp instanceof CompItem) ? activeComp : null;
}

function createCheckboxes(win, layers) {
    var checkboxes = [];
    win.add("statictext", undefined, "Select layers to duplicate in the new composition:");
    for (var i = 1; i <= layers.length; i++) {
        var checkbox = win.add("checkbox", undefined, layers[i].name);
        checkboxes.push(checkbox);
        alert("Checkbox created for layer: " + layers[i].name); // Debug line
    }
    alert("Total checkboxes created: " + checkboxes.length); // Debug line
    return checkboxes;
}

function createSelectAllButton(win, checkboxes) {
    var selectAllButton = win.add("button", undefined, "Select All");
    selectAllButton.onClick = function() {
        checkboxes.forEach(function(checkbox) {
            checkbox.value = true;
        });
    };
}

function createCompButton(win, activeComp, layers, checkboxes) {
    var createCompButton = win.add("button", undefined, "Create Composition");
    createCompButton.onClick = function() {
        try {
            app.beginUndoGroup("Create New Comp With Selected Layers");
            var newComp = createNewComp(activeComp);
            duplicateSelectedLayers(layers, checkboxes, newComp);
            moveAndApplyEffectsToLayers(layers, newComp);
            app.endUndoGroup();
        } catch (e) {
            alert("An error occurred: " + e.toString());
        } finally {
            win.close();
        }
    };
}

function createNewComp(activeComp) {
    return app.project.items.addComp("New Composition", activeComp.width, activeComp.height, activeComp.pixelAspect, activeComp.duration, activeComp.frameRate);
}

function duplicateSelectedLayers(layers, checkboxes, newComp) {
    selectedLayers = [];

    checkboxes.forEach(function(checkbox, i) {
        if (checkbox.value) {
            var originalLayer = layers[i + 1];
            var newLayer = originalLayer.duplicate();
            newLayer.moveToEnd();
            selectedLayers.push(newLayer);
            newLayer.copyToComp(newComp);
            newLayer.remove();
        }
    });
}

function moveAndApplyEffectsToLayers(layers, newComp) {
    for (var i = selectedLayers.length - 1; i >= 0; i--) {
        var effects = layers[i + 1].property("Effects");
        for (var j = 1; j <= effects.numProperties; j++) {
            selectedLayers[i].property("Effects").addProperty(effects.property(j).matchName);
        }
    }
}

createUI();