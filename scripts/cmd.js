#! /usr/bin/env node

const test = require("./test");
const watch = require("./watch");

const command = process.argv[2];
const rootPath = process.argv[3];

const commands = {
	"test": test,
	"watch": watch
};

const fn = commands[command];

if (fn) {
	fn(rootPath || "");
} else {
	console.error("Unknown command: " + command);
}
