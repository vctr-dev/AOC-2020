const fs = require("fs");
const path = require("path");

const run = {
	partOne: {
		"sample.txt": false,
		"input.txt": false,
	},
	partTwo: {
		"sample.txt": true,
		"input.txt": true,
	},
};

function parseInput(file) {
	let [a, b, c] = fs
		.readFileSync(path.join(__dirname, file), { encoding: "utf-8" })
		.split("\n\n")
		.map((section) => section.split("\n"));
	a = a
		.map((v) => /^(.+): (\d+)-(\d+) or (\d+)-(\d+)$/.exec(v))
		.reduce(
			(acc, [match, cat, x1, x2, y1, y2]) => ({
				...acc,
				[cat]: { range1: [+x1, +x2], range2: [+y1, +y2] },
			}),
			{}
		);
	b = b
		.slice(1)
		.map((v) => v.split(","))
		.flat()
		.map((v) => +v);
	c = c.slice(1).map((v) => v.split(",").map((w) => +w));
	return { a, b, c };
}

function isInRange(num, lower, upper) {
	return num <= upper && num >= lower;
}
function partOne({ a, b, c }) {
	const r = [];
	c.forEach((nums) => {
		nums.forEach((num) => {
			const isValid = Object.values(a).some(({ range1, range2 }) => {
				return isInRange(num, ...range1) || isInRange(num, ...range2);
			});
			if (!isValid) {
				r.push(num);
			}
			return isValid;
		});
	});
	return r.reduce((a, v) => a + v, 0);
}

function partTwo({ a, b, c }, prevAns) {
	const valid = [];
	c.forEach((nums) => {
		if (
			nums.every((num) => {
				return Object.values(a).some(({ range1, range2 }) => {
					return isInRange(num, ...range1) || isInRange(num, ...range2);
				});
			})
		)
			valid.push(nums);
	});

	const rules = a;
	let ruleIndex = {};
	const ticketLength = valid[0].length;
	Object.entries(rules).forEach(([rule, { range1, range2 }]) => {
		for (let i = 0; i < ticketLength; i++) {
			if (
				valid.every(
					(ticket) =>
						isInRange(ticket[i], ...range1) || isInRange(ticket[i], ...range2)
				)
			) {
				ruleIndex[rule] = [...(ruleIndex[rule] || []), i];
			}
		}
	});

	while (Object.values(ruleIndex).some((ri) => ri.length > 1)) {
		let singles = Object.values(ruleIndex)
			.filter((ri) => ri.length == 1)
			.flat();
		Object.keys(ruleIndex).forEach((k) => {
			if (ruleIndex[k].length > 1)
				ruleIndex[k] = ruleIndex[k].filter((ri) => !singles.includes(ri));
		});
	}

	const myTicket = Object.fromEntries(
		Object.entries(ruleIndex).map(([k, v]) => [k, b[v[0]]])
	);
	return Object.entries(myTicket)
		.filter(([k]) => k.startsWith("departure"))
		.map(([k, v]) => v)
		.map((v) => console.log(v) || v)
		.reduce((acc, v) => acc * v, 1);
}

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
