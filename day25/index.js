const fs = require("fs");
const path = require("path");

function parseInput(file) {
	let [pubKeyDoor, pubKeyCard] = fs
		.readFileSync(path.join(__dirname, file), { encoding: "utf-8" })
		.split("\n")
		.map((v) => +v);
	return { pubKeyCard, pubKeyDoor };
}

function partOne({ pubKeyDoor, pubKeyCard }) {
	console.log(pubKeyDoor, pubKeyCard);
	const ls = getLoopSide(pubKeyDoor);

	const performLoop = makeLoop(pubKeyCard);
	let ek;
	for (let i = 0; i < ls; i++) {
		ek = performLoop();
	}

	return ek;
}

function getLoopSide(key) {
	let sn = 7;
	// for (let sn = 1; sn < max; sn++) {
	let performLoop = makeLoop(sn);
	let ls = 0;
	let v;
	while (v !== key) {
		v = performLoop();
		ls++;
	}
	return ls;
}

function makeLoop(sn) {
	let value = 1;
	return () => {
		value = (value * sn) % 20201227;
		return value;
	};
}

function partTwo(input) {
	return 2;
}

const run = [
	{
		file: "input.txt",
		fn: partOne,
	},
	// {
	// 	file: "input.txt",
	// 	fn: partTwo,
	// },
];
solution();

function solution() {
	// Deal with input txt
	return run.forEach(({ file, fn }) => {
		console.log(`File: ${file}`);
		console.log(`Ans: ${fn(parseInput(file))}`);
	});
}
