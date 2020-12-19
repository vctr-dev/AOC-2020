const fs = require("fs");
const path = require("path");

function parseInput(file) {
	let input = fs
		.readFileSync(path.join(__dirname, file), { encoding: "utf-8" })
		.split("\n")
		.map((l) =>
			l
				.split(/(\()/)
				.map((c) => c.split(/(\))/))
				.flat()
				.map((c) => c.split(" "))
				.flat()
				.filter((c) => c.length)
		);
	return input;
}

function partOne(input) {
	return input
		.map((line) => {
			const postfix = convertToPostfix(line);
			return performPostfixCal(postfix);
		})
		.reduce((a, v) => a + v, 0);
}

function performPostfixCal(postfix) {
	const stack = new Stack();
	postfix.split("").forEach((c) => {
		if (!isNaN(c)) {
			stack.push(c);
		} else if (c === "*") {
			let a = stack.pop();
			let b = stack.pop();
			stack.push(b * a);
		} else if (c === "+") {
			let a = stack.pop();
			let b = stack.pop();
			stack.push(+b + +a);
		} else if (c === "/") {
			let a = stack.pop();
			let b = stack.pop();
			stack.push(b / a);
		} else if (c === "-") {
			let a = stack.pop();
			let b = stack.pop();
			stack.push(b - a);
		}
	});
	return stack.pop();
}

function precedence(op) {
	return (
		{
			"*": 1,
			"/": 1,
			"-": 1,
			"+": 2,
		}[op] || -1
	);
}

function convertToPostfix(infix) {
	const stack = new Stack();
	let postfix = "";
	infix.forEach((c) => {
		if (!isNaN(c)) {
			// is a number
			return (postfix += c);
		}
		if (c === "(") {
			return stack.push(c);
		}
		if (c === ")") {
			// handle braces
			while (!stack.isEmpty() && stack.peek() !== "(") {
				postfix += stack.pop();
			}
			stack.pop();
			return;
		}

		// is operator
		while (!stack.isEmpty() && precedence(c) <= precedence(stack.peek())) {
			postfix += stack.pop();
		}
		stack.push(c);
	});
	while (!stack.isEmpty()) {
		postfix += stack.pop();
	}
	return postfix;
}

class Stack {
	arr = [];
	push(item) {
		this.arr.push(item);
	}
	pop(item) {
		return this.arr.pop(item);
	}
	peek() {
		return this.arr[this.arr.length - 1];
	}
	isEmpty() {
		return this.arr.length === 0;
	}
	reverse() {
		this.arr = this.arr.reverse();
	}
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
];
solution();

function solution() {
	// Deal with input txt
	return run.forEach(({ file, fn }) => {
		console.log(`File: ${file}`);
		console.log(`Ans: ${fn(parseInput(file))}`);
	});
}
