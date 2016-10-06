const connect = require('connect');
const serveStatic = require('serve-static');
const builderMaker = require('../build');
const fileWriter = require('../util/fileWriter');
const promiseUtils = require('../util/promise-utils');
const linterMaker = require('../util/lint-runner');
const testerMaker = require('../util/test-runner');
const Promise = require('promise');

module.exports = function build() {
    var builder = builderMaker();
    var tester = testerMaker();
    var linter = linterMaker();

    function handleError(err) {
        if (err) {
            console.log(err.toString());
        }
    }

    // Special lint/test functions that always resolves, and logs errors to console if rejection (so that we can run lint and tests even though they fail).

    function lint() {
        return new Promise((resolve) => {
            linter.lint(['*.js', 'js/**/*.js', 'documentation/**/*.js']).then(resolve, (err) => {
                console.log('lint reject');
                handleError(err);
                resolve();
            });
        });
    }

    function test() {
        console.log('running test');
        return new Promise((resolve) => {
            tester.test(['build/tests.js']).then(resolve, (err) => {
                handleError(err);
                resolve();
            });
        });
    }

    const port = 9000;

    const server = connect();
    server.use(serveStatic('./'));
    server.listen(port);
    console.log('Listening on http://localhost:' + port + '/');
    console.log('');

    builder.watchModuleCode()
        .on('initialBuild', (stream) => {
            //fileWriter.streamToFileTimed('build/main.js', stream).then(() => {
                builder.watchTestCode()
                    .on('initialBuild', (stream) => promiseUtils.runSerially([
                        () => fileWriter.streamToFileTimed('build/tests.js', stream),
                        test,
                        lint
                    ]).catch(handleError))
                    .on('updateBuild', (stream) => promiseUtils.runSerially([
                        () => fileWriter.streamToFile('build/tests.js', stream),
                        test,
                        lint
                    ]).catch(handleError));
            //}, handleError);
        })
        .on('updateBuild', (stream) => fileWriter.streamToFile('build/main.js', stream).catch(handleError));
};
