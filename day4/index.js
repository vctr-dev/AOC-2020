const fs = require("fs");
const path = require("path");

const between = (a, b) => (v) => v >= a && v <= b;

const requiredFields = [
	{ key: "byr", test: between(1920, 2002) },
	{ key: "iyr", test: between(2010, 2020) },
	{ key: "eyr", test: between(2020, 2030) },
	{
		key: "hgt",
		test: (v) => {
			const [match, num, unit] = /^(\d+)(cm|in)$/.exec(v) || [];
			if (match) {
				if (unit === "cm") return between(150, 193)(num);
				if (unit === "in") return between(59, 76)(num);
			}
		},
	},
	{ key: "hcl", test: (v) => /^#[0-9a-f]{6}$/.test(v) },
	{
		key: "ecl",
		test: (v) => ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"].includes(v),
	},
	{ key: "pid", test: (v) => /^\d{9}$/.test(v) },
];

function getInput() {
	return fs
		.readFileSync(path.join(__dirname, "./input.txt"), { encoding: "utf-8" })
		.split("\n\n")
		.map((line) =>
			line
				.replace(/\n/g, " ")
				.split(" ")
				.reduce((acc, v) => {
					const [match, key, value] = /^(.+):(.+)$/.exec(v);
					return { ...acc, [key]: value };
				}, {})
		);
}

function solution() {
	return getInput().filter((passport) =>
		requiredFields.every(
			({ key, test }) => passport[key] && test(passport[key])
		)
	).length;
}

console.log(solution());
