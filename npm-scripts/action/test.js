const Promise = require("promise");
const builderMaker = require("../build");
const chalk = require("chalk");
const fileWriter = require("../util/fileWriter");
const promiseUtils = require("../util/promise-utils");
const linterMaker = require("../util/lint-runner");
const testerMaker = require("../util/test-runner");

module.exports = function build() {
    var builder = builderMaker({testFiles: "src/**/*spec.js"});
    var linter = linterMaker();
    var tester = testerMaker();

    Promise.all([
        promiseUtils.runSerially([
            () => fileWriter.streamToFileTimed("build/tests.js", builder.buildTestCode()),
            () => tester.test(["build/tests.js"]),
            () => linter.lint(["*.js", "src/**/*.js"]),
            () => console.log(chalk.green("\The code is amazing :)"))
        ])
    ]).catch((err) => err && console.error(err));
};
