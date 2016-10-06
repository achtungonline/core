const through = require('through2');
const watchify = require('watchify');
const EventEmitter = require('events').EventEmitter;
const stream = require('stream');
const glob = require('glob');
const browserify = require('browserify');
const path = require('path');
const xtend = require('xtend');

module.exports = function builderMaker() {
    // We want the browserify instances to share cache as much as we can (since it reduces the build times).
    // However, there is a problem when multiple ongoing processes (e.g., watchify) shares cache because then there is a race condition when the file is invalidated/rebuilt in the cache.
    // So an ongoing process may claim ownership of the cache (others may read from it, but may not write to it), so that there cannot be any write race conditions.
    // The functions getCache and getPackageCache are convenience functions to retrieve the cache objects if no ownership is claimed. If ownership is claimed, a copy of the cache is returned instead.
    var cacheOwnerShipClaimed = false;
    var cache = {};
    var packageCache = {};

    function clone(o) {
        return JSON.parse(JSON.stringify(o));
    }

    function getCache() {
        return cacheOwnerShipClaimed ? clone(cache) : cache;
    }

    function getPackageCache() {
        return cacheOwnerShipClaimed ? clone(packageCache) : packageCache;
    }

    function attachCacheSystem(browserify) {
        browserify.on('package', function (pkg) {
            var file = path.join(pkg.__dirname, 'package.json');
            if (packageCache) {
                packageCache[file] = pkg;
            }
        });

        browserify.pipeline.get('deps').push(through.obj(function (row, enc, next) {
            var file = row.expose ? browserify._expose[row.id] : row.file;
            cache[file] = {
                source: row.source,
                deps: xtend(row.deps)
            };
            this.push(row);
            next();
        }));
    }

    function buildModuleCode() {

        var b = browserify({
            entries: ['./main.js'],
            debug: true,
            cache: getCache(),
            packageCache: getPackageCache()
        });

        b
        .transform('babelify', { presets: ['es2015', 'react']});

        attachCacheSystem(b);

        return b.bundle();
    }

    function watchModuleCode() {
        var eventEmitter = new EventEmitter();

        var b = browserify({
            entries: ['./main.js'],
            debug: true,
            cache: getCache(),
            packageCache: getPackageCache(),
            plugin: [watchify]
        });

        cacheOwnerShipClaimed = true;

        function internalBundle() {
            return b.bundle();
        }

        b
        .transform('babelify', { presets: ['es2015', 'react']})
        .on('update', () => {
            eventEmitter.emit('updateBuild', internalBundle());
        });

        // Delay, otherwise it is impossible to catch this event since there are no listeners at this point.
        process.nextTick(function () {
            eventEmitter.emit('initialBuild', internalBundle());
        });

        return eventEmitter;
    }

    function buildTestCode() {
        var outputStream = new stream.PassThrough();

        glob('src/**/*spec.js', function (err, files) {
            if (err) {
                console.error(err);
                return;
            }

            var b = browserify({
                entries: files,
                debug: true,
                cache: getCache(),
                packageCache: getPackageCache()
            });

            b.
            transform('babelify', { presets: ['es2015', 'react']});

            attachCacheSystem(b);

            b.bundle().pipe(outputStream);
        });

        return outputStream;
    }

    function watchTestCode() {
        var eventEmitter = new EventEmitter();

        // TODO: Not enough for when files are added while watching.
        glob('src/**/*spec.js', function (err, files) {
            if (err) {
                console.error(err);
                return;
            }

            var b = browserify({
                entries: files,
                debug: true,
                cache: getCache(),
                packageCache: getPackageCache(),
                plugin: [watchify]
            });

            cacheOwnerShipClaimed = true;

            function internalBundle() {
                return b.bundle();
            }

            b
            .transform('babelify', { presets: ['es2015', 'react']})
            .on('update', () => {
                eventEmitter.emit('updateBuild', internalBundle());
            });

            process.nextTick(function () {
                eventEmitter.emit('initialBuild', internalBundle());
            });
        });

        return eventEmitter;
    }

    return {
        buildModuleCode: buildModuleCode,
        watchModuleCode: watchModuleCode,
        buildTestCode: buildTestCode,
        watchTestCode: watchTestCode
    };
};
