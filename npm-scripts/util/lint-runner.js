const chalk = require("chalk");
const eslint = require("eslint");

module.exports = function () {
    function lint(globs) {
        return new Promise(function (resolve, reject) {
            var CLIEngine = eslint.CLIEngine;

            var cli = new CLIEngine({
                //'ecmaFeatures': {
                //    'arrowFunctions': true,
                //    'blockBindings': true,
                //    'classes': true,
                //    'defaultParams': true,
                //    'destructuring': true,
                //    'forOf': true,
                //    'generators': false,
                //    'modules': true,
                //    'objectLiteralComputedProperties': true,
                //    'objectLiteralDuplicateProperties': false,
                //    'objectLiteralShorthandMethods': true,
                //    'objectLiteralShorthandProperties': true,
                //    'restParams': true,
                //    'spread': true,
                //    'superInFunctions': true,
                //    'templateStrings': true
                //},
                //'plugins': ['react'],
                //'parserOptions': {
                //    'ecmaVersion': 6,
                //    'sourceType': 'module',
                //    'ecmaFeatures': {
                //        'jsx': true,
                //        "arrowFunctions": true,
                //        "modules": true
                //    }
                //},
                //// View link below for react rules documentation
                //// https://github.com/yannickcr/eslint-plugin-react#list-of-supported-rules
                //'rules': {
                //    // enforces no braces where they can be omitted
                //    // http://eslint.org/docs/rules/arrow-body-style
                //    'arrow-body-style': [
                //        2, 'as-needed'
                //    ],
                //    // require parens in arrow function arguments
                //    'arrow-parens': 0,
                //    // require space before/after arrow function's arrow
                //    // https://github.com/eslint/eslint/blob/master/docs/rules/arrow-spacing.md
                //    'arrow-spacing': [
                //        2, {
                //            'before': true,
                //            'after': true
                //        }
                //    ],
                //    // verify super() callings in constructors
                //    'constructor-super': 0,
                //    // enforce the spacing around the * in generator functions
                //    'generator-star-spacing': 0,
                //    // disallow modifying variables of class declarations
                //    'no-class-assign': 0,
                //    // disallow modifying variables that are declared using const
                //    'no-const-assign': 2,
                //    // disallow to use this/super before super() calling in constructors.
                //    'no-this-before-super': 0,
                //    // require let or const instead of var
                //    'no-var': 0,
                //    // require method and property shorthand syntax for object literals
                //    // https://github.com/eslint/eslint/blob/master/docs/rules/object-shorthand.md
                //    'object-shorthand': 0,
                //    // suggest using arrow functions as callbacks
                //    'prefer-arrow-callback': 0,
                //    // suggest using of const declaration for variables that are never modified after declared
                //    'prefer-const': 2,
                //    // suggest using the spread operator instead of .apply()
                //    'prefer-spread': 0,
                //    // suggest using Reflect methods where applicable
                //    'prefer-reflect': 0,
                //    // suggest using template literals instead of string concatenation
                //    // http://eslint.org/docs/rules/prefer-template
                //    'prefer-template': 0,
                //    // disallow generator functions that do not have yield
                //    'require-yield': 0,
                //
                //    // Prevent missing displayName in a React component definition
                //    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/display-name.md
                //    'react/display-name': [
                //        0, {
                //            'ignoreTranspilerName': true
                //        }
                //    ],
                //    // Forbid certain propTypes (any, array, object)
                //    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/forbid-prop-types.md
                //    'react/forbid-prop-types': [
                //        0, {
                //            'forbid': ['any', 'array', 'object']
                //        }
                //    ],
                //    // Enforce boolean attributes notation in JSX
                //    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-boolean-value.md
                //    'react/jsx-boolean-value': [
                //        2, 'never'
                //    ],
                //    // Validate closing bracket location in JSX
                //    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-closing-bracket-location.md
                //    'react/jsx-closing-bracket-location': [
                //        0, {
                //            selfClosing: 'after-props',
                //            nonEmpty: 'after-props'
                //        }
                //    ],
                //    // Enforce or disallow spaces inside of curly braces in JSX attributes
                //    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-curly-spacing.md
                //    'react/jsx-curly-spacing': [
                //        0,
                //        'never', {
                //            'allowMultiline': true
                //        }
                //    ],
                //    // Enforce event handler naming conventions in JSX
                //    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-handler-names.md
                //    'react/jsx-handler-names': [
                //        0, {
                //            'eventHandlerPrefix': 'handle',
                //            'eventHandlerPropPrefix': 'on'
                //        }
                //    ],
                //    // Validate props indentation in JSX
                //    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-indent-props.md
                //    'react/jsx-indent-props': [
                //        0, 4
                //    ],
                //    // Validate JSX has key prop when in array or iterator
                //    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-key.md
                //    'react/jsx-key': 1,
                //    // Limit maximum of props on a single line in JSX
                //    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-max-props-per-line.md
                //    'react/jsx-max-props-per-line': [
                //        0, {
                //            'maximum': 1
                //        }
                //    ],
                //    // Prevent usage of .bind() and arrow functions in JSX props
                //    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-no-bind.md
                //    'react/jsx-no-bind': 0,
                //    // Prevent duplicate props in JSX
                //    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-no-duplicate-props.md
                //    'react/jsx-no-duplicate-props': [
                //        0, {
                //            'ignoreCase': false
                //        }
                //    ],
                //    // Enforce spaces before the closing bracket of self-closing JSX elements.
                //    'react/jsx-space-before-closing': 0,
                //    // Prevent usage of unwrapped JSX strings
                //    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-no-literals.md
                //    'react/jsx-no-literals': 0,
                //    // Disallow undeclared variables in JSX
                //    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-no-undef.md
                //    'react/jsx-no-undef': 2,
                //    // Enforce PascalCase for user-defined JSX components
                //    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-pascal-case.md
                //    'react/jsx-pascal-case': 2,
                //    // Enforce propTypes declarations alphabetical sorting
                //    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-sort-prop-types.md
                //    'react/sort-prop-types': [
                //        0, {
                //            'ignoreCase': false,
                //            'callbacksLast': false
                //        }
                //    ],
                //    // Enforce props alphabetical sorting
                //    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-sort-props.md
                //    'react/jsx-sort-props': [
                //        0, {
                //            'ignoreCase': false,
                //            'callbacksLast': false
                //        }
                //    ],
                //    // Prevent React to be incorrectly marked as unused
                //    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-uses-react.md
                //    'react/jsx-uses-react': [
                //        2, {
                //            'pragma': 'React'
                //        }
                //    ],
                //    // Prevent variables used in JSX to be incorrectly marked as unused
                //    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-uses-vars.md
                //    'react/jsx-uses-vars': 2,
                //    // Prevent usage of dangerous JSX properties
                //    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-danger.md
                //    'react/no-danger': 0,
                //    // Prevent usage of deprecated methods
                //    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-deprecated.md
                //    'react/no-deprecated': [
                //        1, {
                //            'react': '0.14.0'
                //        }
                //    ],
                //    // Prevent usage of setState in componentDidMount
                //    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-did-mount-set-state.md
                //    'react/no-did-mount-set-state': [
                //        0, 'allow-in-func'
                //    ],
                //    // Prevent usage of setState in componentDidUpdate
                //    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-did-update-set-state.md
                //    'react/no-did-update-set-state': [
                //        0, 'allow-in-func'
                //    ],
                //    // Prevent direct mutation of this.state
                //    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-direct-mutation-state.md
                //    'react/no-direct-mutation-state': 2,
                //    // Prevent usage of isMounted
                //    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-is-mounted.md
                //    'react/no-is-mounted': 2,
                //    // Prevent multiple component definition per file
                //    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-multi-comp.md
                //    'react/no-multi-comp': [
                //        0, {
                //            'ignoreStateless': true
                //        }
                //    ],
                //    // Prevent usage of setState
                //    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-set-state.md
                //    'react/no-set-state': 0,
                //    // Prevent using string references
                //    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-string-refs.md
                //    'react/no-string-refs': 0,
                //    // Prevent usage of unknown DOM property
                //    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-unknown-property.md
                //    'react/no-unknown-property': 2,
                //    // Require ES6 class declarations over React.createClass
                //    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/prefer-es6-class.md
                //    'react/prefer-es6-class': [
                //        0, 'always'
                //    ],
                //    // Prevent missing props validation in a React component definition
                //    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/prop-types.md
                //    'react/prop-types': [
                //        0, {
                //            'ignore': [],
                //            customValidators: []
                //        }
                //    ],
                //    // Prevent missing React when using JSX
                //    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/react-in-jsx-scope.md
                //    'react/react-in-jsx-scope': 2,
                //    // Restrict file extensions that may be required
                //    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/require-extension.md
                //    'react/require-extension': [
                //        0, {
                //            'extensions': ['.jsx']
                //        }
                //    ],
                //    // Prevent extra closing tags for components without children
                //    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/self-closing-comp.md
                //    'react/self-closing-comp': 2,
                //    // Enforce component methods order
                //    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/sort-comp.md
                //    'react/sort-comp': [
                //        1, {
                //            'order': [
                //                'static-lifecycle',
                //                'beforeRender',
                //                'rendering',
                //                'afterRender',
                //                '/^on.+$/',
                //                'everything-else'
                //            ],
                //            'groups': {
                //                'static-lifecycle': [
                //                    'displayName',
                //                    'propTypes',
                //                    'contextTypes',
                //                    'childContextTypes',
                //                    'mixins',
                //                    'statics',
                //                    'defaultProps',
                //                    'constructor',
                //                    'getDefaultProps',
                //                    'getInitialState',
                //                    'state',
                //                    'getChildContext'
                //                ],
                //                'rendering': [
                //                    'render'
                //                ],
                //                'beforeRender': [
                //                    'componentWillMount', 'componentWillReceiveProps', 'shouldComponentUpdate', 'componentWillUpdate'
                //                ],
                //                'afterRender': ['componentDidMount', 'componentDidUpdate', 'componentWillUnmount']
                //            }
                //        }
                //    ],
                //    // Prevent missing parentheses around multilines JSX
                //    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/wrap-multilines.md
                //    'react/jsx-wrap-multilines': [
                //        2, {
                //            declaration: true,
                //            assignment: true,
                //            return: true
                //        }
                //    ]
                //},
                //"env": {
                //    "browser": true,
                //    'es6': true
                //}
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
