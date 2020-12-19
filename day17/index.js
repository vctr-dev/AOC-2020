const fs = require("fs");
const path = require("path");

function parseInput(file) {
	let input = fs
		.readFileSync(path.join(__dirname, file), { encoding: "utf-8" })
		.split("\n")
		.map((v) => v.split(""));
	return input;
}

class Point {
	constructor(x, y, z, item = ".") {
		this.x = x;
		this.y = y;
		this.z = z;
		this.item = item;
	}
	isEqual({ x, y, z }) {
		return this.x === x && this.y === y && this.z === z;
	}
	getNeighbouringCoordinates() {
		const coord = [];
		for (let x = -1; x <= 1; x++) {
			for (let y = -1; y <= 1; y++) {
				for (let z = -1; z <= 1; z++) {
					if (x === 0 && y === 0 && z === 0) {
						continue;
					}
					coord.push({
						x: this.x + x,
						y: this.y + y,
						z: this.z + z,
					});
				}
			}
		}
		return coord;
	}
}

class Cube {
	points = [];
	getPoint(x, y, z) {
		const point = this.points.find((p) => p.isEqual(new Point(x, y, z)));
		return point;
	}
	setPoint(x, y, z, item) {
		const point = this.getPoint(x, y, z);
		if (point) {
			point.item = item;
		} else {
			this.points.push(new Point(x, y, z, item));
		}
		return this;
	}
	getNeighbouringItems(point) {
		return point
			.getNeighbouringCoordinates()
			.map(({ x, y, z }) => this.getPoint(x, y, z))
			.filter(Boolean)
			.map((p) => p.item);
	}
	getBoundaries() {
		const x = this.points.map((p) => p.x);
		const y = this.points.map((p) => p.y);
		const z = this.points.map((p) => p.z);
		return {
			lower: {
				x: Math.min(...x),
				y: Math.min(...y),
				z: Math.min(...z),
			},
			upper: {
				x: Math.max(...x),
				y: Math.max(...y),
				z: Math.max(...z),
			},
		};
	}

	getZLayer(z) {
		const { lower, upper } = this.getBoundaries();
		const layer = [];
		const points = this.points.filter((p) => p.z === z);
		for (let y = lower.y; y <= upper.y; y++) {
			const row = [];
			layer.push(row);
			for (let x = lower.x; x <= upper.x; x++) {
				let p = this.getPoint(x, y, z) || new Point(x, y, z);
				row.push(p.item);
			}
		}
		return layer.map((row) => row.join("")).join("\n");
	}

	toString() {
		const { lower, upper } = this.getBoundaries();
		let string = "";
		for (let z = lower.z; z <= upper.z; z++) {
			string += `z=${z}\n` + this.getZLayer(z) + "\n\n";
		}
		return string;
	}

	cycle(cube) {
		const newCube = new Cube();
		let { lower, upper } = this.getBoundaries();
		lower = Object.fromEntries(
			Object.entries(lower).map(([k, v]) => [k, v - 1])
		);
		upper = Object.fromEntries(
			Object.entries(upper).map(([k, v]) => [k, v + 1])
		);

		for (let x = lower.x; x <= upper.x; x++) {
			for (let y = lower.y; y <= upper.y; y++) {
				for (let z = lower.z; z <= upper.z; z++) {
					let point = this.getPoint(x, y, z) || new Point(x, y, z);
					const numActives = this.getNeighbouringItems(point).filter(
						(item) => item === "#"
					).length;
					if (point.item === "#") {
						if (numActives === 2 || numActives === 3) {
							newCube.setPoint(x, y, z, "#");
						} else {
							newCube.setPoint(x, y, z, ".");
						}
					} else {
						if (numActives === 3) {
							newCube.setPoint(x, y, z, "#");
						}
					}
				}
			}
		}
		return newCube;
	}
	count(fn) {
		return this.points.filter((p) => fn(p)).length;
	}
}

function partOne(input) {
	let cube = new Cube();
	input.forEach((row, y) =>
		row.forEach((col, x) => {
			cube.setPoint(x, y, 0, 0, col);
		})
	);
	for (let i = 0; i < 6; i++) cube = cube.cycle();
	return cube.count((p) => p.item === "#");
}

function partTwo(input, prevAns) {
	return "part two";
}

const run = {
	partOne: {
		"sample.txt": true,
		"input.txt": true,
	},
	partTwo: {
		"sample.txt": false,
		"input.txt": false,
	},
};

console.table(solution());
function solution() {
	// Deal with input txt
	return ["sample.txt", "input.txt"].reduce((acc, file) => {
		const partOneAns = run.partOne[file] ? partOne(parseInput(file)) : "skip";
		return {
			...acc,
			[file]: {
				"part 1": partOneAns,
				"part 2": run.partTwo[file]
					? partTwo(parseInput(file), partOneAns)
					: "skip",
			},
		};
	}, {});
}
