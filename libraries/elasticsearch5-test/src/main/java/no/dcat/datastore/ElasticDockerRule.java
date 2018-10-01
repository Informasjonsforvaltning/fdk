package no.dcat.datastore;


import com.arakelian.docker.junit.DockerRule;
import com.arakelian.docker.junit.model.ImmutableDockerConfig;
import com.spotify.docker.client.messages.PortBinding;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ElasticDockerRule extends DockerRule {
    private static final Logger logger = LoggerFactory.getLogger(ElasticDockerRule.class);

    public ElasticDockerRule() {
        super(ImmutableDockerConfig.builder()
                .name("elasticsearch")
                .image("docker.elastic.co/elasticsearch/elasticsearch:5.6.10")
                .ports("9200", "9300")
                .alwaysRemoveContainer(true)
                .allowRunningBetweenUnitTests(false)

                .addHostConfigurer(builder -> {
                    List<PortBinding> myPortBinding = new ArrayList<>();
                    myPortBinding.add(PortBinding.of("0.0.0.0", 9399));
                    Map<String, List<PortBinding>> pbMap = new HashMap<>();
                    pbMap.put("9300", myPortBinding);

                    List<PortBinding> nextPortBinding = new ArrayList<>();
                    nextPortBinding.add(PortBinding.of("0.0.0.0", 9299));
                    pbMap.put("9200", nextPortBinding);

                    builder.portBindings(pbMap);
                    builder.build();
                })

                .addContainerConfigurer(builder -> builder.env(
                        "http.host=0.0.0.0",
                        "transport.host=0.0.0.0",
                        "xpack.security.enabled=false",
                        "cluster.name=elasticsearch"
                ))

                .addStartedListener(container -> {
                    container.waitForPort("localhost", 9399);
                    logger.info("Waiting fifteen seconds for Elasticsearch container to start...");
                    Thread.sleep(15000);
                    logger.info("Waiting over");
                })

                .build());
    }
}
