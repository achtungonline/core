import * as shapeFactory from "./shape-factory.js";
import * as shapeSpatialRelations from "./shape-spatial-relations.js";

describe("Shape spatial relations", function() {

    it("circle inside rectangle", function() {
        var circle = shapeFactory.createCircle(2.8, 0.1, 0.1);
        var rectangle = shapeFactory.createRectangle(6, 6, 0, 0);
        expect(shapeSpatialRelations.contains(rectangle, circle)).toBeTruthy();
    });

    it("circle outside of rectangle", function() {
        var circle = shapeFactory.createCircle(3, 0.9, 0.9);
        var rectangle = shapeFactory.createRectangle(6, 6, 1, 1);
        expect(shapeSpatialRelations.contains(rectangle, circle)).toBeFalsy();
    });

    it("rectangle inside circle", function() {
        var rectangle1 = shapeFactory.createRectangle(6, 2, 1, 3);
        var rectangle2 = shapeFactory.createRectangle(4, 4, 2, 1);
        var circle = shapeFactory.createCircle(4, 0, 0);
        expect(shapeSpatialRelations.contains(circle, rectangle1)).toBeTruthy();
        expect(shapeSpatialRelations.contains(circle, rectangle2)).toBeTruthy();
    });

    it("rectangle outside of circle", function() {
        var rectangle = shapeFactory.createRectangle(5, 5, 2, 1);
        var circle = shapeFactory.createCircle(4, 0, 0);
        expect(shapeSpatialRelations.contains(circle, rectangle)).toBeFalsy();
    });

});