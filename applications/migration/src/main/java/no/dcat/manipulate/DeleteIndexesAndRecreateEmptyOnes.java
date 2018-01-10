package no.dcat.manipulate;

import no.dcat.datastore.Elasticsearch;
import org.elasticsearch.action.admin.indices.delete.DeleteIndexRequest;
import org.elasticsearch.index.IndexNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

public class DeleteIndexesAndRecreateEmptyOnes {
    private static Logger logger = LoggerFactory.getLogger(DeleteIndexesAndRecreateEmptyOnes.class);

    //final String elasticUrl = "http://localhost:9200/"; //"http://elasticsearch-fellesdatakatalog-ppe.ose-pc.brreg.no"; //"http://elasticsearch-fellesdatakatalog-st2.ose-npc.brreg.no";

    public static void main(String... args) {

        if (args.length != 3) {
            logger.warn("Need three arguments to identify elasticsearch: host port clusterName\n\t example: http://localhost 9200 elasticsearch");
        }

        String host = args[0];
        int port = Integer.parseInt(args[1]);
        String clusterName = args[2];

       deleteAndInitIndexes(host, port, clusterName);
    }

    public static void deleteAndInitIndexes(String host, int port, String clusterName) {
        //final String elasticUrl = "http://localhost:9200/"; //"http://elasticsearch-fellesdatakatalog-ppe.ose-pc.brreg.no"; //"http://elasticsearch-fellesdatakatalog-st2.ose-npc.brreg.no";

        String portElement = port != 80 ? ":"+port : "";
        final String elasticUrl = "http://" + host + portElement;

        Elasticsearch elasticsearch = new Elasticsearch(host, port, clusterName);


        if (elasticsearch.isElasticsearchRunning()) {

            if (elasticsearch.indexExists("dcat")) {
                deleteIndexInElasticsearch(elasticsearch, "dcat");
            }

            if (elasticsearch.indexExists("harvest")) {
                deleteIndexInElasticsearch(elasticsearch, "harvest");
            }


            if (!elasticsearch.indexExists("dcat")) {
                elasticsearch.createIndex("dcat");
            }

            if (!elasticsearch.indexExists("harvest")) {
                elasticsearch.createIndex("harvest");
            }
        } else {
            logger.error("Elasticsearch is not running! {}", elasticUrl);
        }

    }

    public static void deleteIndexInElasticsearch(Elasticsearch elasticsearch, String index) {
        try {
            elasticsearch.getClient().admin().indices().delete(new DeleteIndexRequest(index)).actionGet();
            elasticsearch.getClient().admin().indices().prepareRefresh().get();

        } catch (IndexNotFoundException e) {
            logger.warn("Index not found: {}", index);
        }
    }


    public static void deleteIndexRest(String elasticUrl, String index) {
        RestTemplate restTemplate = new RestTemplate();
        try {
            restTemplate.delete(elasticUrl + "/" + index);

        } catch (HttpClientErrorException e) {
            logger.warn("Exception in deleting index: {} on {}. Reason {}", index, elasticUrl, e.getMessage());
        }
    }
}
