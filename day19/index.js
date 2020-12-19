const fs = require("fs");
const path = require("path");

function parseInput(file) {
	let [rulesets, messages] = fs
		.readFileSync(path.join(__dirname, file), { encoding: "utf-8" })
		.split("\n\n");
	rulesets = rulesets.split("\n").reduce((acc, rule) => {
		let [match, i, rs] = /^(\d+): (.*)$/.exec(rule);
		rs = rs.split(" | ");
		rs = rs.map((r) => r.split(" ").map((item) => item.replace(/"/g, "")));
		acc[i] = rs;
		return acc;
	}, new Array(rulesets.length));
	messages = messages.split("\n");
	return { rulesets, messages };
}

function partOne({ rulesets, messages }) {
	let rulesToEvaluate = rulesets[0];
	let unmatchedMessages = [...messages];
	while (rulesToEvaluate.length > 0) {
		rule = rulesToEvaluate.pop();
		if (rule.every((item) => isNaN(item))) {
			rule = rule.join("");
			unmatchedMessages = unmatchedMessages.filter(
				(message) => message !== rule
			);
			console.log(unmatchedMessages.length);
			continue;
		}

		let newRuleset = createRulesetFromRule(rulesets, rule);
		newRuleset = filterRules(newRuleset, unmatchedMessages);

		rulesToEvaluate.push(...newRuleset);
	}
	return messages.length - unmatchedMessages.length;
}

// can we throw out rulesets that do not match any messages?
function filterRules(rules, messages) {
	return rules.filter((rule) => possibleToMatch(rule, messages));
}

function possibleToMatch(rule, messages) {
	const messagesToConsider = messages.filter(
		(message) => message.length >= rule.length
	);
	if (messagesToConsider.length === 0) {
		return false;
	}
	for (let i = 0; i < rule.length; i++) {
		const item = rule[i];
		if (!isNaN(item)) break;
		if (messagesToConsider.every((message) => message[i] !== item)) {
			return false;
		}
	}
	return true;
}

function resolveRuleset(rulesets, targetRuleset, debug) {
	const res = [];
	targetRuleset.forEach((rule) => {
		const newRuleset = createRulesetFromRule(rulesets, rule);
		res.push(...newRuleset);
	});
	return res;
}
function createRulesetFromRule(rulesets, rule, debug) {
	debug && console.log(rule);
	let newRuleset = [[]];
	rule.forEach((ruleItem) => {
		const refRuleset = rulesets[ruleItem] || [[ruleItem]];
		newRuleset = combineRuleset(newRuleset, refRuleset);
	});
	return newRuleset;
}

function combineRuleset(a, b) {
	const res = [];
	a.forEach((x) => {
		b.forEach((y) => {
			res.push([...x, ...y]);
		});
	});
	return res;
}
function partTwo(input, partOneAns) {
	return "part one";
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
	// {
	// 	file: "sample.txt",
	// 	fn: (input) => partTwo(input, partOne(input))
	// },
	// {
	// 	file: "input.txt",
	// 	fn: (input) => partTwo(input, partOne(input))
	// }
];

console.table(solution());
function solution() {
	// Deal with input txt
	return run.forEach(({ file, fn }) => {
		console.log(`File: ${file}`);
		console.log(`Ans: ${fn(parseInput(file))}`);
	});
}
