
# Elasticsearch 5 (and Spring Boot 2)

Fellesdatakatalog (fdk) is now upgraded to Spring Boot 2 (currently 2.0.5), which uses Elasticserch 5 (currently 5.6.9).
This module contains code to create a ES5 client 

                import no.dcat.client.elasticsearch5.Elasticsearch5Client;
                import org.elasticsearch.client.Client;

                void foo(final String clusterNodes, final String clusterName) {
                    Elasticsearch5Client elasticsearch = new Elasticsearch5Client(clusterNodes, clusterName);
                    Client client = elasticsearch.getClient();
                    ...
                }


## Tests

For integration tests, we have a ElasticDockerRule which spins up a Docker image.

    @RunWith(SpringRunner.class)
    @SpringBootTest(webEnvironment = RANDOM_PORT)
    @Category(IntegrationTest.class)
    public class FooIntegrationTest {
    
        @ClassRule
        public static ElasticDockerRule elasticRule = new ElasticDockerRule();
        
        @Test
        public void foo() {
            //Clean elasticsearch cluster is now available (at port 9299/9399)
            ...
        }
    }
