# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|

  config.vm.box = "generic/debian9"
  config.vm.box_check_update = false

  # Пробрасываем порты для доступа из вне (с хост машины)
  config.vm.network "forwarded_port", guest: 80, host: 8080, auto_correct: true
  config.vm.network "forwarded_port", guest: 3000, host: 3000, auto_correct: true
  config.vm.network "forwarded_port", guest: 27017, host: 28017, auto_correct: true
  config.vm.network "forwarded_port", guest: 27018, host: 28018, auto_correct: true

  # Rsync для работы с файлами
  config.vm.synced_folder ".", "/vagrant"

  # Настраиваем провизион. Ставим все что нужно и конфигуряем
  config.vm.provision "shell", inline: <<-SHELL
    apt-get update
    apt-get install -y curl build-essential libssl-dev dirmngr
    apt-get remove -y nodejs

    curl -sL https://deb.nodesource.com/setup_11.x | bash -
    apt-get install -y nodejs

    apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 9DA31620334BD75D9DCB49F368818C72E52529D4
    echo "deb http://repo.mongodb.org/apt/debian stretch/mongodb-org/4.0 main" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.0.list
    apt-get update
    apt-get install -y mongodb-org

    sudo service mongod stop

    mv /etc/mongod.conf /etc/mongod.conf.bak
    cp /vagrant/mongod.conf /etc/mongod.conf
	
	mkdir /mongo-data
	chown -R mongodb:mongodb /mongo-data
	chmod -R 775 /mongo-data
	
    sudo service mongod start

    cd /vagrant
    npm install
    npm install -g nodemon

  SHELL


end