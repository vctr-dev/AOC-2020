const fs = require("fs");
const numbers = fs
	.readFileSync("./numbers.txt", { encoding: "utf-8" })
	.split("\n")
	.map((n) => +n);

function getPair(nums) {
	for (let i = 0; i < nums.length; i++) {
		for (let j = i + 1; j < nums.length; j++) {
			for (let k = j + 1; k < nums.length; k++) {
				if (nums[i] + nums[j] + nums[k] === 2020) {
					return nums[i] * nums[j] * nums[k];
				}
			}
		}
	}
}
console.log(getPair(numbers));
