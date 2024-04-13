# ExtendScript for Adobe After Effects: Create V Shape with Rectangles

This script creates a V shape using two rectangles in an active composition in Adobe After Effects.

## Functions

### `createVShapeWithRectangles()`

This is the main function that creates the V shape. It first gets the active composition using `getActiveComposition()`. If no composition is selected, it alerts the user and exits. It then creates a white background layer. Two rectangles are created with different rotations to form a V shape. These rectangles are then animated to move from the top to the center of the composition.

### `getActiveComposition()`

This function returns the currently active composition in Adobe After Effects. If no composition is active or the active item is not a composition, it returns null.

### `createRectangle(comp, name, rotation, size, color)`

This function creates a rectangle shape layer in the given composition (`comp`). The rectangle is named (`name`), rotated (`rotation`), and sized (`size`). The color of the rectangle is set using the `color` parameter.

### `animateRectangle(layer, duration, startPosition, endPosition)`

This function animates a given layer (`layer`) over a specified duration (`duration`). The animation changes the position of the layer from `startPosition` to `endPosition`.

## Execution

The script ends with a call to `createVShapeWithRectangles()`, which kicks off the process of creating and animating the V shape.