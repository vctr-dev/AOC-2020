const fs = require("fs");
const path = require("path");

function parseInput() {
	const input = fs
		.readFileSync(path.join(__dirname, "./input.txt"), { encoding: "utf-8" })
		.split("\n")
		.map((v) => +v)
		.sort((a, b) => a - b);
	return [0, ...input, input[input.length - 1] + 3];
}

function partOne(input) {
	let res = { 0: 0, 1: 0, 2: 0, 3: 0 };
	for (let i = 0; i < input.length - 1; i++) {
		const diff = input[i + 1] - input[i];
		res[diff]++;
	}
	return res[3] * res[1];
}

function partTwo(input, prevAns) {
	const numTouches = new Array(input.length).fill(0);
	numTouches[0] = 1;
	for (let i = 0; i < input.length - 1; i++) {
		for (let j = i + 1; j < input.length; j++) {
			if (input[j] - input[i] > 3) break;
			numTouches[j] += numTouches[i];
		}
	}
	return numTouches[numTouches.length - 1];
}

console.log(solution());

function solution() {
	const input = parseInput();
	const partOneAns = partOne(input);

	return { partOne: partOneAns, partTwo: partTwo(input, partOneAns) };
}
