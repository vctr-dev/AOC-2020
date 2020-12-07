#!/usr/bin/env bash

inputFileUrl="https://adventofcode.com/2020/day/$1/input"
outputFile="./day$1/input.txt"
curl "$inputFileUrl" --output "$outputFile" --cookie "$(cat ./.cookie)"

inputFileUrl="https://adventofcode.com/2020/day/$1"
outputFile="./day$1/problem.html"
curl "$inputFileUrl" --output "$outputFile" --cookie "$(cat ./.cookie)"
google-chrome "$outputFile" &
nodemon "./day$1/index.js"