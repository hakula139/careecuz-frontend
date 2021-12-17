#!/bin/bash

# Use Node.js 16

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 16

# Stop the server using pm2

export PATH="$(yarn global bin):$PATH"
pm2 stop server
