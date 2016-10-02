//const connect = require("connect");
//const serveStatic = require("serve-static");
const builder = require("./build");

module.exports = function build(rootPath) {
    //const port = 9000;
    //
    //const server = connect();
    //server.use(serveStatic("./"));
    //server.listen(port);
    //console.log("Listening on http://localhost:" + port + "/");
    //console.log("");

    builder.watchTestCode(rootPath);
};
