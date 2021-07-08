#!/bin/bash

pm2 stop staging
pm2 delete staging
git pull  
npm install 
PORT=3000 pm2 start app.js --name staging