#!/bin/bash
cd /var/www/VividCustoms-Admin

npm run generate
pm2 delete all
pm2 start "npm run dev" --name "admin_panel"