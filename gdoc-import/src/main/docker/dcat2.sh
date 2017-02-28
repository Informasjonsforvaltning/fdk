#!/bin/bash
# Main file to convert google sheet to DCAT turtle

LIB=/app/dcat/lib

CLASSPATH=lib/collection-0.6.jar:lib/httpcore-4.4.4.jar:lib/jena-iri-3.1.1.jar:lib/semex.jar:lib/commons-cli-1.3.jar:lib/jackson-annotations-2.7.0.jar:lib/jena-shaded-guava-3.1.1.jar:lib/simple-xml-2.3.6.jar:lib/commons-codec-1.10.jar:lib/jackson-core-2.7.4.jar:lib/jena-tdb-3.1.1.jar:lib/slf4j-api-1.7.21.jar:lib/commons-csv-1.3.jar:lib/jackson-databind-2.7.4.jar:lib/jsonld-java-0.7.0.jar:lib/slf4j-log4j12-1.7.21.jar:lib/commons-io-2.5.jar:lib/jcl-over-slf4j-1.7.21.jar:lib/jsonld-java-0.8.3.jar:lib/utilities.jar:lib/:lib/commons-lang3-3.4.jar:lib/jena-arq-3.1.1.jar:lib/junit-4.8.1.jar:lib/xercesImpl-2.11.0.jar:lib/expressionoasis-3.2.jar:lib/jena-base-3.1.1.jar:lib/jxl.jar:lib/xml-apis-1.4.01.jar:lib/httpclient-4.5.2.jar:lib/jena-cmds-3.1.1.jar:lib/libthrift-0.9.3.jar:lib/httpclient-cache-4.5.2.jar:lib/jena-core-3.1.1.jar:lib/log4j-1.2.17.jar:lib/semex.jar


echo STARTING GDOC SCRIPT
java -version

# Download from google docs
echo STEP 1 - Cleaning up google docs
rm in/*

#echo STEP 2 - Download from google
#curl -L "https://docs.google.com/spreadsheets/u/0/d/1sjZ0IC9yG94pPzB5CvsPJb2aSTlRkWAET44ZB99ny9s/export?format=xlsx&authuser=0" > ./in/datasett-from-gdocs.xlsx
#curl -L "https://docs.google.com/spreadsheets/d/1hOVhpfUu9e-bB2rXcHkTYEDTlHEy3Sh_KOnx3UgUeZU/export?format=xlsx&authuser=0" > ./in/datasett-oslo-kommune.xlsx
 

echo STEP 2 - Download from google
curl -L "https://docs.google.com/spreadsheets/u/0/d/1sjZ0IC9yG94pPzB5CvsPJb2aSTlRkWAET44ZB99ny9s/export?format=ods&authuser=0" > ./in/datasett-from-gdocs.ods
curl -L "https://docs.google.com/spreadsheets/d/1hOVhpfUu9e-bB2rXcHkTYEDTlHEy3Sh_KOnx3UgUeZU/export?format=ods&authuser=0" > ./in/datasett-oslo-kommune.ods


echo STEP 3 - extracting content
unzip -o ./in/datasett-from-gdocs.ods  content.xml -d in
mv in/content.xml in/datasett-from-gdocs.odsxml
unzip -o ./in/datasett-oslo-kommune.ods  content.xml -d in
mv in/content.xml in/datasett-oslo-kommune.odsxml

echo STEP 4 - expand the format due to a compact table format
for file in in/*.odsxml
do
    echo ...converting $file to XML
    filename=$(basename "$file")
    xsltproc mapper/ods2cleanxmltable.xsl  $file > in/$filename.xml
done

# Convert all XLSX to XLS
#echo STEP 3 - Convert XLSX to XLS
#for file in in/*.xlsx
#do
#    echo ...converting $file to xls...
##    soffice --headless -env:UserInstallation=file:///home/1000 --convert-to xls --outdir ./in $file
# soffice --headless --convert-to xls --outdir ./in $file
#    echo ...converted $file to xls
#done


echo STEP 5 - convert XML to TTL
for file in in/*.xml
do
    echo ...converting $file to TTL
    filename=$(basename "$file")
    xsltproc mapper/cleanxmltable2ttl.xsl $file > in/$filename.ttl
    echo converted $file to $filename.ttl
done


# Syntactical translation from Excel to RDF
#echo STEP 4 - Syntactical translation from Excel to RDF
#for file in in/*.xls
#do 
#    echo converting $file to ttl
#    filename=$(basename "$file")
#    #java -Xss2m -Xmx512M -cp "$LIB/*" com.computas.opendata.semex.Semex -Dlog4j.configuration=file:log4j.properties -input $file -mapper mapper/mapper.ttl -output in/$filename.ttl
#    java -Xss2m -Xmx512M -cp $CLASSPATH com.computas.opendata.semex.Semex -input $file -mapper mapper/mapper.ttl -output in/$filename.ttl
#    echo converted $file to $filename.ttl
#done


# Catalog
echo STEP 4 - Create catalogs
for file in in/*.ttl
do 
    echo creating catalogs from $file
    filename=$(basename "$file")
    java -cp $CLASSPATH jena.sparql --data=$file --query=mapper/catalog.sparql >temp/$filename-catalog.ttl
    echo created catalogs in $filename-catalog.ttl
done

# Dataset
echo STEP 5 - Create datasets
for file in in/*.ttl
do 
    echo creating datasets from $file
    filename=$(basename "$file")
    java -cp $CLASSPATH jena.sparql --data=$file --query=mapper/dataset.sparql >temp/$filename-dataset.ttl
    echo created datasets in $filename-dataset.ttl
done


# Period of dataset
echo STEP 6 - Period of dataset
for file in in/*.ttl
do
    echo converting $file to dcat format
    filename=$(basename "$file")
    java -cp $CLASSPATH jena.sparql --data=$file --query=mapper/addPeriod.sparql > temp/$filename-period.ttl
    echo added period $file to $filename-period.ttl
done

# Publisher
echo STEP 7 - Create Publisher
for file in in/*.ttl
do 
    echo creating publisher from $file
    filename=$(basename "$file")
    java -cp $CLASSPATH jena.sparql --data=$file --query=mapper/publisher.sparql >temp/$filename-publisher.ttl
    echo created publisher in $filename-publisher.ttl
done

# Contact point
echo STEP 8 - Create ContactPoint
for file in in/*.ttl
do 
    echo creating contact point from $file
    filename=$(basename "$file")
    java -cp $CLASSPATH jena.sparql --data=$file --query=mapper/contact.sparql >temp/$filename-contact.ttl
    echo created contact point in $filename-contact.ttl
done

# Provenance
echo STEP 9 - Create Provenance
for file in in/*.ttl
do 
    echo creating provenance from $file
    filename=$(basename "$file")
    java -cp $CLASSPATH jena.sparql --data=$file --query=mapper/provenance.sparql >temp/$filename-provenance.ttl
    echo created provenance in $filename-provenance.ttl
done

# Location
echo STEP 10 - Create Location
for file in in/*.ttl
do 
    echo creating location from $file
    filename=$(basename "$file")
    java -cp $CLASSPATH jena.sparql --data=$file --query=mapper/location.sparql >temp/$filename-location.ttl
    echo created location in $filename-location.ttl
done

# Access Rights
echo STEP 11 - Create Access Rights
for file in in/*.ttl
do 
    echo creating access rights from $file
    filename=$(basename "$file")
    java -cp $CLASSPATH jena.sparql --data=$file --query=mapper/accessRights.sparql >temp/$filename-accessRights.ttl
    echo created access rights in $filename-accessRights.ttl
done


# Distribution
echo STEP 12 - Create Distributions
for file in in/*.ttl
do
    echo creating distributions from $file
    filename=$(basename "$file")
    java -cp $CLASSPATH jena.sparql --data=$file --query=mapper/distribution.sparql >temp/$filename-distribution.ttl
    echo created distribution in $filename-distribution.ttl
done


# Merge all
echo STEP 12 - MERGE ALL
now=`date +"%Y-%m-%d"`
for file in in/*.ttl
do
    echo converting $file to dcat format
    filename=$(basename "$file")
    java -cp $CLASSPATH jena.riot  --formatted=TTL temp/$filename-catalog.ttl temp/$filename-dataset.ttl temp/$filename-period.ttl  temp/$filename-publisher.ttl temp/$filename-contact.ttl temp/$filename-provenance.ttl  temp/$filename-location.ttl temp/$filename-accessRights.ttl  temp/$filename-distribution.ttl > publish/$filename-finished-$now.ttl
    echo merged 
done


# Validate
echo STEP 13 - VALIDATE
for file in publish/*-finished-$now.ttl
do
    for rule in validation/*.sparql
    do
        java -cp $CLASSPATH jena.sparql --data=$file --query=$rule
    done
done

# Update
#mvn test -f /usr/local/src/services/fdk/ -Dtest=LoadExampleData  -DfailIfNoTests=false