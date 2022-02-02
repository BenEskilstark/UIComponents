#!/bin/bash

# npm run babel -- --plugins transform-react-jsx

rm -rf bin
mkdir bin

# babel transform
npm run babel -- src/ -d bin/






