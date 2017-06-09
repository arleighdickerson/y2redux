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

info "Allocate swap for MySQL 5.6"
fallocate -l 2048M /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap defaults 0 0' >> /etc/fstab

info "Allocate moar file watchers"
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
sysctl --system

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
apt-get install -y software-properties-common
apt-key adv --recv-keys --keyserver hkp://keyserver.ubuntu.com:80 0x5a16e7281be7a449
add-apt-repository "deb http://dl.hhvm.com/ubuntu trusty main"
apt-get update
apt-get upgrade -y

info "Install additional software"
apt-get install -y git nginx mysql-server-5.6 hhvm php5-curl php5-cli php5-intl php5-mysqlnd php5-gd php5-fpm

info "Configure MySQL"
sed -i "s/.*bind-address.*/bind-address = 0.0.0.0/" /etc/mysql/my.cnf
echo "Done!"

info "Configure NGINX"
sed -i 's/user www-data/user vagrant/g' /etc/nginx/nginx.conf
sed --in-place 's/sendfile\ on/sendfile\ off/g' /etc/nginx/nginx.conf
echo "Done!"

info "Configure HHVM"
update-rc.d hhvm defaults
update-alternatives --install /usr/bin/php php /usr/bin/hhvm 60
sed -i "s/hhvm.server.port.*/hhvm.server.file_socket=\/var\/run\/hhvm\/sock/g" /etc/hhvm/server.ini
sed --in-place '/session./d' /etc/hhvm/server.ini
sed --in-place '/session./d' /etc/hhvm/php.ini
echo 'RUN_AS_USER="vagrant"
RUN_AS_GROUP="vagrant"
' >> /etc/default/hhvm
chown -R vagrant /var/run/hhvm

info "Configure XDEBUG"
echo "
xdebug.enable=1
xdebug.remote_enable=1
xdebug.default_enable=1
xdebug.remote_handler=dbgp
xdebug.remote_host=10.0.2.2
debug.max_nesting_level=256
xdebug.idekey=PHPSTORM
" >> /etc/hhvm/php.ini

info "Configure PHP-FPM"
apt-get install -y php5-curl php5-cli php5-intl php5-mysqlnd php5-gd php5-fpm
sed -i 's/user = www-data/user = vagrant/g' /etc/php5/fpm/pool.d/www.conf
sed -i 's/group = www-data/group = vagrant/g' /etc/php5/fpm/pool.d/www.conf
sed -i 's/owner = www-data/owner = vagrant/g' /etc/php5/fpm/pool.d/www.conf
echo "Done!"

info "Enabling site configuration"
ln -sf /app/vagrant/nginx/vb.conf /etc/nginx/sites-enabled/app.conf
echo "Done!"

info "Initialize databases for MySQL"
mysql -uroot <<< "CREATE DATABASE y2redux"
mysql -uroot <<< "CREATE DATABASE y2redux_test"
echo "Done!"
