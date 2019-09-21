#!/usr/bin/python3

import argparse
import re
import json

parser = argparse.ArgumentParser(description='Cleans up a word file and convert it to JSON.')
parser.add_argument('input', help='The name of the input file in text format.')
parser.add_argument('output', help='The name of the output file in JSON format.')
parser.add_argument('-l', '--minlength', type=int, default=4, help='Minimum length of each word.')
parser.add_argument('-r', '--minrefs', type=int, default=150, help='Minimum references to each word.')
args = parser.parse_args()

print("Input:", args.input)
print("Output:", args.output)
print("Min word length:", args.minlength)
print("Min number of references:", args.minrefs)

def parse(s):
    match = re.match('(\w+) (\d+)', s)
    if match:
        word = match.group(1)
        refs = int(match.group(2))
        if len(word) >= args.minlength and refs >= args.minrefs:
            return word
        else:
            return ""
    else:
        return ""

with open(args.input, 'r', encoding='utf-8') as fin:
    with open(args.output, 'w', encoding='utf-8') as fout:
        lines = fin.readlines()
        words = map(parse, lines)
        validWords = filter(lambda w: w != "", words)
        json.dump(list(validWords), fout, ensure_ascii=False)
        fout.write('\n')
