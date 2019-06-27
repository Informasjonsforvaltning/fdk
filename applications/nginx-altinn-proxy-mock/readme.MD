The goal of the proxy mock is provide local aternative for simulating Altinn service. 

Demo localhost:

```

#run proxy
docker-compose up -d nginx-altinn-proxy-mock

#test
curl "http://localhost:8128/api/serviceowner/reportees?ForceEIAuthentication&subject=01066800187&servicecode=4814&serviceedition=3"
```
