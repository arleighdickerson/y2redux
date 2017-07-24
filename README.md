Yii2 React/Redux Isomorphic Boilerplate
=======================================

## [Demo](https://www.arleigh.io)


Features
---------------------------------------
### JS
- Uses ES6 and JSX
- Development mode supports Hot Module Replacement
- Production mode optionally supports isomorphic rendering via node as service
### Vagrant
- Your choice of HHVM (default) or PHP interpreters
- Pre-configured debugger (XDebug) for remote usage on the HOST MACHINE
    - remote host: 192.168.83.138 
    - idekey: PHPSTORM
- Includes Virtualbox and EC2 (in progress) providers

### Google
- Analytics supported out of box (requires google tracking id)
- Recaptcha supported out of box (requires google recaptcha API keys)

Installation
---------------------------------------
(pretty much the same as https://github.com/yiisoft/yii2-app-advanced/blob/master/docs/guide/start-installation.md)

1. copy vagrant/config/vagrant-local.example.yml to vagrant/config/vagrant-local.yml
2. in vagrant/config/vagrant-local.yml, replace (your-personal-github-token) with your personal github token
    - Read more: https://github.com/blog/1509-personal-api-tokens
    - You can generate it here: https://github.com/settings/tokens
3. in the project root, do `./install-the-kitchen-sink', which will take care of the rest

Usage
---------------------------------------

### Development
**From the project root of the HOST MACHINE:**
- do `./init --environment=Development --overwrite=all` to set the yii application to development mode 
- ensure that the vagrant box is running by doing `vagrant up`
- do `npm run dev` to start the dev server

### Production
**From the project root of the HOST MACHINE:**
- do `./init --environment=Production --overwrite=all` to set the yii application to production mode
- do `npm run compile` to create the static asset files
- to use CLIENT-SIDE rendering: change 'isomorphic' to false in frontend/config/params-local.php
- to use ISOMORPHIC rendering: turn on the node rendering service by running `npm run prod`
    
When using the default Virtualbox provider, the application can be accessed at http://y2redux-frontend.dev on the HOST MACHINE.

Optional Configuration
---------------------------------------
- Google Components
    - Analytics
        - get a google tracking id (see https://support.google.com/analytics/answer/1008015?hl=en)
        - put the tracking id as a json string in secrets/google/analytics/id.json
    - Recaptcha 
        - get your recaptcha API keys (see https://www.google.com/recaptcha)
        - put the site key as a json string in secrets/google/recaptcha/siteKey.json
        - put the secret key as a json string in secrets/google/recaptcha/secretKey.json

