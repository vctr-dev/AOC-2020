const fs = require("fs");
const path = require("path");

function parseInput() {
	const input = fs
		.readFileSync(path.join(__dirname, "./input.txt"), { encoding: "utf-8" })
		.split("\n")
		.map((l) => {
			const [match, o, n] = /^([A-Z])(\d+)$/.exec(l);
			return { o, n: +n };
		});
	return input;
}

function partOne(input) {
	let d = [1, 0];
	let c = [
		[1, 0],
		[0, -1],
		[-1, 0],
		[0, 1],
	];
	let p = [0, 0];
	input.forEach(({ o, n }) => {
		if (o === "F") {
			p = [p[0] + d[0] * n, p[1] + d[1] * n];
		} else if (o === "N") {
			p[1] += n;
		} else if (o === "S") {
			p[1] -= n;
		} else if (o === "E") {
			p[0] += n;
		} else if (o === "W") {
			p[0] -= n;
		} else if (o === "L" || o === "R") {
			let i = c.findIndex((d1) => d1[0] === d[0] && d1[1] === d[1]);
			if (o === "L") {
				let r = i - n / 90;
				if (r < 0) r += c.length;
				let i1 = r % c.length;
				d = c[i1];
			} else if (o === "R") {
				let i1 = (i + n / 90) % c.length;
				d = c[i1];
			}
		}
	});
	return Math.abs(p[0]) + Math.abs(p[1]);
}

function partTwo(input, prevAns) {
	let d = [1, 0];
	let c = [
		[1, 0],
		[0, -1],
		[-1, 0],
		[0, 1],
	];
	let wp = [10, 1]; // rel to ship
	let s = [0, 0];
	input.forEach(({ o, n }) => {
		if (o === "F") {
			s[0] += wp[0] * n;
			s[1] += wp[1] * n;
		} else if (o === "N") {
			wp[1] += n;
		} else if (o === "S") {
			wp[1] -= n;
		} else if (o === "E") {
			wp[0] += n;
		} else if (o === "W") {
			wp[0] -= n;
		} else if (o === "L" || o === "R") {
			let i1 = (n / 90) % c.length;
			if (o === "L") {
				for (let j = 0; j < i1; j++) {
					wp = [-wp[1], wp[0]];
				}
			} else if (o === "R") {
				for (let j = 0; j < i1; j++) {
					wp = [wp[1], -wp[0]];
				}
			}
		}
	});
	return Math.abs(s[0]) + Math.abs(s[1]);
}

console.log(solution());

function solution() {
	const input = parseInput();
	const partOneAns = partOne(input);

	return { partOne: partOneAns, partTwo: partTwo(input, partOneAns) };
}
