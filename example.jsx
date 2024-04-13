(function() {
    var comp = app.project.activeItem;
    if (!comp || !(comp instanceof CompItem)) {
        alert("Please select a composition first.");
        return;
    }

    var win = new Window("dialog", "Composition Elements");
    win.orientation = "column";
    win.alignChildren = ["fill", "top"];
    win.spacing = 10;
    win.margins = 16;

    var checkboxes = [];
    for (var i = 1; i <= comp.numLayers; i++) {
        var group = win.add("group");
        group.orientation = "row";
        group.alignChildren = ["left", "center"];
        group.spacing = 10;
        group.margins = 0;
        var checkbox = group.add("checkbox", undefined, "");
        var statictext = group.add("statictext", undefined, comp.layer(i).name);
        statictext.preferredSize.width = 200;
        checkboxes.push({checkbox: checkbox, layerIndex: i});
    }

    var progressBar = win.add("progressbar", undefined, 0, comp.numLayers);
    progressBar.preferredSize.width = 200;

    var buttons = win.add("group");
    buttons.orientation = "row";
    buttons.alignChildren = ["center", "center"];
    buttons.spacing = 10;
    buttons.margins = 0;
    var okButton = buttons.add("button", undefined, "OK");
    okButton.preferredSize.width = 100;
    var cancelButton = buttons.add("button", undefined, "Cancel");
    cancelButton.preferredSize.width = 100;

    okButton.onClick = function() {
        var newComp = app.project.items.addComp("New Composition", comp.width, comp.height, comp.pixelAspect, comp.duration, comp.frameRate);
        for (var i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].checkbox.value) {
                var layer = comp.layer(checkboxes[i].layerIndex);
                layer.copyToComp(newComp);
                progressBar.value++;
            }
        }
        win.close();
    }

    cancelButton.onClick = function() {
        win.close();
    }

    win.show();
})();