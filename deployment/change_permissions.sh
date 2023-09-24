#!/bin/bash

# Fix user rights
# sudo usermod -a -G www-data www-data
# sudo chown -R www-data:www-data /var/www
# sudo chmod 2775 /var/www
# find /var/www -type d -exec sudo chmod 2775 {} \;
# find /var/www -type f -exec sudo chmod 0664 {} \;
sudo chown -R www-data:www-data /VividCustoms-Admin
sudo chmod -R 775 /VividCustoms-Admin