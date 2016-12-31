#!/usr/bin/env bash

#== Import script args ==

github_token=$(echo "$1")

#== Bash helpers ==

function info {
  echo " "
  echo "--> $1"
  echo " "
}

#== Provision script ==

info "Provision-script user: `whoami`"


info "Configure composer"
composer config --global github-oauth.github.com ${github_token}
echo "Done!"

info "Install plugins for composer"
composer global require "fxp/composer-asset-plugin:^1.2.0" --no-progress

info "Install codeception"
composer global require "codeception/codeception=2.0.*" "codeception/specify=*" "codeception/verify=*" --no-progress
echo 'export PATH=/home/ubuntu/.config/composer/vendor/bin:$PATH' | tee -a /home/ubuntu/.profile

info "Install composer dependencies"
cd /app

mkdir -p frontend/runtime
chmod 777 frontend/runtime
mkdir -p backend/runtime
chmod 777 backend/runtime
mkdir -p console/runtime
chmod 777 console/runtime
mkdir -p frontend/web/assets
chmod 755 frontend/web/assets
mkdir -p backend/web/assets
chmod 755 backend/web/assets
composer --no-progress --prefer-dist --ignore-platform-reqs install

info "Init project"
./init --env=Development --overwrite=y

info "Apply migrations"
./yii migrate <<< "yes"

info "Enabling colorized prompt for guest console"
sed -i "s/#force_color_prompt=yes/force_color_prompt=yes/" /home/ubuntu/.bashrc

info "enable vi mode"
echo "set -o vi" >> /home/ubuntu/.bashrc

info "flush caches"
./yii cache/flush-all

info "Install npm dependencies"
npm install
