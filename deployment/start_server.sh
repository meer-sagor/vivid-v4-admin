#!/bin/bash
cd /var/www/vividcustoms/admin-panel

npm run generate
pm2 delete all
pm2 start "npm run dev" --name "admin_panel"