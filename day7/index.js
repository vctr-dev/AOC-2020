const fs = require("fs");
const path = require("path");

console.log(solution());

function solution() {
	const myColor = "shiny gold bag";
	const graph = getInput().reduce((a, line) => {
		const rule = parseRule(line);
		return { ...a, [rule.source]: rule.dest };
	}, {});

	// return partOne(myColor, graph);
	// part two
	return numBag(myColor, graph) - 1;
}

function partOne(myColor, graph) {
	const reverseGraph = Object.entries(graph).reduce((a, [p, c]) => {
		c.forEach(({ color }) => {
			a[color] = [...(a[color] || []), p];
		});
		return a;
	}, {});

	const queue = [myColor];
	const found = new Set();
	while (queue.length != 0) {
		const node = queue.pop();
		found.add(node);

		const newNodes = (reverseGraph[node] || []).filter((n) => !found.has(n));
		queue.push(...newNodes);
	}
	found.delete(myColor);

	return [...found].length;
}

function numBag(color, graph) {
	if (graph[color].length === 0) {
		return 1;
	}
	return graph[color]
		.map(({ q, color: bagColor }) => q * numBag(bagColor, graph))
		.reduce((a, v) => a + v, 1);
}

function parseRule(line) {
	let [match, source, dest] = /^(.*) contain (.*)\.$/.exec(line);
	source = source.replace(/s$/, "");
	dest = dest.split(", ");
	if (dest.includes("no other bags")) {
		dest = [];
	} else {
		dest = dest.map((a) => {
			let [match2, num, color] = /^(\d+) (.*)$/.exec(a);
			return { q: +num, color: color.replace("bags", "bag") };
		});
	}
	return { source, dest };
}

function getInput() {
	return fs
		.readFileSync(path.join(__dirname, "./input.txt"), { encoding: "utf-8" })
		.split("\n");
}
