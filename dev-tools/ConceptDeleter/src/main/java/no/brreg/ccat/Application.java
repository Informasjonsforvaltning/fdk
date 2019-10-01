package no.brreg.ccat;


import org.apache.http.Header;
import org.apache.http.HttpHost;
import org.apache.http.message.BasicHeader;
import org.elasticsearch.action.delete.DeleteRequest;
import org.elasticsearch.action.delete.DeleteResponse;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestClientBuilder;
import org.elasticsearch.client.RestHighLevelClient;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.*;
import java.net.Authenticator;
import java.net.PasswordAuthentication;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

public class Application {

    static private Map<String,String> identifierToIdMap = new HashMap<>();


    private static void readJsonFromUrl(String url) throws JSONException {
        try (InputStream is = new URL(url).openStream();
             BufferedReader rd = new BufferedReader(new InputStreamReader(is, StandardCharsets.UTF_8))) {

            char[] buf = new char[10*1024];
            int charRead;
            StringBuilder sb = new StringBuilder();
            while ((charRead = rd.read(buf)) != -1) {
                sb.append(buf, 0, charRead);
            }

            JSONObject jsonObject = new JSONObject(sb.toString());
            if (jsonObject.has("_embedded")) {
                JSONArray concepts = jsonObject.getJSONObject("_embedded").getJSONArray("concepts");
                for (int i = 0; i < concepts.length(); i++) {
                    JSONObject concept = concepts.optJSONObject(i);
                    Application.identifierToIdMap.put(concept.getString("identifier"), concept.getString("id"));
                }
            }
        } catch (Exception e) {
            System.out.println("Got exception: "+e.getMessage());
        }
    }

    public static void main (String[] args) throws IOException {
        if (args.length != 6) {
            System.out.println("Parameters: <file of line-separated concept identifiers> <FDK concept endpoint> <concept endpoint username> <concept endpoint password> <elastic-search endpoint URL> <GCP elastic port-forward cookie value>");
            System.out.println("example: ... \"c:\\Temp\\skatt\\fdk.extra.guid\" \"https://fellesdatakatalog.brreg.no/api/concepts\" \"\" \"\" \"https://9200-dot-6819558-dot-devshell.appspot.com\" \"bad6aa6e6ffc31c5bc86f1b778c6a78cb8b8ae13391c484ac18b00cb7de40add\"");
            System.exit(-1);
        }

        //Set username/password
        if (!args[2].isEmpty()) {
            Authenticator.setDefault (new Authenticator() {
                protected PasswordAuthentication getPasswordAuthentication() {
                    return new PasswordAuthentication (args[2], args[3].toCharArray());
                }
            });
        }

        //Load concepts from endpoint
        long oldCount, newCount;
        long size = 1000;
        int page = 0;
        do {
            oldCount = Application.identifierToIdMap.size();
            readJsonFromUrl(args[1]+"?size=" + size + "&page=" + page++);
            newCount = Application.identifierToIdMap.size();
        } while (oldCount != newCount);
        System.out.println("Fetched "+Application.identifierToIdMap.size() + " concepts from " + args[1]);

        //Read GUIDs from file and delete from ElasticSearch endpoint
        URL esUrl = new URL(args[4]);
        Header[] deafultHeaders = new Header[]{new BasicHeader("cookie", "devshell-proxy-session="+args[5])};
        RestClientBuilder restClientBuilder = RestClient.builder(new HttpHost(esUrl.getHost(), esUrl.getPort(), esUrl.getProtocol()))
                                                    .setDefaultHeaders(deafultHeaders);

        try (BufferedReader reader = new BufferedReader(new FileReader(args[0]));
             RestClient lowLevelRestClient = restClientBuilder.build()) {
            RestHighLevelClient esClient = new RestHighLevelClient(lowLevelRestClient);

            String line;
            while ((line = reader.readLine()) != null) {
                line = line.trim();
                if (!line.isEmpty()) {
                    if (Application.identifierToIdMap.containsKey(line)) {
                        String id = Application.identifierToIdMap.get(line);
                        System.out.println("Concept " + line + " found with id " + id);

                        DeleteRequest request = new DeleteRequest("ccat", "concept", id);

                        DeleteResponse deleteResponse = esClient.delete(request);
                        System.out.println("ElasticSearch DELETE returned status " + deleteResponse.status().name());
                    } else {
                        System.out.println("Couldn't find id for concept " + line);
                    }
                }
            }
        } catch (Exception e) {
            System.out.println("Got exception: " + e.toString());
        }
    }
}
