const fs = require("fs");
const path = require("path");

function parseInput(file) {
	let input = fs
		.readFileSync(path.join(__dirname, file), { encoding: "utf-8" })
		.split("\n")
		.map((line) => processLine(line));
	return input;
}

function processLine(line) {
	const splitLine = line.split("");

	let res = [];
	let prev = splitLine[0];
	splitLine.slice(1).forEach((c) => {
		if (
			prev.length === 2 ||
			c === "n" ||
			c === "s" ||
			((c === "w" || c === "e") && (prev === "w" || prev === "e"))
		) {
			res.push(prev);
			prev = c;
		} else {
			prev += c;
		}
	});
	res.push(prev);
	const verify = res.join("") === line;
	return res;
}

class TileMap {
	tiles = {}
	flip(x, y) {
		this.tiles[`${x},${y}`] = !this.tiles[`${x},${y}`];
	}
	getCoordInDirection(direction, origin=[0,0]){
		return {
			e: (x, y) => [x+2, y],
			w: (x, y) => [x-2, y],
			ne: (x, y) => [x+1, y-1],
			se: (x, y) => [x+1, y+1],
			nw: (x, y) => [x-1, y-1],
			sw: (x, y) => [x-1, y+1],

		}[direction](...origin)

	}
	getCoord(directions, origin = [0, 0]) {
		let [x, y] = origin;
		directions.forEach((direction) => {
			[x, y] = this.getCoordInDirection(direction, [x, y])
		})
		return [x, y]
	}
	numBlacks() {
		return (Object.values(this.tiles).filter(Boolean).length)
	}
}
function partOne(directionSets) {
	const tileMap = getTileMap(directionSets)
	return tileMap.numBlacks()
}

function getTileMap(directionSets){
	const tileMap = new TileMap();
	directionSets.forEach(directions => {
		const [x, y] = tileMap.getCoord(directions)
		tileMap.flip(x, y)
	})
	return tileMap
}

function partTwo(cups) {
	const tileMap = getTileMap()

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
