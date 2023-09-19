#!/bin/bash
cd /projects/vivid-v4-admin

npm run generate
pm2 delete all
pm2 start "npm run dev" --name "admin_panel"