const fs = require("fs");
const path = require("path");

function parseInput(file) {
	const input = fs
		.readFileSync(path.join(__dirname, file), { encoding: "utf-8" })
		.split("\n")
		.reduce((acc, v) => {
			if (v.startsWith("mask")) return [...acc, [v]];
			acc[acc.length - 1].push(v);
			return acc;
		}, [])
		.map(([mask, ...mems]) => {
			mask = mask.split(" = ")[1];
			mems = mems.map((mem) => {
				const [match, addr, val] = /^mem\[(\d+)\] = (\d+)$/.exec(mem);
				return {
					addr: +addr,
					val: +val,
				};
			});
			return { mask, mems };
		});
	return input;
}

function valToString(val, mask) {
	return val.toString(2).padStart(mask.length, 0);
}
function applyMask(mask, val) {
	return parseInt(
		valToString(val, mask)
			.split("")
			.map((v, i) => (mask[i] === "X" ? v : mask[i]))
			.join(""),
		2
	);
}

function partOne(input) {
	const memSpace = {};
	input.forEach(({ mask, mems }) => {
		mems.forEach(({ addr, val }) => (memSpace[addr] = applyMask(mask, val)));
	});

	return Object.values(memSpace).reduce((a, v) => a + v, 0);
}

function partTwo(input, prevAns) {
	const memSpace = {};
	input.forEach(({ mask, mems }) => {
		mems.forEach(({ addr, val }) => {
			getAddresses(mask, addr).forEach((address) => {
				memSpace[address] = val;
			});
		});
	});
	return Object.values(memSpace).reduce((a, v) => a + v, 0);
}

function getAddresses(mask, val) {
	const applied = valToString(val, mask)
		.split("")
		.map((v, i) => (mask[i] === "0" ? v : mask[i]))
		.join("");
	const mayHaveFloat = [applied];
	const noFloat = [];
	while (mayHaveFloat.length != 0) {
		const cur = mayHaveFloat.pop().split("");
		const i = cur.findIndex((c) => c === "X");
		if (i < 0) {
			noFloat.push(cur.join(""));
			continue;
		}
		["0", "1"].forEach((x) => {
			cur[i] = x;
			mayHaveFloat.push(cur.join(""));
		});
	}
	return noFloat.map((v) => parseInt(v, 2));
}

console.table(solution());

function solution() {
	return ["sample.txt", "input.txt"].map((file) => {
		const input = parseInput(file);
		const partOneAns = partOne(input);

		return { file, partOne: partOneAns, partTwo: partTwo(input, partOneAns) };
	});
}
