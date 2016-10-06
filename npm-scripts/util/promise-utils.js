var Promise = require('promise');

function runSerially(fns) {
    return new Promise(function (resolve, reject) {
        var index = -1;

        function runFnAtCurrentIndex() {
            index++;

            var fn = fns[index];

            if (!fn) {
                resolve();
            }

            fn().then(runFnAtCurrentIndex, reject);
        }

        runFnAtCurrentIndex();
    });
}

module.exports = {
    runSerially: runSerially
};
