const fs = require("fs");
const path = require("path");

function parseInput(file) {
	let input = fs
		.readFileSync(path.join(__dirname, file), { encoding: "utf-8" })
		.split("\n\n")
		.map((line) => processLine(line));
	return input;
}
function processLine(line) {
	const [player, ...cards] = line.split("\n");
	return { player, cards: cards.map((v) => +v) };
}

function partOne(input) {
	const totalNumCards = input.map(({ cards }) => cards).flat().length;
	let winningPlayer;
	while (input.every(({ cards }) => cards.length !== totalNumCards)) {
		const cardsToCompare = input.map(({ cards }) => cards.shift());
		const winningCard = Math.max(...cardsToCompare);
		const winningPlayerIndex = cardsToCompare.findIndex(
			(card) => card === winningCard
		);
		winningPlayer = input[winningPlayerIndex];
		winningPlayer.cards.push(...cardsToCompare.sort((b, a) => a - b));
	}
	return winningPlayer.cards.reduce(
		(a, v, i) => a + v * (totalNumCards - i),
		0
	);
}

function partTwo(input) {
	const winnerIndex = playGame(input);
	// console.log("=== Winner ===");
	// console.log(input[winnerIndex]);
	return input[winnerIndex].cards
		.reverse()
		.reduce((a, v, i) => a + v * (i + 1), 0);
}

function serializePlayers([player1, player2]) {
	return `player1:${player1.cards.join(",")}player2:${player2.cards.join(",")}`;
}

function playGame(players, prev = new Set(), gameNumber = 1) {
	// console.log(`\n= Game ${gameNumber} =`);
	const totalNumCards = players.map(({ cards }) => cards).flat().length;
	let winnerIndex;
	let roundNumber = 1;
	while (players.every(({ cards }) => cards.length !== totalNumCards)) {
		// console.log(`\n== Round ${roundNumber++} (Game ${gameNumber}) ==`);
		// console.log(players);
		if (prev.has(serializePlayers(players))) {
			return 0;
		}
		prev.add(serializePlayers(players));

		const [top1, top2] = players.map(({ cards }) => cards.shift());
		const [cards1, cards2] = players.map(({ cards }) => cards);
		if (top1 <= cards1.length && top2 <= cards2.length) {
			winnerIndex = playGame(
				players.map(({ cards }, i) => ({
					cards: cards.slice(0, [top1, top2][i]),
				})),
				undefined,
				gameNumber + 1
			);
		} else {
			winnerIndex = top1 > top2 ? 0 : 1;
		}
		const winningPlayer = players[winnerIndex];
		if (winnerIndex === 0) {
			winningPlayer.cards.push(top1, top2);
		} else {
			winningPlayer.cards.push(top2, top1);
		}
		// console.log(`Round Winner: ${winnerIndex === 0 ? 1 : 2}`);
	}
	// console.log(`Game Winner: ${winnerIndex === 0 ? 1 : 2}`);
	return winnerIndex;
}

const run = [
	// {
	// 	file: "sample.txt",
	// 	fn: partTwo,
	// },
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
