const glob = require('glob');

module.exports = function mutliglob(globs, options, cb) {
	if (!cb) {
		cb = options;
		options = {};
	}

	var aborted = false;
	var allFiles = [];

	var globStatuses = (new Array(globs.length)).fill(false);

	globs.forEach((g, i) => {
		glob(g, options, (err, files) => {
			if (err) {
				if (!aborted) {
					aborted = true;
					cb(err);
				}
				return;
			}

			allFiles = allFiles.concat(files);
			globStatuses[i] = true;

			if (!globStatuses.some((v) => !v)) {
				cb(null, allFiles);
			}
		});
	});
};
