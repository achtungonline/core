import clone from "./clone";

describe("util", function () {

    it("test basic cloning", function () {
        var object = {
            1: {
                deepList: []
            },
            list: []
        };

        expect(clone(object)).toEqual(object);
    });

    it("test deep cloning", function () {
        var object = {
            1: {
                deepList: []
            },
            list: []
        };

        var clonedObject = clone(object);
        clonedObject.list.push(1);
        clonedObject[1].deepList.push(2);
        expect(object).toEqual({
            1: {
                deepList: []
            },
            list: []
        });

        expect(clonedObject).toEqual({
            1: {
                deepList: [2]
            },
            list: [1]
        });
    });
});