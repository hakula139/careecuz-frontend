#!/bin/bash

# Install Node.js 16 using nvm

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm install 16

# Install yarn using npm

npm install -g yarn

# Install pm2 using yarn

yarn global add pm2
