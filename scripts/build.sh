#!/bin/bash

# Use Node.js 16

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 16

# Install dependencies and build the project using yarn

yarn && yarn build
