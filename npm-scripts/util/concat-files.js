const fs = require("fs");
const PassThrough = require("stream").PassThrough;

module.exports = function concat(files) {
    var outputStream = new PassThrough();

    readFile(files, outputStream);

    return outputStream;
};

function readFile(files, outputStream) {
    files = files.concat(); // Copy the array to avoid mutation of the parameter.

    if (files.length === 0) {
        outputStream.end();
    } else {
        const file = files.splice(0, 1)[0]; // Remove the first file from the beginning of the array.
        const stream = fs.createReadStream(file);

        outputStream.write("\n\n// " + file + "\n\n");

        stream.pipe(outputStream, {end: false});
        stream.on("end", () => {
            readFile(files, outputStream);
        });
    }
}
