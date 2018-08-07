package no.acat.query;

import org.elasticsearch.client.Client;
import org.elasticsearch.client.transport.TransportClient;
import org.elasticsearch.common.settings.Settings;
import org.elasticsearch.common.transport.InetSocketTransportAddress;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.net.InetAddress;
import java.net.UnknownHostException;

@Service
public class ElasticsearchService {
    private static Logger logger = LoggerFactory.getLogger(ElasticsearchService.class);

    @Value("${application.elasticsearchHost}")
    private String elasticsearchHost;

    @Value("${application.elasticsearchPort}")
    private int elasticsearchPort;

    @Value("${application.clusterName}")
    private String clusterName;

    @PostConstruct
    void validate(){
        assert elasticsearchHost != null;
        assert elasticsearchPort > 0;
        assert clusterName != null;

        initializeElasticsearchTransportClient();
    }

    private Client client;

    public Client getClient() {
        return client;
    }

    private void initializeElasticsearchTransportClient() {

        logger.debug("elasticsearch: " + elasticsearchHost + ":" + elasticsearchPort);
        if (client == null) {
            if (elasticsearchHost == null) {
                logger.error("Configuration property application.elasticsearchHost is not initialized. Unable to connect to Elasticsearch");
            }

            try {
                InetAddress inetaddress = InetAddress.getByName(elasticsearchHost);
                InetSocketTransportAddress address = new InetSocketTransportAddress(inetaddress, elasticsearchPort);

                Settings settings = Settings.builder()
                        .put("cluster.name", clusterName).build();

                this.client = TransportClient.builder().settings(settings).build()
                        .addTransportAddress(address);

                logger.debug("Client returns! " + address.toString());
            } catch (UnknownHostException e) {
                logger.error("Unable to connect to Elasticsearch: {}",e.toString(), e);
            }
        }
    }
}
