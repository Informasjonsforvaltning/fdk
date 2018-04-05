
curl -XDELETE http://elasticsearch-fellesdatakatalog-ut1.ose-npc.brreg.no/harvest

curl -XPOST http://elasticsearch-fellesdatakatalog-ut1.ose-npc.brreg.no/harvest/_create -d 

elasticdump --input=ut1_harvest_lookup.json --output=http://elasticsearch-fellesdatakatalog-ut1.ose-npc.brreg.no/harvest --type=data



elasticdump --input=st2_harvest_lookup.json --output=http://elasticsearch-fellesdatakatalog-st2.ose-npc.brreg.no/harvest --type=data


curl -XPOST http://elasticsearch-fellesdatakatalog-ut1.ose-npc.brreg.no/harvest/_close

culr -XPUT http://elasticsearch-fellesdatakatalog-ut1.ose-npc.brreg.no/harvest/_setting
