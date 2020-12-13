const fs = require("fs");
const path = require("path");

const file = process.env.RUN_SAMPLE ? "sample.txt" : "input.txt";
function parseInput() {
	const input = fs
		.readFileSync(path.join(__dirname, file), { encoding: "utf-8" })
		.split("\n");
	const [ts, b] = input;
	return {
		ts: +ts,
		b: b.split(",").map((c) => (isNaN(+c) ? c : +c)),
	};
}

function partOne({ ts, b }) {
	const { diff, bus } = b
		.filter((c) => c !== "x")
		.map((bus) => ({ diff: Math.ceil(ts / bus) * bus - ts, bus }))
		.reduce((acc, v) => (acc.diff < v.diff ? acc : v));
	return diff * bus;
}

function partTwo({ b }, prevAns) {
	b = b
		.map((b1, i) => {
			if (b1 === "x") return;
			return { n: b1, o: i };
		})
		.filter(Boolean)
		.sort((a, b) => -a.n + b.n);
	let ts, currentLcm;
	{
		let { n, o } = b.shift();
		ts = n - o;
		currentLcm = n;
	}
	b.forEach(({ n, o }) => {
		while ((ts + o) % n !== 0) {
			ts += currentLcm;
		}
		currentLcm *= n;
	});
	return ts;
}

console.log(solution());

function solution() {
	const input = parseInput();
	const partOneAns = partOne(input);

	return { partOne: partOneAns, partTwo: partTwo(input, partOneAns) };
}
