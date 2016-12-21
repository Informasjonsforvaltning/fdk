#!/bin/sh

LIB=/usr/local/dcat/lib

# Download from google docs
echo STEP 1 - Download from google
curl -L "https://docs.google.com/spreadsheets/u/0/d/1sjZ0IC9yG94pPzB5CvsPJb2aSTlRkWAET44ZB99ny9s/export?format=xlsx&authuser=0" > ./in/datasett-from-gdocs.xlsx
echo downloaded datasett-from-gdocs.xlsx

# Convert all XLSX to XLS
echo STEP 2 - Convert XLSX to XLS
for file in in/*.xlsx
do
    echo converting $file to xls...
    soffice --headless --convert-to xls --outdir ./in $file
    echo converted $file to xls
done
echo conversion done.


java -version

#Syntactical translation from Excel to RDF
echo STEP 3 - Syntactical translation from Excel to RDF
for file in in/*.xls
do 
    echo converting $file to ttl
    filename=$(basename "$file")
    #java -Xss2m -Xmx512M -cp "$LIB/*" com.computas.opendata.semex.Semex -Dlog4j.configuration=file:log4j.properties -input $file -mapper mapper/mapper.ttl -output in/$filename.ttl
    java -Xss2m -Xmx512M -cp "$LIB/*" com.computas.opendata.semex.Semex -input $file -mapper mapper/mapper.ttl -output in/$filename.ttl
    echo converted $file to $filename.ttl
done


# Catalog
echo STEP 4 - Create catalogs
for file in in/*.ttl
do 
    echo creating catalogs from $file
    filename=$(basename "$file")
    java -cp "$LIB/*"  jena.sparql --data=$file --query=mapper/catalog.sparql >temp/$filename-catalog.ttl
    echo created catalogs in $filename-catalog.ttl
done

# Dataset
echo STEP 5 - Create datasets
for file in in/*.ttl
do 
    echo creating datasets from $file
    filename=$(basename "$file")
    java -cp "$LIB/*" jena.sparql --data=$file --query=mapper/dataset.sparql >temp/$filename-dataset.ttl
    echo created datasets in $filename-dataset.ttl
done


# Period of dataset
echo STEP 6 - Period of dataset
for file in in/*.ttl
do
    echo converting $file to dcat format
    filename=$(basename "$file")
    java -cp "$LIB/*" jena.sparql --data=$file --query=mapper/addPeriod.sparql > temp/$filename-period.ttl
    echo added period $file to $filename-period.ttl
done

# Publisher
echo STEP 7 - Create Publisher
for file in in/*.ttl
do 
    echo creating publisher from $file
    filename=$(basename "$file")
    java -cp "$LIB/*" jena.sparql --data=$file --query=mapper/publisher.sparql >temp/$filename-publisher.ttl
    echo created publisher in $filename-publisher.ttl
done

# Contact point
echo STEP 8 - Create ContactPoint
for file in in/*.ttl
do 
    echo creating contact point from $file
    filename=$(basename "$file")
    java -cp "$LIB/*" jena.sparql --data=$file --query=mapper/contact.sparql >temp/$filename-contact.ttl
    echo created contact point in $filename-contact.ttl
done

# Provenance
echo STEP 9 - Create Provenance
for file in in/*.ttl
do 
    echo creating provenance from $file
    filename=$(basename "$file")
    java -cp "$LIB/*" jena.sparql --data=$file --query=mapper/provenance.sparql >temp/$filename-provenance.ttl
    echo created provenance in $filename-provenance.ttl
done

# Location
echo STEP 10 - Create Location
for file in in/*.ttl
do 
    echo creating location from $file
    filename=$(basename "$file")
    java -cp "$LIB/*" jena.sparql --data=$file --query=mapper/location.sparql >temp/$filename-location.ttl
    echo created location in $filename-location.ttl
done

# Access Rights
echo STEP 11 - Create Access Rights
for file in in/*.ttl
do 
    echo creating access rights from $file
    filename=$(basename "$file")
    java -cp "$LIB/*" jena.sparql --data=$file --query=mapper/accessRights.sparql >temp/$filename-accessRights.ttl
    echo created access rights in $filename-accessRights.ttl
done


# Merge all
echo STEP 12 - MERGE ALL
now=`date +"%Y-%m-%d"`
for file in in/*.ttl
do
    echo converting $file to dcat format
    filename=$(basename "$file")
    java -cp "$LIB/*" jena.riot  --formatted=TTL temp/$filename-catalog.ttl temp/$filename-dataset.ttl temp/$filename-period.ttl  temp/$filename-publisher.ttl temp/$filename-contact.ttl temp/$filename-provenance.ttl  temp/$filename-location.ttl temp/$filename-accessRights.ttl  > publish/$filename-finished-$now.ttl
    echo merged 
done


# Validate
echo STEP 13 - VALIDATE
for file in publish/*-finished-$now.ttl
do
    for rule in validation/*.sparql
    do
        java -cp "$LIB/*" jena.sparql --data=$file --query=$rule
    done
done

# Update
#mvn test -f /usr/local/src/services/fdk/ -Dtest=LoadExampleData  -DfailIfNoTests=false