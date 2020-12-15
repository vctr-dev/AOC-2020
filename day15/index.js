const fs = require("fs");
const path = require("path");

function parseInput(file) {
	const input = fs
		.readFileSync(path.join(__dirname, file), { encoding: "utf-8" })
		.split(",")
		.map((v) => +v);
	return input;
}

function partOne(input) {
	const max = 30000000;
	const mem = {};

	input.forEach((v, i) => (mem[v] = i + 1));
	let last = input[input.length - 1];
	for (let i = input.length + 1; i <= max; i++) {
		let prev = mem[last];
		let latest = i - 1;
		mem[last] = latest;
		last = (prev && latest - prev) || 0;
	}
	return last;
}

console.table(solution());

function solution() {
	return ["sample.txt", "input.txt"].map((file) => {
		const input = parseInput(file);
		const partOneAns = partOne(input);

		return { file, partOne: partOneAns };
	});
}
