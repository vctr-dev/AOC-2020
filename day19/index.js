const fs = require("fs");
const path = require("path");

function parseInput(file) {
	let [rulesets, messages] = fs
		.readFileSync(path.join(__dirname, file), { encoding: "utf-8" })
		.split("\n\n");
	rulesets = rulesets.split("\n").map((rule) => {
		let [match, i, rs] = /^(\d+): (.*)$/.exec(rule);
		rs = rs.split(" | ");
		rs = rs.map((r) => r.split(" ").map((item) => item.replace(/"/g, "")));
		return {
			key: i,
			rules: rs,
		};
	});
	messages = messages.split("\n");
	return { rulesets, messages };
}

function partOne({ rulesets, messages }) {
	let count = 0;
	const test = makeCykTest(rulesets);
	messages.forEach((message, i) => {
		console.log(`Working on ${i + 1}/${messages.length}`);
		console.time();
		if (test(message, "0")) {
			count++;
		}
		console.timeEnd();
		console.log(`Current count: ${count}`);
	});
	return count;
}

function makeCykTest(grammar) {
	// Find convert to terminating rules
	const terminals = {};
	grammar.forEach(({ key, rules }) => {
		rules.forEach((rule) => {
			if (rule.length != 1) return;
			// if is terminating
			if (isNaN(rule[0])) {
				terminals[rule[0]] = [...(terminals[rule[0]] || []), key];
			}
		});
	});
	grammar.forEach(
		({ key, rules }) =>
			rules
				.filter((rule) => !(rule.length === 1 && isNaN(rule[0])))
				.every((rule) => rule.length === 2) ||
			console.log("Fix this", { key, rules })
	);
	return (message, start) => {
		return cykTest(grammar, terminals, message, start);
	};
}
function cykTest(grammar, terminals, message, start) {
	// Find convert to terminating rules

	const messageArray = message.split("");
	const funnel = [];
	funnel.push(messageArray.map((l) => terminals[l]));

	// reduce funnel down to one by iterating to message length
	let prev = funnel[funnel.length - 1];
	// construct rows
	for (let i = 1; i < message.length; i++) {
		const row = [];
		// construct column of the row
		for (let j = 0; j < prev.length - 1; j++) {
			// For each new blank space, we need to loop through the vertical and diagonal to get what to compare
			let symbols = [];
			for (let k = 0; k < i; k++) {
				// the vertical
				const firstSymbols = funnel[k][j];
				// the diagonal
				const secondSymbols = funnel[i - k - 1][j + k + 1];
				let possiblePredicates = makeCombinations(firstSymbols, secondSymbols);
				const symbolsFound = possiblePredicates
					.map((predicate) => findSymbol(grammar, predicate))
					.filter(Boolean)
					.flat();
				symbols.push(...symbolsFound);
			}
			row.push(symbols);
		}
		funnel.push(row);

		prev = row;
	}
	return prev.flat().includes(start);
}

function findSymbol(grammar, predicate) {
	return grammar
		.filter(({ rules }) => {
			return (
				rules.filter((rule) => {
					// console.log({ rule, predicate });
					return fulfilsRule(rule, predicate);
				}).length > 0
			);
		})
		.map(({ key }) => key);
}

function fulfilsRule(a, b) {
	return a.join(",") === b.join(",");
}

function makeCombinations(a, b) {
	const combinations = [];
	a.forEach((x) => {
		b.forEach((y) => {
			combinations.push([x, y]);
		});
	});
	return combinations;
}

const run = [
	// {
	// 	file: "sample.txt",
	// 	fn: partOne,
	// },
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
		console.log(`Ans: ${fn(parseInput(file))}`);
	});
}
