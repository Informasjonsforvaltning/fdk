#!/bin/bash
#script to copy data from Elasticsearc production environment
#NB husk å gjøre om cronjob til å kjøre en gang i døgnet
echo "Echo starting elasticsearch index copy" >> /var/log/backup.log 2>&1

#copy dcat index
/usr/local/bin/elasticdump \
--input=http://elasticsearch:9200/dcat \
--output=/escopydata/dcat_data.json \
--type=data >> /var/log/backup.log 2>&1
/usr/local/bin/elasticdump \
--input=http://elasticsearch:9200/dcat \
--output=/escopydata/dcat_mapping.json \
--type=mapping >> /var/log/backup.log 2>&1
/usr/local/bin/elasticdump \
--input=http://elasticsearch:9200/dcat \
--output=/escopydata/dcat_analyzer.json \
--type=analyzer >> /var/log/backup.log 2>&1
tar czf /escopydata/dcat-`date +%Y-%m-%dT%H-%M.tgz` /escopydata/dcat_* >> /var/log/backup.log 2>&1
rm /escopydata/dcat_data.json
rm /escopydata/dcat_mapping.json
rm /escopydata/dcat_analyzer.json
echo "Elasticsearch index copy finished" >> /var/log/backup.log 2>&1
cp /var/log/backup.log /escopydata/dcat_`date +%Y-%m-%dT%H-%M.log`
rm /var/log/backup.log

#copy scat index
/usr/local/bin/elasticdump \
--input=http://elasticsearch:9200/scat \
--output=/escopydata/scat_data.json \
--type=data >> /var/log/backup.log 2>&1
/usr/local/bin/elasticdump \
--input=http://elasticsearch:9200/scat \
--output=/escopydata/scat_mapping.json \
--type=mapping >> /var/log/backup.log 2>&1
/usr/local/bin/elasticdump \
--input=http://elasticsearch:9200/scat \
--output=/escopydata/scat_analyzer.json \
--type=analyzer >> /var/log/backup.log 2>&1
tar czf /escopydata/scat-`date +%Y-%m-%dT%H-%M.tgz` /escopydata/scat_* >> /var/log/backup.log 2>&1
rm /escopydata/scat_data.json
rm /escopydata/scat_mapping.json
rm /escopydata/scat_analyzer.json
echo "Elasticsearch index copy finished" >> /var/log/backup.log 2>&1
cp /var/log/backup.log /escopydata/scat_`date +%Y-%m-%dT%H-%M.log`
rm /var/log/backup.log

#copy themes index
/usr/local/bin/elasticdump \
--input=http://elasticsearch:9200/themes \
--output=/escopydata/themes_data.json \
--type=data >> /var/log/backup.log 2>&1
/usr/local/bin/elasticdump \
--input=http://elasticsearch:9200/themes \
--output=/escopydata/themes_mapping.json \
--type=mapping >> /var/log/backup.log 2>&1
/usr/local/bin/elasticdump \
--input=http://elasticsearch:9200/themes \
--output=/escopydata/themes_analyzer.json \
--type=analyzer >> /var/log/backup.log 2>&1
tar czf /escopydata/themes-`date +%Y-%m-%dT%H-%M.tgz` /escopydata/themes_* >> /var/log/backup.log 2>&1
rm /escopydata/themes_data.json
rm /escopydata/themes_mapping.json
rm /escopydata/themes_analyzer.json
echo "Elasticsearch index copy finished" >> /var/log/backup.log 2>&1
cp /var/log/backup.log /escopydata/themes_`date +%Y-%m-%dT%H-%M.log`
rm /var/log/backup.log

#copy registration index
/usr/local/bin/elasticdump \
--input=http://elasticsearch:9200/registration \
--output=/escopydata/registration_data.json \
--type=data >> /var/log/backup.log 2>&1
/usr/local/bin/elasticdump \
--input=http://elasticsearch:9200/registration \
--output=/escopydata/registration_mapping.json \
--type=mapping >> /var/log/backup.log 2>&1
/usr/local/bin/elasticdump \
--input=http://elasticsearch:9200/registration \
--output=/escopydata/registration_analyzer.json \
--type=analyzer >> /var/log/backup.log 2>&1
tar czf /escopydata/registration-`date +%Y-%m-%dT%H-%M.tgz` /escopydata/registration_* >> /var/log/backup.log 2>&1
rm /escopydata/registration_data.json
rm /escopydata/registration_mapping.json
rm /escopydata/registration_analyzer.json
echo "Elasticsearch index copy finished" >> /var/log/backup.log 2>&1
cp /var/log/backup.log /escopydata/registration_`date +%Y-%m-%dT%H-%M.log`
rm /var/log/backup.log