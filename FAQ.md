# The National Data Directory (Felles datakatalog) FAQ

##I want to run queries against your data, how do I do that ? 

You can use curl or postman. Remember to use application/json, and also note the url inconsistencies in the various types of stored data. 

Examples:
curl -i -H "accept: application/json" -H "Content-Type: application/json" -X GET https://fellesdatakatalog.brreg.no/datasets
curl -i -H "accept: application/json" -H "Content-Type: application/json" -X GET https://fellesdatakatalog.brreg.no/api/apis

For more examples and further information see : 
https://informasjonsforvaltning.github.io/felles-datakatalog/

Or the following links for examples of the particular data modality you want to query: 
https://informasjonsforvaltning.github.io/felles-datakatalog/datasett-katalog/api/
https://informasjonsforvaltning.github.io/felles-datakatalog/api-katalog/api/
https://informasjonsforvaltning.github.io/felles-datakatalog/begrepskatalog/api/
https://informasjonsforvaltning.github.io/felles-datakatalog/informasjonsmodell-katalog/api/

##How do I submit my datasets/apis/concepts/information models to felles datakatalog ?
See https://fellesdatakatalog.brreg.no/about-registration for datasets and apis