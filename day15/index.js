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
	const mem = {}; // shape number: {prev, prevprev}

	input.forEach((v, i) => (mem[v] = { prev: i + 1 }));
	let last = input[input.length - 1];
	for (let i = input.length + 1; i <= max; i++) {
		if (mem[last] && mem[last].prev && mem[last].prevprev) {
			last = mem[last].prev - mem[last].prevprev;
			mem[last] = { prev: i, prevprev: mem[last] && mem[last].prev };
			continue;
		}
		last = 0;
		mem[last] = { prev: i, prevprev: mem[last] && mem[last].prev };
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
