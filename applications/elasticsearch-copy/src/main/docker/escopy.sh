#!/bin/bash
#script to copy data from Elasticsearc production environment
#NB husk å gjøre om cronjob til å kjøre en gang i døgnet
echo "Echo starting elasticsearch index copy" >> /escopydata/backup.log 2>&1

#copy dcat index
/usr/local/bin/elasticdump \
--input=http://elasticsearch:9200/dcat \
--output=/escopydata/dcat_data.json \
--type=data >> /escopydata/backup.log 2>&1
/usr/local/bin/elasticdump \
--input=http://elasticsearch:9200/dcat \
--output=/escopydata/dcat_mapping.json \
--type=mapping >> /escopydata/backup.log 2>&1
/usr/local/bin/elasticdump \
--input=http://elasticsearch:9200/dcat \
--output=/escopydata/dcat_analyzer.json \
--type=analyzer >> /escopydata/backup.log 2>&1
tar czf /escopydata/dcat-`date +%Y-%m-%dT%H-%M.tgz` /escopydata/dcat_* >> /escopydata/backup.log 2>&1
rm /escopydata/dcat_data.json
rm /escopydata/dcat_mapping.json
rm /escopydata/dcat_analyzer.json
echo "Elasticsearch index copy finished" >> /escopydata/backup.log 2>&1
cp /escopydata/backup.log /escopydata/dcat_`date +%Y-%m-%dT%H-%M.log`
rm /escopydata/backup.log

#copy scat index
/usr/local/bin/elasticdump \
--input=http://elasticsearch:9200/scat \
--output=/escopydata/scat_data.json \
--type=data >> /escopydata/backup.log 2>&1
/usr/local/bin/elasticdump \
--input=http://elasticsearch:9200/scat \
--output=/escopydata/scat_mapping.json \
--type=mapping >> /escopydata/backup.log 2>&1
/usr/local/bin/elasticdump \
--input=http://elasticsearch:9200/scat \
--output=/escopydata/scat_analyzer.json \
--type=analyzer >> /escopydata/backup.log 2>&1
tar czf /escopydata/scat-`date +%Y-%m-%dT%H-%M.tgz` /escopydata/scat_* >> /escopydata/backup.log 2>&1
rm /escopydata/scat_data.json
rm /escopydata/scat_mapping.json
rm /escopydata/scat_analyzer.json
echo "Elasticsearch index copy finished" >> /escopydata/backup.log 2>&1
cp /escopydata/backup.log /escopydata/scat_`date +%Y-%m-%dT%H-%M.log`
rm /escopydata/backup.log

#copy themes index
/usr/local/bin/elasticdump \
--input=http://elasticsearch:9200/theme \
--output=/escopydata/theme_data.json \
--type=data >> /escopydata/backup.log 2>&1
/usr/local/bin/elasticdump \
--input=http://elasticsearch:9200/theme \
--output=/escopydata/theme_mapping.json \
--type=mapping >> /escopydata/backup.log 2>&1
/usr/local/bin/elasticdump \
--input=http://elasticsearch:9200/theme \
--output=/escopydata/theme_analyzer.json \
--type=analyzer >> /escopydata/backup.log 2>&1
tar czf /escopydata/theme-`date +%Y-%m-%dT%H-%M.tgz` /escopydata/theme_* >> /escopydata/backup.log 2>&1
rm /escopydata/theme_data.json
rm /escopydata/theme_mapping.json
rm /escopydata/theme_analyzer.json
echo "Elasticsearch index copy finished" >> /escopydata/backup.log 2>&1
cp /escopydata/backup.log /escopydata/theme_`date +%Y-%m-%dT%H-%M.log`
rm /escopydata/backup.log

#copy register index
/usr/local/bin/elasticdump \
--input=http://elasticsearch:9200/register \
--output=/escopydata/register_data.json \
--type=data >> /escopydata/backup.log 2>&1
/usr/local/bin/elasticdump \
--input=http://elasticsearch:9200/register \
--output=/escopydata/register_mapping.json \
--type=mapping >> /escopydata/backup.log 2>&1
/usr/local/bin/elasticdump \
--input=http://elasticsearch:9200/register \
--output=/escopydata/register_analyzer.json \
--type=analyzer >> /escopydata/backup.log 2>&1
tar czf /escopydata/register-`date +%Y-%m-%dT%H-%M.tgz` /escopydata/register* >> /escopydata/backup.log 2>&1
rm /escopydata/register_data.json
rm /escopydata/register_mapping.json
rm /escopydata/register_analyzer.json
echo "Elasticsearch index copy finished" >> /escopydata/backup.log 2>&1
cp /escopydata/backup.log /escopydata/register_`date +%Y-%m-%dT%H-%M.log`
rm /escopydata/backup.log

#copy codes index
/usr/local/bin/elasticdump \
--input=http://elasticsearch:9200/codes \
--output=/escopydata/codes_data.json \
--type=data >> /escopydata/backup.log 2>&1
/usr/local/bin/elasticdump \
--input=http://elasticsearch:9200/codes \
--output=/escopydata/codes_mapping.json \
--type=mapping >> /escopydata/backup.log 2>&1
/usr/local/bin/elasticdump \
--input=http://elasticsearch:9200/codes \
--output=/escopydata/codes_analyzer.json \
--type=analyzer >> /escopydata/backup.log 2>&1
tar czf /escopydata/codes-`date +%Y-%m-%dT%H-%M.tgz` /escopydata/codes* >> /escopydata/backup.log 2>&1
rm /escopydata/codes_data.json
rm /escopydata/codes_mapping.json
rm /escopydata/codes_analyzer.json
echo "Elasticsearch index copy finished" >> /escopydata/backup.log 2>&1
cp /escopydata/backup.log /escopydata/codes_`date +%Y-%m-%dT%H-%M.log`
rm /escopydata/backup.log

#copy harvest index
/usr/local/bin/elasticdump \
--input=http://elasticsearch:9200/harvest \
--output=/escopydata/harvest_data.json \
--type=data >> /escopydata/backup.log 2>&1
/usr/local/bin/elasticdump \
--input=http://elasticsearch:9200/harvest \
--output=/escopydata/harvest_mapping.json \
--type=mapping >> /escopydata/backup.log 2>&1
/usr/local/bin/elasticdump \
--input=http://elasticsearch:9200/harvest \
--output=/escopydata/harvest_analyzer.json \
--type=analyzer >> /escopydata/backup.log 2>&1
tar czf /escopydata/harvest-`date +%Y-%m-%dT%H-%M.tgz` /escopydata/harvest* >> /escopydata/backup.log 2>&1
rm /escopydata/harvest_data.json
rm /escopydata/harvest_mapping.json
rm /escopydata/harvest_analyzer.json
echo "Elasticsearch index copy finished" >> /escopydata/backup.log 2>&1
cp /escopydata/backup.log /escopydata/harvest_`date +%Y-%m-%dT%H-%M.log`
rm /escopydata/backup.log

#delete files older than a week
find /escopydata/ -type f -mtime +7 -name '*.tgz' -exec rm -- '{}' \;
find /escopydata/ -type f -mtime +7 -name '*.log' -exec rm -- '{}' \;