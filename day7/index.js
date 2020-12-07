const fs = require("fs");
const path = require("path");

console.log(solution());

function reverseGraph(graph) {
	const gather = {};
	Object.keys(graph).forEach((node) => {
		graph[node].forEach(({ name }) => {
			gather[name] = [...(gather[name] || []), node];
		});
	});
	return gather;
}
function solution() {
	const myBag = "shiny gold bag";
	const input = getInput();
	const graph = input.reduce((a, line) => {
		const rule = parseLine(line);
		return { ...a, [rule.source]: rule.dest };
	}, {});

	// part one
	// const reverse = reverseGraph(graph);
	// const queue = [myBag];
	// const found = new Set();
	// while (queue.length != 0) {
	// 	const node = queue.pop();
	// 	found.add(node);
	// 	const newNodes = (reverse[node] || []).filter((n) => !found.has(n));

	// 	queue.push(...newNodes);
	// }
	// found.delete(myBag);

	// return [...found];

	// part two

	return numBag(myBag, graph) - 1;
}

function numBag(color, graph) {
	if (graph[color].length === 0) {
		return 1;
	}
	return graph[color]
		.map(({ q, name }) => {
			return q * numBag(name, graph);
		})
		.reduce((a, v) => a + v, 1);
}

function parseLine(line) {
	let [match, source, dest] = /^(.*) contain (.*)\.$/.exec(line);
	source = source.replace(/s$/, "");
	dest = dest.split(", ");
	if (dest[0] === "no other bags") {
		dest = [];
	} else {
		dest = dest.map((a) => {
			let [match2, num, bagName] = /^(\d+) (.*)$/.exec(a);
			bagName = bagName.replace(/s$/, "");
			return { q: +num, name: bagName };
		});
	}
	return { source, dest };
}

function getInput() {
	return fs
		.readFileSync(path.join(__dirname, "./input.txt"), { encoding: "utf-8" })
		.split("\n");
}
