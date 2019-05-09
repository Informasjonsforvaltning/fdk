The goal of the proxy is provide common access point for using Enhetsregisteret service. 

Demo:

```
#run proxy
docker-compose up -d nginx-enhetsregisteret-proxy

#test
curl http://localhost:8130/enhetsregisteret/api/enheter/899183932
```