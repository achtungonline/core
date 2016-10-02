var mkdirp = require("mkdirp");

function getPath() {
    return "build";
}

function ensureItExists() {
    mkdirp.sync(getPath());
}

module.exports = {
    ensureItExists: ensureItExists,
    getPath: getPath
};
