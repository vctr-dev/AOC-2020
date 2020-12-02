const fs = require("fs");
const path = require("path");

const inputs = fs
	.readFileSync(path.join(__dirname, "./input.txt"), { encoding: "utf-8" })
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
	const [_, nPos, letter] = /(\d+-\d+) (\w)/.exec(policy);
	const pairs = nPos.split("-").map((n) => password[n - 1]);
	return pairs.filter((c) => c === letter).length === 1;
}
