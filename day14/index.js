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
			.map((v, i) => {
				const m = mask[i];
				if (m === "X") {
					return v;
				}
				return m;
			})
			.join(""),
		2
	);
}

let runOnce = false;
function partOne(input) {
	// if (runOnce) return "skip";
	// runOnce = true;

	const memSpace = {};
	input.forEach(({ mask, mems }) => {
		mems.forEach(({ addr, val }) => (memSpace[addr] = applyMask(mask, val)));
	});

	return Object.values(memSpace).reduce((a, v) => a + v, 0);
}

function partTwo(input, prevAns) {
	// if (runOnce) return "skip";
	// runOnce = true;

	const memSpace = {};
	input.forEach(({ mask, mems }) => {
		mems.forEach(({ addr, val }) => {
			const addresses = getAddresses(mask, addr);
			addresses.forEach((address) => {
				memSpace[address] = val;
			});
		});
	});
	return Object.values(memSpace).reduce((a, v) => a + v, 0);
}

function getAddresses(mask, val) {
	const applied = valToString(val, mask)
		.split("")
		.map((v, i) => {
			let m = mask[i];
			if (m == "0") return v;
			return m;
		})
		.join("");
	const addressesWithFloat = [applied];
	const addressesWithoutFloat = [];
	while (addressesWithFloat.length != 0) {
		const cur = addressesWithFloat.pop().split("");
		const i = cur.findIndex((c) => c === "X");
		console.log(i);
		if (i < 0) {
			addressesWithoutFloat.push(cur.join(""));
			continue;
		}
		cur[i] = 0;
		addressesWithFloat.push(cur.join(""));
		cur[i] = 1;
		addressesWithFloat.push(cur.join(""));
	}
	return addressesWithoutFloat.map((v) => parseInt(v, 2));
}

console.table(solution());

function solution() {
	return ["sample.txt", "input.txt"].map((file) => {
		const input = parseInput(file);
		const partOneAns = partOne(input);

		return { file, partOne: partOneAns, partTwo: partTwo(input, partOneAns) };
	});
}
