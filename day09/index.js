const fs = require("fs");
const { maxHeaderSize } = require("http");
const path = require("path");

function parseInput() {
	const input = fs
		.readFileSync(path.join(__dirname, "./input.txt"), { encoding: "utf-8" })
		.split("\n")
		.map((n) => +n);
	return input;
}

function partOne(input) {
	for (let i = 25; i <= input.length; i++) {
		const preamble = input.slice(i - 25, i);
		const num = input[i];
		let found = false;
		for (let j = 0; j <= preamble.length; j++) {
			const rest = [...preamble];
			rest.splice(j, 1);
			if (rest.includes(num - preamble[j])) {
				found = true;
				break;
			}
		}
		if (!found) {
			return num;
		}
	}
}

function partTwo(input) {
	const num = 248131121;
	let start, end;
	outer: for (let i = 0; i <= input.length - 1; i++) {
		let sum = input[i];
		inner: for (let j = i + 1; j <= input.length - 1; j++) {
			sum += input[j];
			if (sum === num) {
				start = i;
				end = j;
				break outer;
			}
			if (sum > num) {
				break inner;
			}
		}
	}

	const result = input.slice(start, end + 1);
	return Math.max(...result) + Math.min(...result);
}

console.log(solution());

function solution() {
	const input = parseInput();

	return { partOne: partOne(input), partTwo: partTwo(input) };
}
