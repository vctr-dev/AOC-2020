const fs = require("fs");
const numbers = fs
	.readFileSync("./numbers.txt", { encoding: "utf-8" })
	.split("\n")
	.map((n) => +n)
	.sort((a, b) => a - b);

const TARGET = 2020;
function getPair(nums) {
	for (let i = 0; i < nums.length - 2; i++) {
		for (let j = i + 1; j < nums.length - 1; j++) {
			const pairTotal = nums[i] + nums[j];
			if (pairTotal > TARGET) break;
			for (let k = j + 1; k < nums.length; k++) {
				const total = pairTotal + nums[k];
				if (total > TARGET) break;
				if (total === TARGET) {
					return nums[i] * nums[j] * nums[k];
				}
			}
		}
	}
}
console.log(getPair(numbers));
