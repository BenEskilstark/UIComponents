#!/bin/bash

# npm run babel -- --plugins transform-react-jsx

rm -rf bin
mkdir bin

# babel transform
npm run babel -- src/ -d bin/

# create bundle.js for the UI playground
npm run browserify -- bin/playground.react.js -o bin/bundle.js






