The goal of the proxy is provide common access point for using Altinn service. 

NB! The proxy makes the protected service available to entire network. As of latest security practice, local network cannot be assumed safe, and zero trust (perimeterless) policy needs to be applied. Potential solutions could be service mesh (e.g. istio), mutual tls or oidc.

Features:
1. tls mutual authorization
2. proxy url rewrite
3. (todo) caching

Demo:

```
# set up required variables in env
cp .envrc.template .envrc
edit .envrc
. .envrc

#run proxy
docker-compose up -d nginx-altinn-proxy

#test
curl "http://localhost:8126/api/serviceowner/reportees?ForceEIAuthentication&subject=01066800187&servicecode=4814&serviceedition=3"
```