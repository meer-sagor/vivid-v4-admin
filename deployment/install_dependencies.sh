#!/bin/bash

# curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
# source ~/.bashrc
# nvm install 16

cd /VividCustoms-Admin

# npm install -g pm2
if [ -d "node_modules" ]; then rm -Rf node_modules; fi
npm install