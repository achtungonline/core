const chalk = require("chalk");
const eslint = require("eslint");

module.exports = function () {
    function lint(globs) {
        return new Promise(function (resolve, reject) {
            var CLIEngine = eslint.CLIEngine;

            var cli = new CLIEngine({
                "env": {
                    "browser": true
                },
                "ecmaFeatures": {
                    "jsx": true,
                    "arrowFunctions": true,
                    "modules": true
                },
                "rules": {
                    "curly": 2,
                    "eqeqeq": 2,
                    "no-undef": 2,
                    "no-use-before-define": [2, "nofunc"],
                    "new-cap": 0,
                    "no-caller": 2,
                    "wrap-iife": 2,
                    "indent": [2, 4],
                    "no-trailing-spaces": 2
                }
            });

            var report = cli.executeOnFiles(globs);

            var formatter = cli.getFormatter();

            console.log(formatter(report.results));

            if (report.errorCount || report.warningCount) {
                reject();
                return;
            }

            console.log(chalk.green("Linting done. The code is beautiful."));
            resolve();
        });
    }

    return {
        lint: lint
    };
};
