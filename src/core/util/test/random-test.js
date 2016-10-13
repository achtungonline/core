import * as Random from "../random.js";

describe("Random", function() {

    it("should create a random permutation", function() {
        var random = Random("hfsiofshiogeisojfioseoi");
        for (var n = 1; n < 20; n++) {
            var perm = random.randomPermutation(n);
            for (var i = 0; i < n; i++) {
                // Make sure all elements are part of the permutation
                expect(perm.indexOf(i) === -1).not.toEqual(-1);
            }
        }
    });

    it("should create a random permutation without fixed points", function() {
        var random = Random("FHSFIO229fr9asfjfo29J");
        for (var n = 2; n < 20; n++) {
            var perm = random.randomPermutation(n, true);
            for (var i = 0; i < n; i++) {
                // Make sure there are no fixed points
                expect(perm[i]).not.toEqual(i);
            }
        }
    });

});