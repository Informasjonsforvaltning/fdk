package no.dcat.portal.query;

import org.elasticsearch.client.Client;
import org.elasticsearch.client.transport.TransportClient;
import org.elasticsearch.common.settings.Settings;
import org.elasticsearch.common.transport.InetSocketTransportAddress;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import javax.annotation.PostConstruct;
import java.net.InetAddress;
import java.net.UnknownHostException;

public class ElasticsearchService {
    private static Logger logger = LoggerFactory.getLogger(ElasticsearchService.class);

    @Value("${application.elasticsearchHost}")
    private String elasticsearchHost;

    public void setElasticsearchHost(String host) {
        elasticsearchHost = host;
    }

    @Value("${application.elasticsearchPort}")
    private int elasticsearchPort;

    @Value("${application.clusterName}")
    private String clusterName;

    @PostConstruct
    void validate(){
        assert elasticsearchHost != null;
        assert elasticsearchPort > 0;
        assert clusterName != null;
    }

    public void setClusterName(String cn) {
        clusterName = cn;
    }


    Client client;

    public Client getClient() {
        return client;
    };


    public final Client createElasticsearchTransportClient(final String host, final int port) {
        client = null;
        try {
            InetAddress inetaddress = InetAddress.getByName(host);
            InetSocketTransportAddress address = new InetSocketTransportAddress(inetaddress, port);

            //TODO: Gjør cluster name til en property
            Settings settings = Settings.builder()
                    .put("cluster.name", clusterName).build();

            client = TransportClient.builder().settings(settings).build()
                    .addTransportAddress(address);

            logger.debug("Client returns! " + address.toString());
        } catch (UnknownHostException e) {
            // TODO: throw exception.
            logger.error(e.toString(), e);
        }

        logger.debug("Transport client to elasticsearch created: " + client);
        return client;
    }

    public ResponseEntity<String> initializeElasticsearchTransportClient() {
        String jsonError = "{\"error\": \"Query service is not properly initialized. Unable to connect to database (ElasticSearch)\"}";

        logger.debug("elasticsearch: " + elasticsearchHost + ":" + elasticsearchPort);
        if (client == null) {
            if (elasticsearchHost == null) {
                logger.error("Configuration property application.elasticsearchHost is not initialized. Unable to connect to Elasticsearch");
                return new ResponseEntity<String>(jsonError, HttpStatus.INTERNAL_SERVER_ERROR);
            }

            createElasticsearchTransportClient(elasticsearchHost, elasticsearchPort);
        }
        return null;
    }
}
