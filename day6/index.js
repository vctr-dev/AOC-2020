const fs = require("fs");
const path = require("path");

function getInput() {
	return fs
		.readFileSync(path.join(__dirname, "./input.txt"), { encoding: "utf-8" })
		.split("\n\n");
}

function solution() {
	const input = getInput();
	return input
		.map((group) => {
			const groupLength = group.split("\n").length;
			const o = group
				.replace(/\n/g, "")
				.split("")
				.reduce((a, v) => {
					if (a[v]) {
						a[v] += 1;
					} else a[v] = 1;
					return a;
				}, {});
			console.log(o, groupLength);
			return Object.values(o).filter((v) => v === groupLength).length;

			// return [...new Set(group.replace(/\n/g, "").split(""))].length;
		})
		.reduce((a, v) => a + v, 0);
}

console.log(solution());
