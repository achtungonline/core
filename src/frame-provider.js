var frameProvider = window.requestAnimationFrame;

if (!frameProvider) {
    frameProvider = function (callback) {
        setTimeout(callback, 0);
    }
}

module.exports = frameProvider;