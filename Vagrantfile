require 'yaml'
require 'fileutils'

domains = {
  frontend: 'y2redux-frontend.dev',
  backend:  'y2redux-backend.dev'
}

config = {
  local: './vagrant/config/vagrant-local.yml',
  example: './vagrant/config/vagrant-local.example.yml'
}

# copy config from example if local config not exists
FileUtils.cp config[:example], config[:local] unless File.exist?(config[:local])
# read config
options = YAML.load_file config[:local]

# check github token
if options['github_token'].nil? || options['github_token'].to_s.length != 40
  puts "You must place REAL GitHub token into configuration:\n/yii2-app-advanced/vagrant/config/vagrant-local.yml"
  exit
end

# vagrant configurate
Vagrant.configure(2) do |config|
  # select the box
  config.vm.box = 'ubuntu/trusty64'

  config.vm.provider 'virtualbox' do |vb,override|
    # should we ask about box updates?
    override.vm.box_check_update = options['box_check_update']

    # machine cpus count
    vb.cpus = options['cpus']
    # machine memory size
    vb.memory = options['memory']
    # machine name (for VirtualBox UI)
    vb.name = options['machine_name']
    # network settings
    override.vm.network 'private_network', ip: options['ip']

    # sync: folder 'y2redux' (host machine) -> folder '/app' (guest machine)
    override.vm.synced_folder './', '/app', owner: 'vagrant', group: 'vagrant'

    # disable folder '/vagrant' (guest machine)
    override.vm.synced_folder '.', '/vagrant', disabled: true

    # hosts settings (host machine)
    override.vm.provision :hostmanager
    override.hostmanager.enabled            = true
    override.hostmanager.manage_host        = true
    override.hostmanager.ignore_private_ip  = false
    override.hostmanager.include_offline    = true
    override.hostmanager.aliases            = domains.values

    # provisioners
    override.vm.provision 'shell', path: './vagrant/provision/vb/once-as-root.sh', args: [options['timezone']]
    override.vm.provision 'shell', path: './vagrant/provision/vb/once-as-vagrant.sh', args: [options['github_token']], privileged: false
    override.vm.provision 'shell', path: './vagrant/provision/vb/always-as-root.sh', run: 'always'

    # post-install message (vagrant console)
    override.vm.post_up_message = "Frontend URL: http://#{domains[:frontend]}\nBackend URL: http://#{domains[:backend]}"
  end

  config.vm.provider :aws do |aws, override|
    override.vm.box_check_update = false

    # vagrant box add dummy https://github.com/mitchellh/vagrant-aws/raw/master/dummy.box
    override.vm.box = "dummy"
    aws.access_key_id = options['aws_access_key']
    aws.secret_access_key = options['aws_secret_key']
    aws.region = options['aws_region']
    aws.availability_zone = options['aws_availability_zone']
    aws.terminate_on_shutdown = true
    #aws.security_groups = options['aws_security_groups']

    # AMI from which we'll launch EC2 Instance
    aws.ami =  "ami-9a562df2" # Ubuntu 14.04
    aws.keypair_name = options['aws_keypair_name']
    aws.instance_type = "t2.micro"
    aws.block_device_mapping = [{ 'DeviceName' => '/dev/sda1', 'Ebs.VolumeSize' => 10 }]
    aws.subnet_id = options['aws_subnet_id']
    aws.associate_public_ip = true
    aws.tags = {
		'Name' => 'Vagrant EC2 Instance',
		'Environment' => 'vagrant-sandbox'
		}
    # Credentials to login to EC2 Instance
    override.ssh.username = "ubuntu"
    override.ssh.private_key_path = options['aws_private_key']
    # sync: folder 'y2redux' (host machine) -> folder '/app' (guest machine)
    override.vm.synced_folder './', '/app', owner: 'ubuntu', group: 'ubuntu', rsync__chown: true, rsync__exclude: [
        ".git",
        ".vagrant",
        "frontend/runtime",
        "backend/runtime",
        "console/runtime",
        # "frontend/web/assets",
        "backend/web/assets",
		"frontend/config/main-local.php",
		"backend/config/main-local.php",
		"console/config/main-local.php",
		"frontend/config/params-local.php",
		"backend/config/params-local.php",
		"console/config/params-local.php",
        "vendor",
        "node_modules"
     ]

    # disable folder '/vagrant' (guest machine)
    override.vm.synced_folder '.', '/vagrant', disabled: true, rsync__chown: false

    # provisioners
    override.vm.provision 'shell', path: './vagrant/provision/aws/once-as-root.sh', args: [options['timezone']]
    override.vm.provision 'shell', path: './vagrant/provision/aws/once-as-vagrant.sh', args: [options['github_token']], privileged: false
    override.vm.provision 'shell', path: './vagrant/provision/aws/always-as-root.sh', run: 'always'
  end

  # machine name (for vagrant console)
  config.vm.define options['machine_name']

  # machine name (for guest machine console)
  config.vm.hostname = options['machine_name']
end

