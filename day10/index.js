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
	const numTouches = [];
	input.forEach((v, i) => (numTouches[i] = 0));
	numTouches[0] = 1;
	input.forEach((v, i) => {
		numTouches[i + 1] += numTouches[i];
		// try skip 1
		const skipOne = input[i + 2];
		if (skipOne && skipOne - v <= 3) {
			numTouches[i + 2] += numTouches[i];
		}
		// try skip 2
		const skipTwo = input[i + 3];
		if (skipTwo && skipTwo - v <= 3) {
			numTouches[i + 3] += numTouches[i];
		}
	});
	return numTouches[numTouches.length - 2];
}

console.log(solution());

function solution() {
	const input = parseInput();
	const partOneAns = partOne(input);

	return { partOne: partOneAns, partTwo: partTwo(input, partOneAns) };
}
