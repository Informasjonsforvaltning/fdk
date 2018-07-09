On mac, following commands could be useful:

```
#install minikube

brew cask install minikube
curl -LO https://storage.googleapis.com/minikube/releases/latest/docker-machine-driver-hyperkit && chmod +x docker-machine-driver-hyperkit && sudo mv docker-machine-driver-hyperkit /usr/local/bin/ && sudo chown root:wheel /usr/local/bin/docker-machine-driver-hyperkit && sudo chmod u+s /usr/local/bin/docker-machine-driver-hyperkit

minikube config set memory 8192
minikube config set vm-driver hyperkit

minikube start
minikube dashboard
minikube config view

# convert declaration and deploy to minikube
kompose -f docker-compose.yml -f docker-compose.kompose.yml  up

# delete deployments from minikube
kompose -f docker-compose.yml -f docker-compose.kompose.yml  down

# regenerate kubernetes declaration file 
kompose -f docker-compose.yml -f docker-compose.kompose.yml -o kubernetes.local.yml convert  

# deploy or change declaratation to minikube
kubectl apply -f kubernetes.local.yml

# open the dynamically mapped services in host machine
minikube service nginx-search
minikube service nginx-registration-ssl #(change to https manually)
minikube service harvester

# reset all
minikube stop
minikube delete
sudo rm -rf ~/.minikube
```

Todo
 - mount source code volumes