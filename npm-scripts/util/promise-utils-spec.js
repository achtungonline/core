var Promise = require('promise');
var promiseUtils = require('./promise-utils');

const runSerially = promiseUtils.runSerially;

describe('promiseUtils', () => {
    describe('runSerially', () => {
        it('should resolve on empty array', function (done) {
            runSerially([]).then(done);
        });

        it('should run promise fns serially', function (done) {
            var output = '';

            function a() {
                return new Promise((resolve, reject) => {
                    output += 'a';
                    resolve();
                });
            }

            function b() {
                return new Promise((resolve, reject) => {
                    output += 'b';
                    resolve();
                });
            }

            runSerially([a, a, a, b, a, b, b]).then(() => {
                expect(output).toEqual('aaababb');
                done();
            });
        });

        it('should exit on reject', function (done) {
            var output = '';

            function a() {
                return new Promise((resolve, reject) => {
                    output += 'a';
                    resolve();
                });
            }

            function b() {
                return new Promise((resolve, reject) => {
                    output += 'b';
                    reject();
                });
            }

            runSerially([a, a, a, b, a, b, b]).then(null, () => {
                expect(output).toEqual('aaab');
                done();
            });
        });

        it('should exit on reject with err', function (done) {
            var output = '';

            function err() {
                return new Promise((resolve, reject) => {
                    reject('err');
                });
            }

            runSerially([err]).then(null, (err) => {
                expect(err).toEqual('err');
                done();
            });
        });

        it('should run promise fns serially also when async', function (done) {
            var output = '';

            function a() {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        output += 'a';
                        resolve();
                    }, 0);
                });
            }

            function b() {
                return new Promise((resolve, reject) => {
                    output += 'b';
                    resolve();
                });
            }

            runSerially([a, a, a, b, a, b, b]).then(() => {
                expect(output).toEqual('aaababb');
                done();
            });
        });
    });
});
