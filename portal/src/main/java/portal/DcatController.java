package portal;


import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.Client;
import org.elasticsearch.client.transport.TransportClient;
import org.elasticsearch.common.settings.Settings;
import org.elasticsearch.common.transport.InetSocketTransportAddress;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.BufferedReader;

import java.io.FileReader;
import java.io.IOException;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.concurrent.TimeUnit;


/**
 * Created by nodavsko on 29.09.2016.
 */
@RestController
public class DcatController {
    Logger logger = LoggerFactory.getLogger(DcatController.class);

    Client client = null;

    @RequestMapping("/search")
    public String search(@RequestParam(value="q", defaultValue="") String query,
                         @RequestParam(value="from", defaultValue="0") int from,
                         @RequestParam(value="size", defaultValue="10") int size) {
        logger.debug("query: \""+ query + "\" from:" + from + " size:" + size );

        if (size > 50) size = 50;
        if (size < 5) size = 5;

        if ("".equals(query)) query = "*";

        String json = "{}";

        if (client == null) client = returnElasticsearchTransportClient("localhost",9300);

        QueryBuilder search = QueryBuilders.queryStringQuery(query);

        /*
        {
            "query": {
                "query_string": {
                  "query": {query string}
            }
        }
        }*/
        logger.debug(search.toString());

        SearchResponse response = client.prepareSearch("dcat")
                .setTypes("dataset")
                //.addHighlightedField("description.no")
                .setQuery(search)
                .setFrom(from)
                .setSize(size)

                .execute().actionGet();

        logger.debug(response.toString());
        // Build query

        return response.toString();

    }

    public Client returnElasticsearchTransportClient(String host, int port) {
        client = null;
        try {
            InetAddress inetadress = InetAddress.getByName(host);
             InetSocketTransportAddress address = new InetSocketTransportAddress(inetadress, port);

            client = TransportClient.builder().build()
                    .addTransportAddress(address);
            logger.debug("Client returns!");
        } catch (UnknownHostException e) {
            logger.error(e.toString());
        }

        logger.debug("transportclient created: " + client);
        return client;

    }

    /* Laster en json fil */
    private String loadFromFile(String filename) {

        ClassLoader classLoader = getClass().getClassLoader();
        String json = "{}";
        try {
            String u = classLoader.getResource("brreg-dataset-result.json").getFile();
            logger.debug(u);

            try (BufferedReader br = new BufferedReader(new FileReader(u))) {
                StringBuilder sb = new StringBuilder();
                String line = br.readLine();

                while (line != null) {
                    sb.append(line);
                    sb.append(System.lineSeparator());
                    line = br.readLine();
                }
                json = sb.toString();

            } catch (IOException io) {
                logger.error("IO: " + io);
            } catch (Exception e) {
                logger.error("E: " + e);
            }

        } catch (NullPointerException npe) {
            logger.error("NP: ", npe);
        }
        return json;
    }

}
