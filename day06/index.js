const fs = require("fs");
const path = require("path");

function getInput() {
	return fs
		.readFileSync(path.join(__dirname, "./input.txt"), { encoding: "utf-8" })
		.split("\n\n");
}

function solution() {
	const input = getInput();
	return input.map(partTwo).reduce((a, v) => a + v, 0);
}

function partOne(group) {
	return Object.keys(getAnswerTally(group)).length;
}

function partTwo(group) {
	const groupLength = group.split("\n").length;
	return Object.values(getAnswerTally(group)).filter((v) => v === groupLength)
		.length;
}

function getAnswerTally(group) {
	return group
		.replace(/\n/g, "")
		.split("")
		.reduce((a, v) => ({ ...a, [v]: a[v] + 1 || 1 }), {});
}

console.log(solution());
