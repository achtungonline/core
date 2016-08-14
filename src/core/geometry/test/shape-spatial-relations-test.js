var shapeFactory = require("../shape-factory.js");
var shapeSpatialRelations = require("../shape-spatial-relations.js");

describe("Shape spatial relations", function() {

    it("should detect circle in rectangle", function() {
        var circle = shapeFactory.createCircle(2.8, 0.1, 0.1);
        var rectangle = shapeFactory.createRectangle(6, 6, 0, 0);
        expect(shapeSpatialRelations.contains(rectangle, circle)).toBeTruthy();
    });

    it("should not detect circle outside of rectangle", function() {
        var circle = shapeFactory.createCircle(3, 0.9, 0.9);
        var rectangle = shapeFactory.createRectangle(6, 6, 1, 1);
        expect(shapeSpatialRelations.contains(rectangle, circle)).toBeFalsy();
    });

    it("should detect rectangle in circle", function() {
        var rectangle1 = shapeFactory.createRectangle(6, 2, 1, 3);
        var rectangle2 = shapeFactory.createRectangle(4, 4, 2, 1);
        var circle = shapeFactory.createCircle(4, 0, 0);
        expect(shapeSpatialRelations.contains(circle, rectangle1)).toBeTruthy();
        expect(shapeSpatialRelations.contains(circle, rectangle2)).toBeTruthy();
    });

    it("should not detect rectangle outside of circle", function() {
        var rectangle = shapeFactory.createRectangle(5, 5, 2, 1);
        var circle = shapeFactory.createCircle(4, 0, 0);
        expect(shapeSpatialRelations.contains(circle, rectangle)).toBeFalsy();
    });

});