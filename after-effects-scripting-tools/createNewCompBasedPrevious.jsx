(function() {
    var selectedImage;
    // Get the active composition
    var comp = getActiveComposition();
    if (!comp) {
        alert("Please select a composition first.");
        return;
    }

    // Check if the composition has any layers
    if (comp.numLayers === 0) {
        alert("The selected composition has no layers.");
        return;
    }

    // Create the dialog window
    var win = createDialogWindow();
    var nameField = addNameField(win);
    var frameRateField = addFrameRateField(win);
    var durationField = addDurationField(win);
    var checkboxes = addLayerCheckboxes(win, comp);
    var progressBar = addProgressBar(win, comp);
    var importButton = addImportButton(win);
    var buttons = addButtons(win);
    // Set the action for the OK button
    setOkButtonAction(buttons.okButton, nameField, frameRateField, durationField, checkboxes, progressBar, comp, win);
    // Set the action for the Cancel button
    setCancelButtonAction(buttons.cancelButton, win);

    win.show();

    // Returns the active composition, or null if no composition is active
    function getActiveComposition() {
        var comp = app.project.activeItem;
        return (comp instanceof CompItem) ? comp : null;
    }

    // Creates and returns a new dialog window
    function createDialogWindow() {
        var win = new Window("dialog", "Composition Elements");
        win.orientation = "column";
        win.alignChildren = ["fill", "top"];
        win.spacing = 10;
        win.margins = 16;
        return win;
    }

    function addFrameRateField(win) {
        var frameRateGroup = win.add("group");
        frameRateGroup.add("statictext", undefined, "New Composition Frame Rate:");
        var frameRateField = frameRateGroup.add("edittext", undefined, "24");
        frameRateField.characters = 5;
        return frameRateField;
    }

    function addDurationField(win) {
        var durationGroup = win.add("group");
        durationGroup.add("statictext", undefined, "New Composition Duration in Seconds:");
        var durationField = durationGroup.add("edittext", undefined, "10");
        durationField.characters = 5;
        return durationField;
    }

    // Adds a field for the new composition name to the window and returns it
    function addNameField(win) {
        var nameGroup = win.add("group");
        nameGroup.add("statictext", undefined, "New Composition Name:");
        var nameField = nameGroup.add("edittext", undefined, "New Composition");
        nameField.characters = 25;
        return nameField;
    }

    // Adds a checkbox for each layer in the composition to the window and returns them
    function addLayerCheckboxes(win, comp) {
        var checkboxes = [];
        for (var i = 1; i <= comp.numLayers; i++) {
            var group = addGroup(win);
            var checkbox = group.add("checkbox", undefined, "");
            var statictext = group.add("statictext", undefined, comp.layer(i).name);
            statictext.preferredSize.width = 200;

            checkboxes.push({
                checkbox: checkbox,
                layerIndex: i
            });
        }
        return checkboxes;
    }

    // Adds a group to the window and returns it
    function addGroup(win) {
        var group = win.add("group");
        group.orientation = "row";
        group.alignChildren = ["left", "center"];
        group.spacing = 10;
        group.margins = 0;
        return group;
    }

    // Adds a progress bar to the window and returns it
    function addProgressBar(win, comp) {
        var progressBar = win.add("progressbar", undefined, 0, comp.numLayers);
        progressBar.preferredSize.width = 200;
        return progressBar;
    }

    // Adds OK and Cancel buttons to the window and returns them
    function addButtons(win) {
        var buttons = win.add("group");
        buttons.orientation = "row";
        buttons.alignChildren = ["center", "center"];
        buttons.spacing = 10;
        buttons.margins = 0;
        var okButton = buttons.add("button", undefined, "OK");
        okButton.preferredSize.width = 100;
        var cancelButton = buttons.add("button", undefined, "Cancel");
        cancelButton.preferredSize.width = 100;
        return {
            okButton: okButton,
            cancelButton: cancelButton
        };
    }

    function addImportButton(win) {
        var importGroup = win.add("group");
        importGroup.orientation = "column";
        importGroup.alignChildren = ["fill", "top"];
        importGroup.spacing = 10;
        importGroup.margins = 0;

        var importButton = importGroup.add("button", undefined, "Import Image");

        var positionGroup = importGroup.add("group");
        positionGroup.add("statictext", undefined, "Position (x, y):");
        var positionFieldX = positionGroup.add("edittext", undefined, "0");
        var positionFieldY = positionGroup.add("edittext", undefined, "0");
        positionFieldX.characters = 5;
        positionFieldY.characters = 5;

        var sizeGroup = importGroup.add("group");
        sizeGroup.add("statictext", undefined, "Size (width, height):");
        var sizeFieldWidth = sizeGroup.add("edittext", undefined, "100");
        var sizeFieldHeight = sizeGroup.add("edittext", undefined, "100");
        sizeFieldWidth.characters = 5;
        sizeFieldHeight.characters = 5;

        importButton.onClick = function() {
            var positionX = parseFloat(positionFieldX.text);
            var positionY = parseFloat(positionFieldY.text);
            var width = parseFloat(sizeFieldWidth.text);
            var height = parseFloat(sizeFieldHeight.text);
            selectedFile = dialogImportSelectedImage(positionX, positionY, width, height);
        }

        return importButton; // Moved inside the function body
    }

    function dialogImportSelectedImage(positionX, positionY, width, height) {
        var file = File.openDialog("Select an image file", "Images: *.jpg;*.jpeg;*.png;*.svg;*.gif;*.bmp;*.tiff;*.ico;*.jfif;*.webp");
        return file;
    }

    // Sets the action for the OK button
    function setOkButtonAction(okButton, nameField, frameRateField, durationField, checkboxes, progressBar, comp, win) {
        okButton.onClick = function() {
            var newCompName = nameField.text;
            var newCompFrameRate = parseFloat(frameRateField.text); // Get the frame rate from the field
            var newCompDuration = parseFloat(durationField.text); // Get the duration from the field
            if (compExists(newCompName)) {
                alert("A composition with this name already exists. Please choose a different name.");
                return;
            }
            var newComp = app.project.items.addComp(newCompName, comp.width, comp.height, comp.pixelAspect, newCompDuration, newCompFrameRate); // Use the duration when creating the new composition
            for (var i = 0; i < checkboxes.length; i++) {
                if (checkboxes[i].checkbox.value) {
                    var layer = comp.layer(checkboxes[i].layerIndex);
                    layer.copyToComp(newComp);
                    progressBar.value++;
                }
            }

            if (selectedFile) { // If a file was selected
                newComp.layers.add(app.project.importFile(new ImportOptions(selectedFile))); // Import the selected file into the new composition
            }

            newComp.openInViewer();
            win.close();
        }
    }

    // Checks if a composition with the given name already exists
    function compExists(name) {
        for (var i = 1; i <= app.project.numItems; i++) {
            if (app.project.item(i) instanceof CompItem && app.project.item(i).name === name) {
                return true;
            }
        }
        return false;
    }

    // Sets the action for the Cancel button
    function setCancelButtonAction(cancelButton, win) {
        cancelButton.onClick = function() {
            win.close();
        }
    }
})();