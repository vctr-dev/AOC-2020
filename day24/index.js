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
	// Doubled coordinate system
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
			let didFlip = false;
			if (isBlack && (numBlacks === 0 || numBlacks > 2)) {
				newTileMap.change(x, y, false);
				didFlip = true;
			}
			if (!isBlack && numBlacks === 2) {
				newTileMap.change(x, y, true);
				didFlip = true;
			}
		});

		return newTileMap;
	}

	change(x, y, isBlack) {
		this.tiles[`${x},${y}`] = isBlack;
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
		bounds.y.min -= 1;
		bounds.y.max += 1;
		bounds.x.min -= 2;
		bounds.x.max += 2;
		let evenRowMin;
		let oddRowMin;
		let evenRowMax;
		let oddRowMax;
		if (bounds.x.min % 2 === 0) {
			evenRowMin = bounds.x.min;
			oddRowMin = bounds.x.min + 1;
		} else {
			evenRowMin = bounds.x.min - 1;
			oddRowMin = bounds.x.min;
		}
		if (bounds.x.max % 2 === 0) {
			evenRowMax = bounds.x.max;
			oddRowMax = bounds.x.max + 1;
		} else {
			evenRowMax = bounds.x.max - 1;
			oddRowMax = bounds.x.max;
		}
		for (let y = bounds.y.min; y <= bounds.y.max; y++) {
			let minX, maxX;
			if (y % 2 === 0) {
				minX = evenRowMin;
				maxX = evenRowMax;
			} else {
				minX = oddRowMin;
				maxX = oddRowMax;
			}
			for (let x = minX; x <= maxX; x += 2) {
				fn(x, y);
			}
		}
	}

	toString(markX, markY) {
		let prevY;
		let cur = "";
		let allArray = [];
		this.forEach((x, y) => {
			if (prevY != y) {
				allArray.push(cur);
				prevY = y;
				cur = y % 2 ? " " : "";
			}
			if (markX === x && markY === y) {
				cur += "X";
			} else {
				cur += this.isBlackAtCoord(x, y) ? "1" : "0";
			}
			cur += " ";
		});
		allArray.push(cur);
		allArray.shift();
		return allArray.join("\n");
	}
	removeWhites() {
		this.tiles = Object.fromEntries(
			Object.entries(this.tiles).filter(([k, v]) => v)
		);
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
	for (let i = 0; i < 100; i++) {
		tileMap = tileMap.dayPassed();
		tileMap.removeWhites();
		console.log(`Day ${i + 1}: ${tileMap.numBlacks()}`);
	}
	return tileMap.numBlacks();
}

const run = [
	{
		file: "sample.txt",
		fn: partTwo,
	},
	{
		file: "input.txt",
		fn: partTwo,
	},
];
solution();

function solution() {
	// Deal with input txt
	return run.forEach(({ file, fn }) => {
		console.log(`File: ${file}`);
		console.log(`Ans: ${fn(parseInput(file))}`);
	});
}
