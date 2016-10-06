const chalk = require('chalk');
const eslint = require('eslint');

module.exports = function () {
    function lint(globs) {
        return new Promise(function (resolve, reject) {
            var CLIEngine = eslint.CLIEngine;

            var cli = new CLIEngine();

            var report = cli.executeOnFiles(globs);

            var formatter = cli.getFormatter();

            console.log(formatter(report.results));

            if (report.errorCount || report.warningCount) {
                reject();
                return;
            }

            console.log(chalk.green('Linting done. The code is beautiful.'));
            resolve();
        });
    }

    return {
        lint: lint
    };
};
