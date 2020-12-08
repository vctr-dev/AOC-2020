const fs = require("fs");
const path = require("path");

function parseInput() {
	return fs
		.readFileSync(path.join(__dirname, "./input.txt"), { encoding: "utf-8" })
		.split("\n")
		.map((line) => {
			const [action, num] = line.split(" ");
			return { action, q: +num };
		});
}

function partOne(input) {
	return getAcc(input).acc;
}

function partTwo(input) {
	for (let i = 0; i < input.length; i++) {
		const newInput = [...input.map((n) => ({ ...n }))];
		switch (newInput[i].action) {
			case "jmp":
				newInput[i].action = "nop";
				break;
			case "nop":
				newInput[i].action = "jmp";
				break;
		}
		const { isLoop, acc } = getAcc(newInput);
		if (!isLoop) return acc;
	}
}

function getAcc(input) {
	let i = 0;
	const prev = new Set();
	let acc = 0;
	while (!prev.has(i) && i < input.length) {
		prev.add(i);
		const { action, q } = input[i];
		if (action === "nop") i++;
		if (action === "jmp") i += q;
		if (action === "acc") {
			acc += q;
			i++;
		}
	}
	return { isLoop: i < input.length, acc };
}

console.log(solution());

function solution() {
	const input = parseInput();

	return { partOne: partOne(input), partTwo: partTwo(input) };
}
