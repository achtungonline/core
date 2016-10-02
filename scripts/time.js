module.exports = function time(cb) {
    const startTime = (new Date()).getTime();

    return function (_cb) {
        const elapsedSeconds = +(((new Date()).getTime() - startTime) / 1000).toFixed(2);
        const args = [elapsedSeconds].concat(arguments);

        if (!cb) {
            cb = _cb;
        }

        cb.apply(cb, args);
    }
}
