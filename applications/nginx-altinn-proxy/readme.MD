The goal of the proxy is provide common access point for using Altinn service. 

NB! The proxy makes the protected service available to entire network. As of latest security practice, local network cannot be assumed safe, and zero trust (perimeterless) policy needs to be applied. Potential solutions could be service mesh (e.g. istio), mutual tls or oidc.

Features:
1. tls mutual authorization
2. proxy url rewrite
3. (todo) caching

Demo localhost:

```
# set up required variables in env
cp .envrc.template .envrc
edit .envrc
. .envrc

#run proxy
docker-compose up -d nginx-altinn-proxy

#test
curl "http://localhost:8126/api/serviceowner/reportees?ForceEIAuthentication&subject=01066800187&servicecode=4814&serviceedition=1"
```

Test in it1, run in any container in cluster:
```
curl "http://nginx-altinn-proxy:8080/api/serviceowner/reportees?ForceEIAuthentication&subject=01066800187&servicecode=4814&serviceedition=1"
```

Test in prod, run in any container in cluster:
```
curl "http://nginx-altinn-proxy:8080/api/serviceowner/reportees?ForceEIAuthentication&subject=29037816165&servicecode=4814&serviceedition=1"
```


Debug:

If the above proxy test fails, check that straight service query works
```
curl "https://tt02.altinn.no/api/serviceowner/reportees?ForceEIAuthentication&subject=01066800187&servicecode=4814&serviceedition=1" --key ../../conf/altinn/br-altinn-client.key.pem --cert ../../conf/altinn/br-altinn-client.crt.pem -H "ApiKey:$ALTINN_API_KEY"
```

Do the same in container:
```
apk --no-cache add curl
curl "https://tt02.altinn.no/api/serviceowner/reportees?ForceEIAuthentication&subject=01066800187&servicecode=4814&serviceedition=1" --key /etc/nginx/client.key.pem --cert /etc/nginx/client.crt.pem -H "ApiKey:$ALTINN_API_KEY"
```