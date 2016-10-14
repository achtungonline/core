import * as random from "./random.js";

function isInteger(value) {
    return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
}

describe("Random", function() {

    it("randomize different numbers", function() {
        var gameState = {seed: 78489};
        var num1 = random.random(gameState);
        var num2 = random.random(gameState);
        expect(num1).not.toEqual(num2);
    });

    it("randInt", function() {
        var gameState = {seed: 67483};
        var low = 15;
        var high = 20;
        for (var n = 1; n < 10; n++) {
            var num = random.randInt(gameState, low, high);
            expect(isInteger(num)).toBe(true);
            expect(num).not.toBeLessThan(low);
            expect(num).toBeLessThan(high);
        }
    });

    it("random permutation", function() {
        var gameState = {seed: 14777};
        for (var n = 1; n < 20; n++) {
            var perm = random.randomPermutation(gameState, n);
            for (var i = 0; i < n; i++) {
                // Make sure all elements are part of the permutation
                expect(perm.indexOf(i) === -1).not.toEqual(-1);
            }
        }
    });

    it("random permutation without fixed points", function() {
        var gameState = {seed: 28409};
        for (var n = 2; n < 20; n++) {
            var perm = random.randomPermutation(gameState, n, true);
            for (var i = 0; i < n; i++) {
                // Make sure there are no fixed points
                expect(perm[i]).not.toEqual(i);
            }
        }
    });

});