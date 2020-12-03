#!/usr/bin/env bash

inputFileUrl="https://adventofcode.com/2020/day/$1/input"
outputFile="./day$1/input.txt"
curl "$inputFileUrl" --output "$outputFile" --cookie "$(cat ./.cookie)"