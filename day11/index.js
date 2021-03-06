const fs = require("fs");
const path = require("path");

function parseInput() {
	const input = fs
		.readFileSync(path.join(__dirname, "./input.txt"), { encoding: "utf-8" })
		.split("\n")
		.map((v) => v.split(""));
	return input;
}

function sameLayout(a, b) {
	return a.every((r, i) => r.every((c, j) => c === b[i][j]));
}

function makeNewLayout(input) {
	return input.map((r, i) =>
		r.map((c, j) => {
			if (c === "L" && getNumAdjOccupied(input, i, j) === 0) {
				return "#";
			}
			if (c === "#" && getNumAdjOccupied(input, i, j) >= 4) {
				return "L";
			}
			return c;
		})
	);
}

function getNumAdjOccupied(input, r, c) {
	let t = 0;

	for (let i = Math.max(r - 1, 0); i < Math.min(r + 2, input.length); i++) {
		const row = input[i];
		for (let j = Math.max(c - 1, 0); j < Math.min(c + 2, row.length); j++) {
			if (i === r && c === j) continue;
			if (row[j] === "#") t++;
		}
	}
	return t;
}

function partOne(input) {
	let [o, n] = [input, makeNewLayout(input)];
	while (!sameLayout(o, n)) {
		[o, n] = [n, makeNewLayout(n)];
	}
	return o.reduce((a, r) => r.filter((c) => c === "#").length + a, 0);
}
function makeNewLayoutPartTwo(input) {
	return input.map((r, i) =>
		r.map((c, j) => {
			if (c === "L" && getLineOfSightOccupiedSeats(input, i, j) === 0) {
				return "#";
			}
			if (c === "#" && getLineOfSightOccupiedSeats(input, i, j) >= 5) {
				return "L";
			}
			return c;
		})
	);
}

function getLineOfSightOccupiedSeats(input, r, c) {
	let t = 0;
	let directions = [];
	for (let i = -1; i < 2; i++)
		for (let j = -1; j < 2; j++) directions.push([i, j]);
	directions
		.filter(([x, y]) => x !== 0 || y !== 0)
		.forEach(([ox, oy]) => {
			let [cx, cy] = [r + ox, c + oy];
			while (input[cx] && input[cx][cy]) {
				const point = input[cx][cy];
				if (point === "#") {
					t++;
					break;
				}
				if (point === "L") break;
				[cx, cy] = [cx + ox, cy + oy];
			}
		});
	return t;
}

function partTwo(input, prevAns) {
	let [o, n] = [input, makeNewLayoutPartTwo(input)];
	while (!sameLayout(o, n)) {
		[o, n] = [n, makeNewLayoutPartTwo(n)];
	}
	return o.reduce((a, r) => r.filter((c) => c === "#").length + a, 0);
}

console.log(solution());

function solution() {
	const input = parseInput();
	const partOneAns = partOne(input);

	return { partOne: partOneAns, partTwo: partTwo(input, partOneAns) };
}
