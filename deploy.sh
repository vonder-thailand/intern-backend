#!/bin/bash

pm2 stop all  
pm2 delete all  
git pull  
npm install 
pm2 start "npm start" 