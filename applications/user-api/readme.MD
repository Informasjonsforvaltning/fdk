The goal of user API is to provide REST based proxy for allowed users
Internally, the implementation proxies the user data from Altinn, through module "nginx-altinn-proxy" 

Test:

```
#run user-api
docker-compose up -d user-api

#test
curl "http://localhost:8124/users/03096000854"
```
