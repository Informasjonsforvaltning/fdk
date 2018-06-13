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
--input=http://elasticsearch:9200/theme \
--output=/escopydata/theme_data.json \
--type=data >> /var/log/backup.log 2>&1
/usr/local/bin/elasticdump \
--input=http://elasticsearch:9200/theme \
--output=/escopydata/theme_mapping.json \
--type=mapping >> /var/log/backup.log 2>&1
/usr/local/bin/elasticdump \
--input=http://elasticsearch:9200/theme \
--output=/escopydata/theme_analyzer.json \
--type=analyzer >> /var/log/backup.log 2>&1
tar czf /escopydata/theme-`date +%Y-%m-%dT%H-%M.tgz` /escopydata/theme_* >> /var/log/backup.log 2>&1
rm /escopydata/theme_data.json
rm /escopydata/theme_mapping.json
rm /escopydata/theme_analyzer.json
echo "Elasticsearch index copy finished" >> /var/log/backup.log 2>&1
cp /var/log/backup.log /escopydata/theme_`date +%Y-%m-%dT%H-%M.log`
rm /var/log/backup.log

#copy register index
/usr/local/bin/elasticdump \
--input=http://elasticsearch:9200/register \
--output=/escopydata/register_data.json \
--type=data >> /var/log/backup.log 2>&1
/usr/local/bin/elasticdump \
--input=http://elasticsearch:9200/register \
--output=/escopydata/register_mapping.json \
--type=mapping >> /var/log/backup.log 2>&1
/usr/local/bin/elasticdump \
--input=http://elasticsearch:9200/register \
--output=/escopydata/register_analyzer.json \
--type=analyzer >> /var/log/backup.log 2>&1
tar czf /escopydata/register-`date +%Y-%m-%dT%H-%M.tgz` /escopydata/register* >> /var/log/backup.log 2>&1
rm /escopydata/register_data.json
rm /escopydata/register_mapping.json
rm /escopydata/register_analyzer.json
echo "Elasticsearch index copy finished" >> /var/log/backup.log 2>&1
cp /var/log/backup.log /escopydata/register_`date +%Y-%m-%dT%H-%M.log`
rm /var/log/backup.log

#copy codes index
/usr/local/bin/elasticdump \
--input=http://elasticsearch:9200/codes \
--output=/escopydata/codes_data.json \
--type=data >> /var/log/backup.log 2>&1
/usr/local/bin/elasticdump \
--input=http://elasticsearch:9200/codes \
--output=/escopydata/codes_mapping.json \
--type=mapping >> /var/log/backup.log 2>&1
/usr/local/bin/elasticdump \
--input=http://elasticsearch:9200/codes \
--output=/escopydata/codes_analyzer.json \
--type=analyzer >> /var/log/backup.log 2>&1
tar czf /escopydata/codes-`date +%Y-%m-%dT%H-%M.tgz` /escopydata/codes* >> /var/log/backup.log 2>&1
rm /escopydata/codes_data.json
rm /escopydata/codes_mapping.json
rm /escopydata/codes_analyzer.json
echo "Elasticsearch index copy finished" >> /var/log/backup.log 2>&1
cp /var/log/backup.log /escopydata/codes_`date +%Y-%m-%dT%H-%M.log`
rm /var/log/backup.log

#copy harvest index
/usr/local/bin/elasticdump \
--input=http://elasticsearch:9200/harvest \
--output=/escopydata/harvest_data.json \
--type=data >> /var/log/backup.log 2>&1
/usr/local/bin/elasticdump \
--input=http://elasticsearch:9200/harvest \
--output=/escopydata/harvest_mapping.json \
--type=mapping >> /var/log/backup.log 2>&1
/usr/local/bin/elasticdump \
--input=http://elasticsearch:9200/harvest \
--output=/escopydata/harvest_analyzer.json \
--type=analyzer >> /var/log/backup.log 2>&1
tar czf /escopydata/harvest-`date +%Y-%m-%dT%H-%M.tgz` /escopydata/harvest* >> /var/log/backup.log 2>&1
rm /escopydata/harvest_data.json
rm /escopydata/harvest_mapping.json
rm /escopydata/harvest_analyzer.json
echo "Elasticsearch index copy finished" >> /var/log/backup.log 2>&1
cp /var/log/backup.log /escopydata/harvest_`date +%Y-%m-%dT%H-%M.log`
rm /var/log/backup.log