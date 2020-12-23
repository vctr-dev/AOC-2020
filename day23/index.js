const fs = require("fs");
const path = require("path");

function parseInput(file) {
	if (file === "sample.txt")
		return new Cups("389125467".split("").map((v) => +v));
	if (file === "input.txt")
		return new Cups("467528193".split("").map((v) => +v));
}

class Cups {
	constructor(cups) {
		const cupsObj = cups.map((c) => new Cup(c));
		cupsObj.forEach((c, i) => (c.next = cupsObj[i + 1] || cupsObj[0]));
		this.head = cupsObj[0];
		this.reindex();
	}
	removeNext(number) {
		let nextHead = this.head.next;
		let nextCup = this.head;
		for (let i = 0; i < number; i++) {
			nextCup = nextCup.next;
		}
		this.head.next = nextCup.next;
		nextCup.next = undefined;
		return nextHead;
	}

	insert(dest, cups) {
		let head = cups;
		while (head.next) {
			head = head.next;
		}

		head.next = dest.next;
		dest.next = cups;
	}

	move() {
		const removedCups = this.removeNext(3);

		let label = this.head.label - 1;
		if (label < this.min) {
			label = this.max;
		}

		while (removedCups.find((x) => x.label === label)) {
			label--;
			if (label < this.min) {
				label = this.max;
			}
		}
		let destCup = this.index[label];
		this.insert(destCup, removedCups);
		this.head = this.head.next;
	}

	findMaxMin() {
		let max = this.head.label;
		let min = this.head.label;
		let head = this.head;
		while (head.next && head.next !== this.head) {
			head = head.next;
			if (head.label > max) {
				max = head.label;
			}
			if (head.label < min) {
				min = head.label;
			}
		}
		return { max, min };
	}
	reindex() {
		let head = this.head;
		const { max, min } = this.findMaxMin();
		this.index = new Array(max);
		do {
			this.index[head.label] = head;
			head = head.next;
		} while (head != this.head);
		this.max = max;
		this.min = min;
		console.log({ index: this.index, min: this.min, max: this.max });
	}
}

class Cup {
	constructor(label, next) {
		this.label = label;
		this.next = next;
	}
	toArray() {
		let head = this;
		const arr = [];
		do {
			arr.push(head);
			head = head.next;
		} while (head && head !== this);
		return arr;
	}
	find(fn) {
		let head = this;
		do {
			if (fn(head)) {
				return head;
			}
			head = head.next;
		} while (head && head != this);
	}
}

function partOne(cups) {
	for (let i = 0; i < 100; i++) cups.move();
	return cups.head
		.find((x) => x.label === 1)
		.toArray()
		.map((x) => x.label)
		.filter((x) => x !== 1)
		.join("");
}

function partTwo(cups) {
	let lastCup = cups.head;
	let max = cups.findMaxMin().max;
	while (lastCup.next !== cups.head) {
		lastCup = lastCup.next;
	}
	for (let i = max + 1; i <= 1000000; i++) {
		lastCup.next = new Cup(i);
		lastCup = lastCup.next;
	}
	lastCup.next = cups.head;
	cups.reindex();

	for (let i = 0; i < 10000000; i++) {
		cups.move();
	}

	const oneCup = cups.head.find((x) => x.label === 1);
	return oneCup.next.label * oneCup.next.next.label;
}

const run = [
	{
		file: "input.txt",
		fn: partTwo,
	},
	// {
	// 	file: "input.txt",
	// 	fn: partTwo,
	// },
];
solution();

function solution() {
	// Deal with input txt
	return run.forEach(({ file, fn }) => {
		console.log(`File: ${file}`);
		console.log(`Ans: ${fn(parseInput(file))}`);
	});
}
