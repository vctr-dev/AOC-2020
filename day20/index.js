const fs = require("fs");
const path = require("path");

class Tile {
	// Tile is a string, separated by newline
	constructor(id, tile) {
		this.id = id;
		this.tile = tile;
	}

	// edges are read left to right, top to bottom
	get edges() {
		const lines = this.tile.split("\n");
		return {
			top: lines[0],
			bottom: lines[lines.length - 1],
			left: lines.map((line) => line[0]).join(""),
			right: lines.map((line) => line[line.length - 1]).join(""),
		};
	}

	canMatchEdge(incomingEdge) {
		return Object.values(this.edges).some((edge) => {
			return this.matchEdge(incomingEdge, edge);
		});
	}

	matchEdge(edge1, edge2) {
		return edge1 === edge2 || edge1 === reverseString(edge2);
	}

	tryToOrientateToMatchNeighbouringTiles(neighbouringTiles) {
		const [[direction, firstNeighbour], ...otherNeighbours] = Object.entries(
			neighbouringTiles
		);
		// Try to orientate to match first neighbour
		const neighbourEdge =
			firstNeighbour.edges[directions[direction].complement];

		for (let rotation = 0; rotation < 4; rotation++) {
			if (this.matchEdge(neighbourEdge, this.edges[direction])) {
				break;
			}
			this.rotateTile();
		}

		// Flip it if necessary
		if (neighbourEdge !== this.edges[direction]) {
			this.flip(direction === "left" || direction === "right" ? "x" : "y");
		}
		// Check if the rest edges matches
		const edges = this.edges;
		return otherNeighbours.every(([direction, neighbourTile]) => {
			return (
				edges[direction] ===
				neighbourTile.edges[directions[direction].complement]
			);
		});
	}

	flip(axis) {
		const lines = this.tile.split("\n");
		let newTile;
		if (axis === "x") {
			newTile = lines.reverse();
		} else {
			newTile = lines.map((line) => reverseString(line));
		}
		this.tile = newTile.join("\n");
	}

	rotateTile() {
		const arr = this.tile.split("\n");
		const newTile = [];
		const lineLength = arr[0].length;
		for (let i = 0; i < lineLength; i++) {
			newTile.push([]);
		}
		for (let i = 0; i < arr.length; i++) {
			let line = arr[i];
			for (let j = 0; j < lineLength; j++) {
				newTile[j].unshift(line[j]);
			}
		}
		this.tile = newTile.map((line) => line.join("")).join("\n");
	}
	tileWithoutBorder() {
		const tile = this.tile.split("\n");
		return tile
			.slice(1, tile.length - 1)
			.map((line) =>
				line
					.split("")
					.slice(1, line.length - 1)
					.join("")
			)
			.join("\n");
	}
	findMask(mask) {
		const lines = this.tile.split("\n");
		const maxMaskLength = Math.max(...mask.map((row) => row.length));
		const coord = [];
		for (let y = 0; y < lines.length - mask.length + 1; y++) {
			let line = lines[y];
			for (let x = 0; x < line.length - maxMaskLength + 1; x++) {
				const sample = this.createSample(x, y, mask);
				if (isMaskMatch(sample, mask)) coord.push(new Coordinate(x, y));
			}
		}
		return coord;
	}
	createSample(x, y, mask) {
		const res = [];
		const lines = this.tile.split("\n").slice(y, y + mask.length);
		mask.forEach((row, i) => {
			res.push(lines[i].substring(x, x + row.length));
		});
		return res;
	}
}

function isMaskMatch(sample, mask) {
	return mask.every((maskLine, i) => isMaskLineMatch(sample[i], maskLine));
}

function isMaskLineMatch(sample, mask) {
	return mask.split("").every((m, i) => {
		if (m === " ") {
			return true;
		}
		return m === sample[i];
	});
}

function reverseString(str) {
	return str.split("").reverse().join("");
}

const directions = {
	top: { complement: "bottom" },
	bottom: { complement: "top" },
	left: { complement: "right" },
	right: { complement: "left" },
};

class TileMap {
	constructor(initialTile) {
		this.tileMap = [
			new TileMapItem(
				initialTile,
				new Coordinate(0, 0),
				new Set(Object.keys(directions))
			),
		];
	}

	tryAddingTile(tile) {
		const possiblePositions = this.possibleNewPosition(tile);
		if (possiblePositions.length === 0) {
			return false;
		}

		for (let i = 0; i < possiblePositions.length; i++) {
			const possibleCoord = possiblePositions[i];
			const neighbouringTiles = Object.fromEntries(
				Object.entries(
					this.findNeighbourAtCoord(possibleCoord)
				).map(([direction, tileMapItem]) => [direction, tileMapItem.tile])
			);
			const canOrientate = tile.tryToOrientateToMatchNeighbouringTiles(
				neighbouringTiles
			);
			if (!canOrientate) {
				continue;
			}
			this.addTile(possibleCoord, tile);
			return true;
		}
	}

	addTile(coord, tile) {
		const neighbours = this.findNeighbourAtCoord(coord);

		const tileMapItem = new TileMapItem(
			tile,
			coord,
			new Set(
				Object.keys(directions).filter((direction) => !neighbours[direction])
			)
		);
		this.tileMap.push(tileMapItem);

		Object.entries(neighbours).forEach(([direction, tileMapItem]) => {
			tileMapItem.didAddNeighbourOn(directions[direction].complement);
		});
	}

	findNeighbourAtCoord(coord) {
		const neighbour = {};
		this.tileMap.forEach((tileMapItem) => {
			const edgesCoord = tileMapItem.edgesCoord;
			Object.entries(edgesCoord).forEach(([direction, tileMapItemCoord]) => {
				if (tileMapItemCoord.isEqual(coord)) {
					neighbour[directions[direction].complement] = tileMapItem;
				}
			});
		});
		return neighbour;
	}

	possibleNewPosition(tile) {
		const possiblePositions = [];
		this.tileMap.forEach((tileMapItem) => {
			const openEdges = tileMapItem.edges;
			const coord = tileMapItem.coord;
			Object.entries(openEdges).forEach(([direction, edge]) => {
				if (tile.canMatchEdge(edge)) {
					possiblePositions.push(coord[direction]);
				}
			});
		});
		return possiblePositions;
	}

	getCornerTiles() {
		let { x: boundX, y: boundY } = this.getBounds();
		let cornerCoordinates = [];
		Object.values(boundX).forEach((x) => {
			Object.values(boundY).forEach((y) => {
				cornerCoordinates.push(new Coordinate(x, y));
			});
		});
		return this.tileMap
			.filter((tileMapItem) =>
				cornerCoordinates.some((coord) => coord.isEqual(tileMapItem.coord))
			)
			.map((tileMapItem) => tileMapItem.tile);
	}

	getBounds() {
		let xValues = this.tileMap.map((tileMapItem) => tileMapItem.coord.x);
		let yValues = this.tileMap.map((tileMapItem) => tileMapItem.coord.y);
		return {
			x: {
				lower: Math.min(...xValues),
				upper: Math.max(...xValues),
			},

			y: {
				lower: Math.min(...yValues),
				upper: Math.max(...yValues),
			},
		};
	}
	generateTile() {
		// Layout tiles
		const sortedTileMap = this.tileMap
			.sort(
				(tileMapItem1, tileMapItem2) =>
					tileMapItem1.coord.x - tileMapItem2.coord.x
			)
			.sort(
				(tileMapItem1, tileMapItem2) =>
					tileMapItem1.coord.y - tileMapItem2.coord.y
			);
		const { x: boundsX, y: boundsY } = this.getBounds();
		const newTile = [];
		let i = 0;
		for (let y = boundsY.lower; y <= boundsY.upper; y++) {
			const row = [];
			for (let x = boundsX.lower; x <= boundsX.upper; x++) {
				row.push(sortedTileMap[i].tile);
				i++;
			}
			newTile.unshift(row);
		}
		const tileString = newTile
			.map((row) => row.map((tile) => tile.tileWithoutBorder()))
			.map((row) => {
				const lines = row.map((line) => line.split("\n"));
				let combined = [];
				for (let i = 0; i < lines[0].length; i++) {
					const combinedLine = [];
					lines.forEach((line) => {
						combinedLine.push(line[i]);
					});
					combined.push(combinedLine.join(""));
				}
				return combined.join("\n");
			})
			.join("\n");
		return new Tile(undefined, tileString);
	}
}

class TileMapItem {
	constructor(tile, coord, exposedDirections) {
		this.tile = tile;
		this.coord = coord;
		this.exposedDirections = exposedDirections;
	}

	get edges() {
		return Object.fromEntries(
			Object.entries(this.tile.edges).filter(([direction]) =>
				this.exposedDirections.has(direction)
			)
		);
	}

	get edgesCoord() {
		const openEdgesCoord = {};

		[...this.exposedDirections].forEach((direction) => {
			openEdgesCoord[direction] = this.coord[direction];
		});
		return openEdgesCoord;
	}
	didAddNeighbourOn(direction) {
		this.exposedDirections.delete(direction);
	}
}

class Coordinate {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	get top() {
		return new Coordinate(this.x, this.y + 1);
	}
	get bottom() {
		return new Coordinate(this.x, this.y - 1);
	}
	get left() {
		return new Coordinate(this.x - 1, this.y);
	}
	get right() {
		return new Coordinate(this.x + 1, this.y);
	}
	isEqual(coord) {
		return this.x == coord.x && this.y == coord.y;
	}
}
function parseInput(file) {
	let input = fs
		.readFileSync(path.join(__dirname, file), { encoding: "utf-8" })
		.split("\n\n")
		.map((tileChunk) => {
			const [title, ...rest] = tileChunk.split("\n");
			const [match, tileId] = /^Tile (\d+):$/.exec(title);
			return new Tile(tileId, rest.join("\n"));
		});
	return input;
}

function partOne(input) {
	return makeTileMap(input)
		.getCornerTiles()
		.map((tile) => tile.id)
		.reduce((a, v) => a * v, 1);
}

function seaMonsterMask() {
	return [
		"                  # ",
		"#    ##    ##    ###",
		" #  #  #  #  #  #   ",
	];
}
function partTwo(input) {
	const tileMap = makeTileMap(input);
	const tile = tileMap.generateTile();
	const mask = seaMonsterMask();
	const res = findMask(tile, mask);
	const numHashInMask = mask.join("").replace(/[^#]/g, "").length;
	const numHashInTile = tile.tile.replace(/[^#]/g, "").length;
	return numHashInTile - numHashInMask * res.length;
}

function findMask(tile, mask) {
	for (let i = 0; i < 4; i++) {
		tile.rotateTile();
		const res = tile.findMask(mask);
		if (res.length > 0) {
			return res;
		}
	}
	tile.flip("x");
	for (let i = 0; i < 4; i++) {
		tile.rotateTile();
		const res = tile.findMask(mask);
		if (res.length > 0) {
			return res;
		}
	}
}

function makeTileMap(tiles) {
	let [initialTile, ...toProcess] = tiles;
	const tileMap = new TileMap(initialTile);
	while (toProcess.length > 0) {
		let prevLength = toProcess.length;
		let newToProcess = [];

		// iterate through
		while (toProcess.length > 0) {
			const tile = toProcess.pop();
			if (!tileMap.tryAddingTile(tile)) {
				newToProcess.push(tile);
			}
		}

		if (prevLength === newToProcess.length) {
			throw new Error("Looks like infinite loop");
		}
		toProcess = newToProcess;
	}
	return tileMap;
}

const run = [
	// {
	// 	file: "sample.txt",
	// 	fn: partTwo,
	// },
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
