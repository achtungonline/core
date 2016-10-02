const fs = require("fs");
const watchify = require("watchify");
const stream = require("stream");
const glob = require("glob");
const browserify = require("browserify"); // Can use the persistify wrapper around browserify to enable persistant cache. This would add the complexity of a persistant cache, so should experiment a bit before using.
const outputFolder = require("./output-folder");
const time = require("./time");
const Promise = require("promise");

function bundle(name, b, outFilename) {
    return new Promise(function (resolve, reject) {
        outputFolder.ensureItExists();

        const stream = fs.createWriteStream(outFilename);

        stream.on("finish", time((elapsedSeconds) => {
            console.log(name + " built to " + outFilename + " (" + elapsedSeconds + " seconds)");
            resolve();
        }));

        b.bundle()
            .on("error", function (err) {
                console.log(err.toString());
                this.emit("end");
                reject();
            })
            .pipe(stream);
    });
}

function buildTestCode(rootPath) {
    return new Promise(function (resolve, reject) {
        outputFolder.ensureItExists();

        var outFilename = outputFolder.getPath() + "/tests.js";

        glob(rootPath + "src/**/*spec.js", function (err, files) {
            if (err) {
                return console.error(err);
            };

            var b = browserify({
                entries: files,
                debug: true
            });

            b
            .transform("babelify", { presets: ["es2015", "react"]});

            bundle("[Tests]", b, outFilename).then(resolve, reject);
        });
    });
}

function watchTestCode(rootPath) {
    outputFolder.ensureItExists();

    var outFilename = outputFolder.getPath() + "/tests.js";

    // TODO: Not enough for when files are added while watching.
    glob(rootPath + "src/**/*spec.js", function (err, files) {
        if (err) {
            return console.error(err);
        };

        var b = browserify({
            entries: files,
            debug: true,
            cache: {},          // Needed for watchify
            packageCache: {},   // Needed for watchify
            plugin: [watchify]
        });

        b
        .transform("babelify", { presets: ["es2015", "react"]})
        .on("update", () => bundle("[Tests]", b, outFilename))
        .on("log", (msg) => console.log("[Tests] built to " + outFilename + " - " + msg));

        // TODO: Is this one needed?
        bundle("[Tests]", b, outFilename);
    });
}

module.exports = {
    buildTestCode: buildTestCode,
    watchTestCode: watchTestCode
};
