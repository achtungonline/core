const karma = require('karma');
const Promise = require('promise');
const chalk = require('chalk');

module.exports = function testRunnerMaker() {
    function test(files) {
        return new Promise(function (resolve, reject) {
            try {
                var error = false;

                var server = new karma.Server({
                    port: 9876,
                    browserNoActivityTimeout: 30000,
                    browsers: ['PhantomJS'],
                    frameworks: ['jasmine'],
                    files: files,
                    singleRun: true,
                    logLevel: 'WARN',
                    reporters: ['mocha'],
                    colors: chalk.supportsColor
                }, function (exitCode) {
                    if (exitCode === 0) {
                        if (error) {
                            reject(new Error('Testing failed. Either some tests didnt pass, or even worse - there are no tests.'));
                            return;
                        }

                        console.log(chalk.green('Testing done. The code works.'));
                        resolve();
                    } else {
                        reject(new Error('Testing failed. Either some tests didnt pass, or even worse - there are no tests.'));
                    }
                });

                server.on('browser_error', function () {
                    error = true;
                });

                server.on('karma_error', function () {
                    error = true;
                });

                server.on('load_error', function () {
                    error = true;
                });

                server.start();
            } catch (e) {
                reject(e);
            }
        });
    }

    return {
        test: test
    };
};
