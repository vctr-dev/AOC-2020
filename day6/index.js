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
	return [...new Set(group.replace(/\n/g, "").split(""))].length;
}

function partTwo(group) {
	const groupLength = group.split("\n").length;
	const answerTally = group
		.replace(/\n/g, "")
		.split("")
		.reduce((a, v) => ({ ...a, [v]: a[v] + 1 || 1 }), {});
	return Object.values(answerTally).filter((v) => v === groupLength).length;
}

console.log(solution());
