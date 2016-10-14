import objectCleaner from "./object-cleaner.js";

describe("util", function () {

    it("objectCleaner", function () {
        var object = {
            1: "a",
            2: null,
            3: undefined,
            4: NaN,
            5: ["a", null, "c"],
            6: {
                1: null,
                2: "a",
                3: [null]
            }
        };

        expect(objectCleaner(object)).toEqual({
            1: "a",
            5: ["a", "c"],
            6: {
                2: "a",
                3: []
            }
        });
    });
});
