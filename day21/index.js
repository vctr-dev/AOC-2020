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
	const [match, stuff, ingredients] = /^(.*) \(contains (.*)\)$/.exec(line);
	return { ingredients: stuff.split(" "), allergens: ingredients.split(", ") };
}

function partOne(input) {
	let possibleAllergens = getPossibleAllergens(input);
	const hasAllergens = Object.values(possibleAllergens).reduce(
		(acc, v) => new Set([...acc, ...v]),
		new Set()
	);
	return input
		.map(({ ingredients }) => ingredients)
		.flat()
		.filter((ingredient) => !hasAllergens.has(ingredient)).length;
}

function partTwo(input) {
	let possibleAllergens = getPossibleAllergens(input);
	let confirmedAllergens = {};
	let toEvaluate = Object.entries(possibleAllergens);
	while (toEvaluate.length) {
		let [allergen, ingredientSet] = toEvaluate.pop();
		const ingredientsToRemove = new Set(Object.values(confirmedAllergens));
		ingredientSet = subtract(ingredientSet, ingredientsToRemove);

		if ([...ingredientSet].length === 1) {
			confirmedAllergens[allergen] = [...ingredientSet][0];
			continue;
		}

		toEvaluate.unshift([allergen, ingredientSet]);
	}
	console.log(confirmedAllergens);
	return Object.keys(confirmedAllergens)
		.sort()
		.map((k) => confirmedAllergens[k]);
}

function subtract(set1, set2) {
	return new Set([...set1].filter((v) => !set2.has(v)));
}
function getPossibleAllergens(input) {
	let possibleAllergens = {};
	input.forEach((menuItem) => {
		menuItem.allergens.forEach((allergen) => {
			possibleAllergens[allergen] = possibleAllergens[allergen] || [];
			possibleAllergens[allergen].push(new Set(menuItem.ingredients));
		});
	});
	possibleAllergens = Object.fromEntries(
		Object.entries(possibleAllergens).map(([allergen, ingredientSets]) => {
			return [
				allergen,
				ingredientSets.reduce((acc, v) => {
					if (!acc) return v;
					return intersect(acc, v);
				}),
			];
		})
	);
	return possibleAllergens;
}

function intersect(set1, set2) {
	return new Set([...set1].filter((v) => set2.has(v)));
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
