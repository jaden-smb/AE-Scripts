# How to run the scripts?

1. Open After Effects and ensure that a composition is active.
2. Run the script, either by adding it to a script menu or by copying and pasting it into the After Effects script editor.
3. The script will automatically create the neccesary process in the active composition.


# createShape.jsx

This script is designed to create a V-shaped composition in After Effects using two animated rectangular layers.

## How it works:

- Checks if a composition is active and if so, creates the V-shaped composition within it.
- Creates a background layer with a white solid.
- Adds two rectangular layers, one on the left side and one on the right side, and animates them to form a V-shape.

## Code Explanation

1. The script first checks if a composition is active and if so, retrieves a reference to it using the `getActiveComposition` function.
2. The `createVShapeWithRectangles` function is then called, which is responsible for creating the V-shaped composition.
3. Inside the `createVShapeWithRectangles` function:
   - A background layer is created with a white solid.
   - Two rectangular layers are created using the `createRectangle` function, one on the left side and one on the right side.
   - The `animateRectangle` function is used to animate the position of the two rectangular layers, creating the V-shape.
4. The `createRectangle` function is responsible for creating a rectangular shape layer with the given properties (name, rotation, size, and color) and returning the layer.
5. The `animateRectangle` function sets the position animation of the given layer, moving it from the start position to the end position over the specified duration.

Overall, this script provides a simple and efficient way to create a V-shaped composition in After Effects using rectangular layers and animation.


# createNewCompBasedPrevious.jsx

This script is designed to create a new composition from the active composition in After Effects, allowing the user to select which layers to include in the new composition.

## Code Explanation

1. The script first checks if a composition is active and if it has any layers. If not, it displays an alert message and returns.
2. It then creates a new dialog window and adds various UI elements to it, such as a name field, layer checkboxes, a progress bar, and buttons.
3. The `setOkButtonAction` function sets the action for the "OK" button, which checks if a composition with the same name already exists, and if not, creates a new composition with the selected layers.
4. The `setCancelButtonAction` function sets the action for the "Cancel" button, which simply closes the dialog window.
5. The script uses several helper functions to create and manage the various UI elements, such as `getActiveComposition`, `createDialogWindow`, `addNameField`, `addLayerCheckboxes`, `addGroup`, `addProgressBar`, and `addButtons`.

Overall, this script provides a simple and efficient way to create a new composition from the active composition in After Effects, allowing the user to selectively include layers in the new composition.
