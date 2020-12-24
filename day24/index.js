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
	constructor() {
		this.tiles = {};
	}

	copy() {
		const newTileMap = new TileMap();
		newTileMap.tiles = { ...this.tiles };
		return newTileMap;
	}

	dayPassed() {
		const newTileMap = this.copy();

		// iterate through and set coorditions
		this.forEach((x, y) => {
			const isBlack = this.isBlackAtCoord(x, y);
			const numBlacks = this.numBlackAround(x, y);
			if (isBlack && (numBlacks === 0 || numBlacks >= 2)) {
				newTileMap.flip(x, y);
			}
			if (!isBlack && numBlacks === 2) {
				console.log(x, y, numBlacks);
				newTileMap.flip(x, y);
			}
		});

		return newTileMap;
	}

	numBlackAround(x, y) {
		const around = ["e", "w", "ne", "se", "nw", "sw"];
		return around
			.map((d) => this.getCoordInDirection(d, [x, y]))
			.map(([x, y]) => this.isBlackAtCoord(x, y))
			.filter(Boolean).length;
	}

	isBlackAtCoord(x, y) {
		return !!this.tiles[`${x},${y}`];
	}

	flip(x, y) {
		this.tiles[`${x},${y}`] = !this.isBlackAtCoord(x, y);
	}

	getCoordInDirection(direction, origin = [0, 0]) {
		return {
			e: (x, y) => [x + 2, y],
			w: (x, y) => [x - 2, y],
			ne: (x, y) => [x + 1, y - 1],
			se: (x, y) => [x + 1, y + 1],
			nw: (x, y) => [x - 1, y - 1],
			sw: (x, y) => [x - 1, y + 1],
		}[direction](...origin);
	}
	getCoord(directions, origin = [0, 0]) {
		let [x, y] = origin;
		directions.forEach((direction) => {
			[x, y] = this.getCoordInDirection(direction, [x, y]);
		});
		return [x, y];
	}
	numBlacks() {
		return Object.values(this.tiles).filter(Boolean).length;
	}

	getBounds() {
		let boundsX = { min: Infinity, max: -Infinity };
		let boundsY = { min: Infinity, max: -Infinity };
		Object.keys(this.tiles).forEach((coordStr) => {
			const [x, y] = coordStr.split(",");
			boundsX.min = Math.min(x, boundsX.min);
			boundsY.min = Math.min(y, boundsY.min);
			boundsX.max = Math.max(x, boundsX.max);
			boundsY.max = Math.max(y, boundsY.max);
		});

		return { x: boundsX, y: boundsY };
	}

	forEach(fn) {
		const bounds = this.getBounds();
		for (let y = bounds.y.min; y <= bounds.y.max; y++) {
			let minX;
			if (y % 2) {
				if (bounds.x.min % 2) {
					minX = bounds.x.min;
				} else {
					minX = bounds.x.min - 1;
				}
			} else {
				if (bounds.x.min % 2) {
					minX = bounds.x.min - 1;
				} else {
					minX = bounds.x.min;
				}
			}
			for (let x = minX; x <= bounds.x.max; x += 2) {
				fn(x, y);
			}
		}
	}

	toString() {
		let prevY;
		let cur = "";
		let allArray = [];
		this.forEach((x, y) => {
			if (prevY != y) {
				allArray.push(cur);
				prevY = y;
				cur = y % 2 ? "" : " ";
			}
			cur += this.isBlackAtCoord(x, y) ? "1" : "0";
			cur += " ";
		});
		allArray.push(cur);
		allArray.shift();
		return allArray.join("\n");
	}
}
function partOne(directionSets) {
	const tileMap = getTileMap(directionSets);
	return tileMap.numBlacks();
}

function getTileMap(directionSets) {
	const tileMap = new TileMap();
	directionSets.forEach((directions) => {
		const [x, y] = tileMap.getCoord(directions);
		tileMap.flip(x, y);
	});
	return tileMap;
}

function partTwo(directionSets) {
	let tileMap = getTileMap(directionSets);
	console.log(tileMap.toString());
	for (let i = 0; i < 1; i++) {
		console.log(`Day ${i + 1}`);
		tileMap = tileMap.dayPassed();
	}
	console.log(tileMap.toString());
	return tileMap.numBlacks();
}

const run = [
	{
		file: "sample.txt",
		fn: partTwo,
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
