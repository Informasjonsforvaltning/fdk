package no.dcat.datastore;

import static org.junit.Assert.assertTrue;

import java.io.File;

import no.dcat.shared.testcategories.UnitTest;
import org.apache.commons.io.FileUtils;
import org.elasticsearch.action.admin.cluster.health.ClusterHealthResponse;
import org.elasticsearch.client.Client;
import org.elasticsearch.client.transport.NoNodeAvailableException;
import org.elasticsearch.common.settings.Settings;
import org.elasticsearch.common.unit.TimeValue;
import org.elasticsearch.node.Node;
import org.elasticsearch.node.NodeBuilder;
import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Category(UnitTest.class)
public class ELKTest {

	private final Logger logger = LoggerFactory.getLogger(ELKTest.class);

	Node node;
	Client client;

	private File homeDir = null;
	private Settings settings = null;

	@Before
	public void setUp() throws Exception {
		homeDir = new File("src/test/resources/elasticsearch");
		settings = Settings.settingsBuilder()
				.put("http.enabled", "false")
				.put("path.home", homeDir.toString())
				.build();
		node = NodeBuilder.nodeBuilder()
				.local(true)
				.settings(settings)
				.build();
		node.start();
		client = node.client();
		Assert.assertNotNull(node);
		Assert.assertFalse(node.isClosed());
		Assert.assertNotNull(client);
	}

	@After
	public void tearDown() throws Exception {
		if (client != null) {
			client.close();
		}
		if (node != null) {
			node.close();
		}
		if (homeDir != null) {
			FileUtils.forceDelete(homeDir);
		}
		node = null;
		client = null;
	}

	@Test
	public void testThatEmbeddedElasticsearchWorks() {
		ClusterHealthResponse healthResponse = null;
		try {
			healthResponse = client.admin().cluster().prepareHealth().setTimeout(new TimeValue(5000)).execute()
					.actionGet();
			logger.info("Connected to Elasticsearch: " + healthResponse.getStatus().toString());
		} catch (NoNodeAvailableException e) {
			logger.error("Failed to connect to Elasticsearch: " + e);
		}
		assertTrue(healthResponse.getStatus() != null);
	}

}
