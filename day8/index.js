const fs = require("fs");
const path = require("path");

function parseInput() {
	return fs
		.readFileSync(path.join(__dirname, "./input.txt"), { encoding: "utf-8" })
		.split("\n")
		.map((line) => {
			const [action, num] = line.split(" ");
			const [match, sign, q] = /^(\+|-)(\d+)$/.exec(num);
			return { action, q: +q * (sign === "+" ? 1 : -1) };
		});
}

function partOne(input) {
	let index = 0;
	const prevRanIndex = new Set();
	let acc = 0;
	while (!prevRanIndex.has(index)) {
		prevRanIndex.add(index);
		const { action, q } = input[index];
		if (action === "nop") index++;
		if (action === "jmp") index += q;
		if (action === "acc") {
			acc += q;
			index++;
		}
	}
	return acc;
}

function partTwo(input) {
	const copyInput = (ipt) => [...ipt.map((n) => ({ ...n }))];
	for (let i = 0; i < input.length; i++) {
		const newInput = copyInput(input);
		if (newInput[i].action === "acc") continue;
		if (newInput[i].action === "jmp") {
			newInput[i].action = "nop";
		} else {
			newInput[i].action = "jmp";
		}
		const { isLoop: isALoop, acc } = isLoop(newInput);
		if (!isALoop) return acc;
	}
}

function isLoop(input) {
	let index = 0;
	const prevRanIndex = new Set();
	let acc = 0;
	while (!prevRanIndex.has(index) && index < input.length) {
		prevRanIndex.add(index);
		const { action, q } = input[index];
		if (action === "nop") index++;
		if (action === "jmp") index += q;
		if (action === "acc") {
			acc += q;
			index++;
		}
	}
	return { isLoop: index < input.length, acc };
}

console.log(solution());

function solution() {
	const input = parseInput();

	return { partOne: partOne(input), partTwo: partTwo(input) };
}
