const Promise = require("promise");
const spawn = require("child_process").spawn;
const chalk = require("chalk");

const builder = require("./build");

function eslint(rootPath) {
    return new Promise(function (resolve, reject) {
        console.log("Linting...");
        const eslintProcess = spawn("eslint", [rootPath + "*.js", rootPath + "src/**/*.js"], { shell: true, stdio: "inherit" });

        eslintProcess.on("close", (code) => {
            if (code) {
                reject();
            } else {
                resolve();
            }
        });
    });
}

module.exports = function build(rootPath) {
    Promise.all([
        builder.buildTestCode(rootPath)
    ]).then(function () {
        console.log("built everything.");

        eslint(rootPath).then(function () {
            console.log(chalk.green("Your code is amazing :)"));
            console.log("NOTE: Since this command does not run the tests yet, please make sure to run the specrunner manually.");
        });
    });
}
