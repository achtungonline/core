const fs = require("fs");
const mkdirp = require("mkdirp");
const path = require("path");
const Promise = require("promise");
const time = require("./time");

function writeToFile(outfile, inContent) {
    if (inContent.pipe && inContent.on) {
        // Content seems to be a stream.
        return streamToFile(outfile, inContent);
    }

    mkdirp.sync(path.dirname(outfile));
    return new Promise(function (resolve, reject) {
        fs.writeFile(outfile, inContent, function (err) {
            if (err) {
                reject(err);
                return;
            }

            resolve();
        });
    });
}

function streamToFile(outfile, inStream, options) {
    options = options || {};
    var log = options.log === false ? false : true;

    mkdirp.sync(path.dirname(outfile));

    return new Promise(function (resolve, reject) {
        const outStream = fs.createWriteStream(outfile);

        outStream.on("finish", () => {
            if (log) {
                console.log("[" + outfile + "] built");
            }
            resolve();
        });

        inStream
            .on("error", (err) => reject(err))
            .pipe(outStream)
            .on("error", (err) => reject(err));
    });
}

function streamToFileTimed(outfile, inStream) {
    var endTime = time();

    return new Promise(function (resolve, reject) {
        streamToFile(outfile, inStream, { log: false }).then(function () {
            console.log("[" + outfile + "] built (" + endTime() + " seconds)");
            resolve();
        }, reject);
    });
}

module.exports = {
    streamToFile: streamToFile,
    streamToFileTimed: streamToFileTimed,
    writeToFile: writeToFile
};
