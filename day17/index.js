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
	constructor(x, y, z, w, item = ".") {
		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w;
		this.item = item;
	}
	isEqual({ x, y, z, w }) {
		return this.x === x && this.y === y && this.z === z && this.w === w;
	}
	getNeighbouringCoordinates() {
		const coord = [];
		for (let x = -1; x <= 1; x++) {
			for (let y = -1; y <= 1; y++) {
				for (let z = -1; z <= 1; z++) {
					for (let w = -1; w <= 1; w++) {
						if ([x, y, z, w].every((c) => c === 0)) {
							continue;
						}
						coord.push({
							x: this.x + x,
							y: this.y + y,
							z: this.z + z,
							w: this.w + w,
						});
					}
				}
			}
		}
		return coord;
	}
}

class Cube {
	points = [];
	getPoint(x, y, z, w) {
		return this.points.find((p) => p.isEqual(new Point(x, y, z, w)));
	}
	setPoint(x, y, z, w, item) {
		const point = this.getPoint(x, y, z, w);
		if (point) {
			point.item = item;
		} else {
			this.points.push(new Point(x, y, z, w, item));
		}
		return this;
	}
	getNeighbouringItems(point) {
		return point
			.getNeighbouringCoordinates()
			.map(({ x, y, z, w }) => this.getPoint(x, y, z, w))
			.filter(Boolean)
			.map((p) => p.item);
	}
	getBoundaries() {
		const x = this.points.map((p) => p.x);
		const y = this.points.map((p) => p.y);
		const z = this.points.map((p) => p.z);
		const w = this.points.map((p) => p.w);
		return {
			lower: {
				x: Math.min(...x),
				y: Math.min(...y),
				z: Math.min(...z),
				w: Math.min(...w),
			},
			upper: {
				x: Math.max(...x),
				y: Math.max(...y),
				z: Math.max(...z),
				w: Math.max(...w),
			},
		};
	}

	getZLayer(z, w) {
		const { lower, upper } = this.getBoundaries();
		const layer = [];
		const points = this.points.filter((p) => p.z === z && p.w === w);
		for (let y = lower.y; y <= upper.y; y++) {
			const row = [];
			layer.push(row);
			for (let x = lower.x; x <= upper.x; x++) {
				let p = this.getPoint(x, y, z, w) || new Point(x, y, z, w);
				row.push(p.item);
			}
		}
		return layer.map((row) => row.join("")).join("\n");
	}

	toString() {
		const { lower, upper } = this.getBoundaries();
		let string = "";
		for (let w = lower.w; w <= upper.w; w++) {
			for (let z = lower.z; z <= upper.z; z++) {
				string += `z=${z}, w=${w}\n` + this.getZLayer(z, w) + "\n\n";
			}
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
					for (let w = lower.w; w <= upper.w; w++) {
						let point = this.getPoint(x, y, z, w) || new Point(x, y, z, w);
						const numActives = this.getNeighbouringItems(point).filter(
							(item) => item === "#"
						).length;
						if (point.item === "#") {
							if (numActives === 2 || numActives === 3) {
								newCube.setPoint(x, y, z, w, "#");
							} else {
								newCube.setPoint(x, y, z, w, ".");
							}
						} else {
							if (numActives === 3) {
								newCube.setPoint(x, y, z, w, "#");
							}
						}
					}
				}
			}
		}
		newCube.removeInactivePoints();
		return newCube;
	}
	count(fn) {
		return this.points.filter((p) => fn(p)).length;
	}

	removeInactivePoints() {
		this.points = this.points.filter((p) => p.item === "#");
	}
}

function partOne(input) {
	let cube = new Cube();
	input.forEach((row, y) =>
		row.forEach((col, x) => {
			cube.setPoint(x, y, 0, 0, col);
		})
	);

	for (let i = 0; i < 6; i++) {
		console.log(`Working on ${i}`);
		cube = cube.cycle();
	}
	return cube.count((p) => p.item === "#");
}

const run = [
	{
		file: "sample.txt",
		fn: partOne,
	},
	{
		file: "input.txt",
		fn: partOne,
	},
];

console.table(solution());
function solution() {
	// Deal with input txt
	return run.forEach(({ file, fn }) => {
		console.log(`File: ${file}`);
		console.log(fn(parseInput(file)));
	});
}
