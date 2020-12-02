const fs = require("fs");

const inputs = fs
	.readFileSync("./input.txt", { encoding: "utf-8" })
	.split("\n")
	.map((line) => {
		const [policy, ...password] = line.split(": ");
		return { policy, password: password.join(": ") };
	})
	.filter(passwordCheck2);

console.log(inputs.length);

function passwordCheck1({ policy, password }) {
	const [_, min, max, letter] = /(\d+)-(\d+) (\w)/.exec(policy);
	const num = password.split("").filter((c) => c === letter).length;
	return num <= max && num >= min;
}

function passwordCheck2({ policy, password }) {
	const [_, inPos1, inPos2, letter] = /(\d+)-(\d+) (\w)/.exec(policy);
	const pairs = [password[inPos1 - 1], password[inPos2 - 1]];
	return pairs[0] !== pairs[1] && (pairs[0] === letter || pairs[1] === letter);
}
