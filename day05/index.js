const fs = require("fs");
const path = require("path");

function getInput() {
	return fs
		.readFileSync(path.join(__dirname, "./input.txt"), { encoding: "utf-8" })
		.split("\n");
}

function solution() {
	const input = getInput();
	const seatIDs = input.map((line) => getSeatId(line));
	seatIDs.sort((a, b) => a - b);
	for (let i = 0; i < seatIDs.length - 1; i++) {
		const [cur, next] = [seatIDs[i], seatIDs[i + 1]];
		if (next - cur > 1) {
			return cur + 1;
		}
	}
	// return seatIDs;
}

function getSeatId(line) {
	let [lowerRow, upperRow, lowerCol, upperCol] = [0, 127, 0, 7];
	line.split("").forEach((c, i) => {
		if (i < 7) {
			[lowerRow, upperRow] = divide(lowerRow, upperRow, letterToLowerLevel(c));
		} else {
			[lowerCol, upperCol] = divide(lowerCol, upperCol, letterToLowerLevel(c));
		}
	});
	return lowerRow * 8 + lowerCol;
}

function divide(lower, upper, shouldKeepLower) {
	const mid = Math.floor(Math.round((upper + lower) / 2));
	if (shouldKeepLower) {
		return [lower, mid - 1];
	}
	return [mid, upper];
}

function letterToLowerLevel(letter) {
	if (letter === "F" || letter === "L") return true;
	return false;
}

// console.log(Math.max(...solution()));

console.log(solution());
