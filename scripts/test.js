const Promise = require('promise');
const spawn = require('child_process').spawn;
const chalk = require('chalk');

const builder = require('./build');

function eslint() {
    return new Promise(function (resolve, reject) {
        console.log("Linting...");
        const eslintProcess = spawn('eslint', ['*.js', 'src/**/*.js', 'documentation/**/*.js'], { shell: true, stdio: 'inherit' });

        eslintProcess.on('close', (code) => {
            if (code) {
                reject();
            } else {
                resolve();
            }
        });
    });
}

module.exports = function build() {
    Promise.all([
        builder.buildTestCode()
    ]).then(function () {
        console.log('built everything.');

        eslint().then(function () {
            console.log(chalk.green('Your code is amazing :)'));
            console.log('NOTE: Since this command does not run the tests yet, please make sure to run the specrunner manually.');
        });
    });
}
