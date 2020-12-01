const fs = require("fs");
const path = require("path");

const TARGET = 2020;
const maxDepth = 3;
const testFilePath = path.join(__dirname, "input.txt");

const numbers = fs
	.readFileSync(testFilePath, { encoding: "utf-8" })
	.split("\n")
	.map((n) => +n)
	.sort((a, b) => a - b);

const multiply = (arr) => arr.reduce((a, v) => a * v, 1);
const sum = (arr) => arr.reduce((a, v) => a + v, 0);

function getNumbers(nums, startIndex = 0, depth = 1, result = []) {
	if (depth > maxDepth) return;
	for (let i = startIndex; i < nums.length - (maxDepth - depth); i++) {
		const newResult = [...result, nums[i]];
		const total = sum(newResult);

		if (total > TARGET) return;
		if (depth === maxDepth && total === TARGET) return newResult;

		const maybeResult = getNumbers(nums, i + 1, depth + 1, newResult);
		if (maybeResult) return maybeResult;
	}
}

console.log(multiply(getNumbers(numbers)));
