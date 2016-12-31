#!/usr/bin/env bash

#== Import script args ==

timezone=$(echo "$1")

#== Bash helpers ==

function info {
  echo " "
  echo "--> $1"
  echo " "
}

#== Provision script ==

info "Provision-script user: `whoami`"

chown -R ubuntu /app
chgrp -R ubuntu /app

info "Allocate swap for MySQL 5.6"
fallocate -l 2048M /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap defaults 0 0' >> /etc/fstab

info "Configure locales"
update-locale LC_ALL="C"
dpkg-reconfigure locales

info "Configure timezone"
echo ${timezone} | tee /etc/timezone
dpkg-reconfigure --frontend noninteractive tzdata

info "Prepare root password for MySQL"
debconf-set-selections <<< "mysql-server-5.6 mysql-server/root_password password \"''\""
debconf-set-selections <<< "mysql-server-5.6 mysql-server/root_password_again password \"''\""
echo "Done!"

info "Update OS software"
apt-get update
info "Skipping OS software update"

info "Install additional software"
apt-get install -y git php5-curl php5-cli php5-intl php5-mysqlnd php5-gd php5-fpm nginx mysql-server-5.6 npm

info "Link legacy node"
ln -s /usr/bin/nodejs /usr/bin/node

info "Install nodemon"
npm install -g nodemon

info "Update npm"
npm install -g npm

info "Configure MySQL"
sed -i "s/.*bind-address.*/bind-address = 0.0.0.0/" /etc/mysql/my.cnf
echo "Done!"

info "Configure PHP-FPM"
sed -i 's/user = www-data/user = ubuntu/g' /etc/php5/fpm/pool.d/www.conf
sed -i 's/group = www-data/group = ubuntu/g' /etc/php5/fpm/pool.d/www.conf
sed -i 's/owner = www-data/owner = ubuntu/g' /etc/php5/fpm/pool.d/www.conf
echo "Done!"

info "Configure NGINX"
sed -i 's/user www-data/user ubuntu/g' /etc/nginx/nginx.conf
echo "Done!"

info "Enabling site configuration"
ln -s /app/vagrant/nginx/aws.conf /etc/nginx/sites-enabled/app.conf
echo "Done!"

info "Initialize databases for MySQL"
mysql -uroot <<< "CREATE DATABASE y2redux"
mysql -uroot <<< "CREATE DATABASE y2redux_test"
echo "Done!"

info "Install composer"
curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

sed --in-place '/session.save_handler/d' /etc/php5/fpm/php.ini

rm -rf /usr/share/nginx/html
ln -s /app/frontend/web /usr/share/nginx/html
rm /etc/nginx/sites-enabled/default

info "Add latest node mirror"
curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -

info "Install latest node"
apt-get install -y nodejs
