apisApiResponse.json is generated as:

curl "https://fellesdatakatalog.brreg.no/api-cat/api/search?q=barnehage&size=50" -o applications/search/src/pages/search-page/__fixtures/apisApiResponse.json

datasetsApiResponse.json is generated as:
curl "https://fellesdatakatalog.brreg.no/datasets?q=Marka&size=50" -H "Accept: application/json" -o applications/search/src/pages/search-page/__fixtures/datasetsApiResponse.json

todo - instead of readme, each json could have corresponding .sh script to update. 