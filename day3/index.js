const fs = require("fs");
const path = require("path");

function getInput() {
	return fs
		.readFileSync(path.join(__dirname, "./input.txt"), { encoding: "utf-8" })
		.split("\n");
}

function solution() {
	const input = getInput();
	let offsets = [
		{ x: 1, y: 1 },
		{ x: 3, y: 1 },
		{ x: 5, y: 1 },
		{ x: 7, y: 1 },
		{ x: 1, y: 2 },
	];
	let results = [];
	offsets.forEach((offset) => {
		let numTrees = 0;
		let x = 0;
		input.forEach((line, i) => {
			if (i % offset.y === 0) {
				if (line[x] === "#") numTrees++;
				x = (x + offset.x) % line.length;
			}
		});
		results.push(numTrees);
	});
	return results.reduce((a, v) => a * v, 1);
}

console.log(solution());
