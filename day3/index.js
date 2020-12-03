const fs = require("fs");
const path = require("path");

function getInput() {
	return fs
		.readFileSync(path.join(__dirname, "./input.txt"), { encoding: "utf-8" })
		.split("\n")
		.filter((line) => line);
}

function solution() {
	const input = getInput();
	return [
		{ x: 1, y: 1 },
		{ x: 3, y: 1 },
		{ x: 5, y: 1 },
		{ x: 7, y: 1 },
		{ x: 1, y: 2 },
	]
		.map((offset) => {
			let x = 0;
			return input.reduce((numTrees, line, i) => {
				if (i % offset.y !== 0) return numTrees;

				const didHitTree = line[x] === "#";
				x = (x + offset.x) % line.length;
				return didHitTree ? numTrees + 1 : numTrees;
			}, 0);
		})
		.reduce((a, v) => a * v, 1);
}

console.log(solution());
