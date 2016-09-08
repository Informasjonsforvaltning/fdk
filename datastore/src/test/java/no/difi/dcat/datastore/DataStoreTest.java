package no.difi.dcat.datastore;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import java.io.File;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.apache.commons.io.FileUtils;
import org.apache.jena.atlas.iterator.Iter;
import org.apache.jena.atlas.lib.FileOps;
import org.apache.jena.fuseki.jetty.JettyFuseki;
import org.apache.jena.fuseki.jetty.JettyServerConfig;
import org.apache.jena.fuseki.server.DataAccessPointRegistry;
import org.apache.jena.fuseki.server.FusekiEnv;
import org.apache.jena.fuseki.server.FusekiServer;
import org.apache.jena.fuseki.server.FusekiServerListener;
import org.apache.jena.fuseki.server.ServerInitialConfig;
import org.apache.jena.fuseki.server.SystemState;
import org.apache.jena.query.ResultSet;
import org.apache.jena.query.ResultSetFormatter;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.tdb.StoreConnection;
import org.apache.jena.tdb.base.file.Location;
import org.apache.jena.vocabulary.RDFS;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import no.difi.dcat.datastore.domain.DcatSource;
import no.difi.dcat.datastore.domain.DifiMeta;
import no.difi.dcat.datastore.domain.User;

/**
 * @author havardottestad, sebnmuller
 */
public class DataStoreTest {

	private final Logger logger = LoggerFactory.getLogger(DataStoreTest.class);

	JettyFuseki server;

	@Before
	public void setUp() throws Exception {

		SystemState.location = Location.mem();
		SystemState.init$();

		File dcatDB = new File("src/test/resources/fuseki-home/db/dcat");
		File adminDB = new File("src/test/resources/fuseki-home/db/admin");

		dcatDB.mkdirs();
		adminDB.mkdirs();

		FileUtils.cleanDirectory(dcatDB);
		FileUtils.cleanDirectory(adminDB);

		fuseki();
	}

	@After
	public void tearDown() throws Exception {

		if (server != null) {
			server.stop();
		}

		StoreConnection.reset();

		Thread.sleep(1000);
		server = null;
		// Clear out the registry.
		Collection<String> keys = Iter.toList(DataAccessPointRegistry.get().keys().iterator());
		for (String k : keys) {
			DataAccessPointRegistry.get().remove(k);
		}
		// Clear configuration directory.
		System.out.println(FusekiServer.dirConfiguration.toFile());
		FileOps.clearAll(FusekiServer.dirConfiguration.toFile());

		Thread.sleep(1000);
	}

	@Test
	public void testThatEmbeddedFusekiWorks() {

		Fuseki fuseki = new Fuseki("http://localhost:3131/dcat/");
		ResultSet select = fuseki.select("select * where {?a ?b ?c}");
		String s = ResultSetFormatter.asText(select);
		System.out.println(s);

		Model defaultModel = ModelFactory.createDefaultModel();
		defaultModel.createResource().addLiteral(RDFS.label, "yay");
		fuseki.update("http://example.com/a", defaultModel);
		System.out.println(ResultSetFormatter.asText(fuseki.select("select * where {?a ?b ?c}")));

		Fuseki fuseki2 = new Fuseki("http://localhost:3131/admin/");
		fuseki2.select("select * where {?a ?b ?c}");

	}

	@Test
	public void testThatEmbeddedFusekiWorks2() {

		Fuseki fuseki = new Fuseki("http://localhost:3131/dcat/");
		System.out.println(ResultSetFormatter.asText(fuseki.select("select * where {?a ?b ?c}")));

		Model defaultModel = ModelFactory.createDefaultModel();
		defaultModel.createResource().addLiteral(RDFS.label, "yay2");
		fuseki.update("http://example.com/a", defaultModel);

		System.out.println(ResultSetFormatter.asText(fuseki.select("select * where {?a ?b ?c}")));

		Fuseki fuseki2 = new Fuseki("http://localhost:3131/admin/");
		fuseki2.select("select * where {?a ?b ?c}");

	}

	@Test
	public void testFusekiEndpointSlash() {
		Fuseki fuseki = new Fuseki("http://localhost:3131/admin/");
		Fuseki fuseki2 = new Fuseki("http://localhost:3131/admin");

		fuseki.drop("");
		fuseki2.drop("");

	}

	@Test
	public void testAddUser() throws UserAlreadyExistsException, UserNotFoundException {
		Fuseki fuseki = new Fuseki("http://localhost:3131/admin/");

		AdminDataStore adminDataStore = new AdminDataStore(fuseki);
		adminDataStore.addUser(new no.difi.dcat.datastore.domain.User("", "testUserName", "", "", ""));

		Map<String, String> testUserName = adminDataStore.getUser("testUserName");

		assertEquals("The username should be testUserName.", "testUserName", testUserName.get("username"));

		ResultSet select = fuseki.select("select * where {?a foaf:accountName \"testUserName\"}");
		int count = 0;
		while (select.hasNext()) {
			count++;
			select.next();
		}

		assertEquals("Should be exactly 1 user with this username", 1, count);
	}

	@Test(expected = UserAlreadyExistsException.class)
	public void testAddMultipleUsers() throws UserAlreadyExistsException {
		Fuseki fuseki = new Fuseki("http://localhost:3131/admin/");

		AdminDataStore adminDataStore = new AdminDataStore(fuseki);
		adminDataStore.addUser(new no.difi.dcat.datastore.domain.User("", "testUserName", "", "", ""));
		adminDataStore.addUser(new no.difi.dcat.datastore.domain.User("", "testUserName", "", "", ""));

	}

	@Test
	public void testUpdateUser() throws UserAlreadyExistsException {
		Fuseki fuseki = new Fuseki("http://localhost:3131/admin/");

		AdminDataStore adminDataStore = new AdminDataStore(fuseki);
		User testUser = adminDataStore.addUser(new User("", "testUserName", "", "", ""));

		testUser.setEmail("real@example.com");
		adminDataStore.addUser(testUser);
		assertEquals("", testUser.getEmail(), adminDataStore.getUsers().get(0).getEmail());
		assertEquals("", testUser.getPassword(), adminDataStore.getUsers().get(0).getPassword());

		testUser.setPassword("hello");
		adminDataStore.addUser(testUser);
		assertEquals("", testUser.getPassword(), adminDataStore.getUsers().get(0).getPassword());

		testUser.setPassword(null);
		adminDataStore.addUser(testUser);
		assertEquals("Password shouldn't change if it is not present", "hello",
				adminDataStore.getUsers().get(0).getPassword());

		testUser.setUsername("hurra");
		adminDataStore.addUser(testUser);
		assertEquals("", testUser.getUsername(), adminDataStore.getUsers().get(0).getUsername());

		testUser.setRole("role2");
		adminDataStore.addUser(testUser);
		assertEquals("", testUser.getRole(), adminDataStore.getUsers().get(0).getRole());

	}

	@Test
	public void testUpdateUserMultipleUsers() throws UserAlreadyExistsException {
		Fuseki fuseki = new Fuseki("http://localhost:3131/admin/");

		AdminDataStore adminDataStore = new AdminDataStore(fuseki);
		User testUser = adminDataStore.addUser(new User("", "testUserName", "", "", ""));
		User testUser2 = adminDataStore.addUser(new User("", "testUserName2", "", "", ""));

		testUser.setEmail("real@example.com");
		adminDataStore.addUser(testUser);

		List<User> users = adminDataStore.getUsers();
		boolean atLeast1UserWithOldEmail = users.stream().filter(user -> !user.getEmail().equals(testUser.getEmail()))
				.findAny().isPresent();

		assertTrue("", atLeast1UserWithOldEmail);

	}

	@Test
	public void testAddDcatSource() throws UserAlreadyExistsException, Exception {
		Fuseki fuseki = new Fuseki("http://localhost:3131/admin/");

		AdminDataStore adminDataStore = new AdminDataStore(fuseki);
		adminDataStore.addUser(new no.difi.dcat.datastore.domain.User("", "testUserName", "", "", ""));

		DcatSource dcatSource = new DcatSource();
		dcatSource.setDescription("desc");
		dcatSource.setUser("testUserName");
		dcatSource.setUrl("http://url");

		dcatSource = adminDataStore.addDcatSource(dcatSource);
		assertNotNull("There should exist a dcat source", dcatSource);

		Optional<DcatSource> dcatSourceById = adminDataStore.getDcatSourceById(dcatSource.getId());

		assertTrue("The dcat source should exist in the database", dcatSourceById.isPresent());
		DcatSource fromFuseki = dcatSourceById.get();
		assertEquals("Url should be equal", dcatSource.getUrl(), fromFuseki.getUrl());
		assertEquals("User should be equal", dcatSource.getUser(), fromFuseki.getUser());
		assertEquals("Description should be equal", dcatSource.getDescription(), fromFuseki.getDescription());
		assertEquals("Graph should be equal", dcatSource.getGraph(), fromFuseki.getGraph());
		assertEquals("Id should be equal", dcatSource.getId(), fromFuseki.getId());

	}

	@Test
	public void testDeleteDcatSource() throws UserAlreadyExistsException, Exception {

		no.difi.dcat.datastore.domain.User testAdmin = new no.difi.dcat.datastore.domain.User("", "testAdmin", "", "",
				"ADMIN");
		no.difi.dcat.datastore.domain.User testUser = new no.difi.dcat.datastore.domain.User("", "testUserName", "", "",
				"");

		Fuseki fuseki = new Fuseki("http://localhost:3131/admin/");

		AdminDataStore adminDataStore = new AdminDataStore(fuseki);
		adminDataStore.addUser(testUser);

		DcatSource dcatSource = new DcatSource();
		dcatSource.setDescription("desc");
		dcatSource.setUser("testUserName");
		dcatSource.setUrl("http://url");

		dcatSource = adminDataStore.addDcatSource(dcatSource);
		assertNotNull("There should exist a dcat source", dcatSource);

		AdminDcatDataService adminDcatDataService = new AdminDcatDataService(adminDataStore,
				new DcatDataStore(new Fuseki("http://localhost:3131/dcat/")));

		adminDcatDataService.deleteDcatSource(dcatSource.getId(), testAdmin);

		Optional<DcatSource> dcatSourceById = adminDataStore.getDcatSourceById(dcatSource.getId());

		assertFalse("", dcatSourceById.isPresent());
	}

	@Test
	public void testDeleteOneofTwoDcatSources() throws UserAlreadyExistsException, Exception {

		no.difi.dcat.datastore.domain.User testAdmin = new no.difi.dcat.datastore.domain.User("", "testAdmin", "", "",
				"ADMIN");
		no.difi.dcat.datastore.domain.User testUser = new no.difi.dcat.datastore.domain.User("", "testUserName", "", "",
				"");

		Fuseki fuseki = new Fuseki("http://localhost:3131/admin/");

		AdminDataStore adminDataStore = new AdminDataStore(fuseki);
		adminDataStore.addUser(testUser);

		DcatSource dcatSource = new DcatSource();
		dcatSource.setDescription("desc");
		dcatSource.setUser("testUserName");
		dcatSource.setUrl("http://url");

		dcatSource = adminDataStore.addDcatSource(dcatSource);
		assertNotNull("There should exist a dcat source", dcatSource);

		DcatSource dcatSource2 = new DcatSource();
		dcatSource2.setDescription("desc2");
		dcatSource2.setUser("testUserName");
		dcatSource2.setUrl("http://url2");

		dcatSource2 = adminDataStore.addDcatSource(dcatSource2);
		assertNotNull("There should exist a second dcat source", dcatSource2);

		AdminDcatDataService adminDcatDataService = new AdminDcatDataService(adminDataStore,
				new DcatDataStore(new Fuseki("http://localhost:3131/dcat/")));

		adminDcatDataService.deleteDcatSource(dcatSource.getId(), testAdmin);

		Optional<DcatSource> dcatSourceById = adminDataStore.getDcatSourceById(dcatSource.getId());

		assertFalse("", dcatSourceById.isPresent());

		Optional<DcatSource> dcatSourceById2 = adminDataStore.getDcatSourceById(dcatSource2.getId());

		assertTrue("", dcatSourceById2.isPresent());

	}

	@Test
	public void testGetAllDcatSourcesForUser() throws UserAlreadyExistsException, Exception {

		Fuseki fuseki = new Fuseki("http://localhost:3131/admin/");

		AdminDataStore adminDataStore = new AdminDataStore(fuseki);
		adminDataStore.addUser(new no.difi.dcat.datastore.domain.User("", "testUserName", "", "", ""));

		adminDataStore.addDcatSource(new DcatSource(null, "sourc1", "http:1", "testUserName", "1234567890"));
		adminDataStore.addDcatSource(new DcatSource(null, "sourc2", "http:2", "testUserName", "1234567890"));
		adminDataStore.addDcatSource(new DcatSource(null, "sourc3", "http:3", "testUserName", "1234567890"));

		adminDataStore.addUser(new no.difi.dcat.datastore.domain.User("", "testUserName2", "", "", ""));

		adminDataStore.addDcatSource(new DcatSource(null, "sourc21", "http:21", "testUserName2", "1234567890"));
		adminDataStore.addDcatSource(new DcatSource(null, "sourc22", "http:22", "testUserName2", "1234567890"));

		List<DcatSource> testUserNameDcatSources = adminDataStore.getDcatSourcesForUser("testUserName");
		List<DcatSource> testUserName2DcatSources = adminDataStore.getDcatSourcesForUser("testUserName2");

		assertEquals("", 3, testUserNameDcatSources.size());
		assertEquals("", 2, testUserName2DcatSources.size());

	}

	@Test
	public void testGetAllDcatSourcesForUserWithDelete() throws UserAlreadyExistsException, Exception {

		Fuseki fuseki = new Fuseki("http://localhost:3131/admin/");

		AdminDataStore adminDataStore = new AdminDataStore(fuseki);
		adminDataStore.addUser(new no.difi.dcat.datastore.domain.User("", "testUserName", "", "", ""));

		adminDataStore.addDcatSource(new DcatSource(null, "sourc1", "http:1", "testUserName", "1234567890"));
		DcatSource dcatSource = adminDataStore
				.addDcatSource(new DcatSource(null, "sourc2", "http:2", "testUserName", "1234567890"));

		AdminDcatDataService adminDcatDataService = new AdminDcatDataService(adminDataStore, new DcatDataStore(fuseki));
		adminDcatDataService.deleteDcatSource(dcatSource.getId(), adminDataStore.getUserObject("testUserName"));

		List<DcatSource> testUserNameDcatSources = adminDataStore.getDcatSourcesForUser("testUserName");

		assertEquals("", 1, testUserNameDcatSources.size());

	}

	@Test
	public void testGetAllDcatSources() throws UserAlreadyExistsException, Exception {

		Fuseki fuseki = new Fuseki("http://localhost:3131/admin/");

		AdminDataStore adminDataStore = new AdminDataStore(fuseki);
		adminDataStore.addUser(new no.difi.dcat.datastore.domain.User("", "testUserName", "", "", ""));

		adminDataStore.addDcatSource(new DcatSource(null, "sourc1", "http:1", "testUserName", "1234567890"));
		adminDataStore.addDcatSource(new DcatSource(null, "sourc2", "http:2", "testUserName", "1234567890"));
		adminDataStore.addDcatSource(new DcatSource(null, "sourc3", "http:3", "testUserName", "1234567890"));

		adminDataStore.addUser(new no.difi.dcat.datastore.domain.User("", "testUserName2", "", "", ""));

		adminDataStore.addDcatSource(new DcatSource(null, "sourc21", "http:21", "testUserName2", "1234567890"));
		adminDataStore.addDcatSource(new DcatSource(null, "sourc22", "http:22", "testUserName2", "1234567890"));

		List<DcatSource> allSources = adminDataStore.getDcatSources();

		assertEquals("", 5, allSources.size());

	}

	@Test
	public void testWhenNoSourcesForUse() throws UserAlreadyExistsException, Exception {

		Fuseki fuseki = new Fuseki("http://localhost:3131/admin/");

		AdminDataStore adminDataStore = new AdminDataStore(fuseki);
		adminDataStore.addUser(new no.difi.dcat.datastore.domain.User("", "testUserName", "", "", ""));

		List<DcatSource> testUserNameDcatSources = adminDataStore.getDcatSourcesForUser("testUserName");
		List<DcatSource> testUserName2DcatSources = adminDataStore.getDcatSourcesForUser("testUserName2");

		assertEquals("", 0, testUserNameDcatSources.size());
		assertEquals("", 0, testUserName2DcatSources.size());

	}

	@Test
	public void testUpdateDataSource() throws UserAlreadyExistsException, Exception {
		Fuseki fuseki = new Fuseki("http://localhost:3131/admin/");

		AdminDataStore adminDataStore = new AdminDataStore(fuseki);
		adminDataStore.addUser(new no.difi.dcat.datastore.domain.User("", "testUserName", "", "", ""));

		DcatSource dcatSource = new DcatSource();
		dcatSource.setDescription("desc");
		dcatSource.setUser("testUserName");
		dcatSource.setUrl("http://url");
		dcatSource.setOrgnumber("123456789");

		dcatSource = adminDataStore.addDcatSource(dcatSource);
		assertNotNull("There should exist a dcat source", dcatSource);
		// TODO: fix this :)
		// assertTrue("Crawler search document exists",
		// elasticsearch.documentExists(KIBANA_INDEX, SEARCH_TYPE,
		// dcatSource.getId(), this.client));

		Optional<DcatSource> dcatSourceById = adminDataStore.getDcatSourceById(dcatSource.getId());

		assertTrue("The dcat source should exist in the database", dcatSourceById.isPresent());
		DcatSource fromFuseki = dcatSourceById.get();

		fromFuseki.setDescription("hello");
		fromFuseki.setUrl("different url");
		fromFuseki.setGraph(null);

		adminDataStore.addDcatSource(fromFuseki);

		Optional<DcatSource> dcatSourceById2 = adminDataStore.getDcatSourceById(dcatSource.getId());
		assertTrue("The dcat source should exist in the database", dcatSourceById2.isPresent());
		DcatSource fromFuseki2 = dcatSourceById2.get();

		assertEquals("Url should be equal", fromFuseki.getUrl(), fromFuseki2.getUrl());
		assertEquals("User should be equal", fromFuseki.getUser(), fromFuseki2.getUser());
		assertEquals("Description should be equal", fromFuseki.getDescription(), fromFuseki2.getDescription());
		assertEquals("Graph should be equal", dcatSource.getGraph(), fromFuseki2.getGraph());
		assertEquals("Id should be equal", fromFuseki.getId(), fromFuseki2.getId());

	}

	@Test
	public void testCrawlDcatSourceLogging() throws UserAlreadyExistsException, Exception {
		Fuseki fuseki = new Fuseki("http://localhost:3131/admin/");

		AdminDataStore adminDataStore = new AdminDataStore(fuseki);
		adminDataStore.addUser(new no.difi.dcat.datastore.domain.User("", "testUserName", "", "", ""));

		DcatSource dcatSource = new DcatSource();
		dcatSource.setDescription("desc");
		dcatSource.setUser("testUserName");
		dcatSource.setUrl("http://url");

		dcatSource = adminDataStore.addDcatSource(dcatSource);
		assertNotNull("There should exist a dcat source", dcatSource);

		adminDataStore.addCrawlResults(dcatSource, DifiMeta.warning, "some warning");

		Optional<DcatSource> dcatSourceById = adminDataStore.getDcatSourceById(dcatSource.getId());
		assertTrue("There should exist a dcat source", dcatSourceById.isPresent());

		DcatSource dcatSource1 = dcatSourceById.get();
		List<DcatSource.Harvest> harvested = dcatSource1.getHarvested();

		assertEquals("", 1, harvested.size());
		assertEquals("", DifiMeta.warning, harvested.get(0).getStatus());
		assertEquals("", "some warning", harvested.get(0).getMessage());

		adminDataStore.addCrawlResults(dcatSource, DifiMeta.warning, "another warning");

		Optional<DcatSource> dcatSourceById2 = adminDataStore.getDcatSourceById(dcatSource.getId());
		assertTrue("There should exist a dcat source", dcatSourceById2.isPresent());

		DcatSource dcatSource2 = dcatSourceById2.get();
		List<DcatSource.Harvest> harvested2 = dcatSource2.getHarvested();

		assertEquals("", 2, harvested2.size());

	}

	@Test
	public void testMultipleDcatFiles() throws UserAlreadyExistsException, Exception {

		DcatDataStore dcatDataStore = new DcatDataStore(new Fuseki("http://localhost:3131/admin/"));

		DcatSource dcatSource = new DcatSource();
		dcatSource.setGraph("http://example.com/1");

		Model defaultModel = ModelFactory.createDefaultModel();
		defaultModel.createResource().addLiteral(RDFS.label, "hello");

		dcatDataStore.saveDataCatalogue(dcatSource, defaultModel);

		DcatSource dcatSource2 = new DcatSource();
		dcatSource2.setGraph("http://example.com/2");

		Model defaultModel2 = ModelFactory.createDefaultModel();
		defaultModel2.createResource().addLiteral(RDFS.label, "test");

		dcatDataStore.saveDataCatalogue(dcatSource2, defaultModel2);

		Model allDataCatalogues = dcatDataStore.getAllDataCatalogues();

		long size = allDataCatalogues.size();

		assertEquals("Two graphs with 1 triple each should make 2 triples.", 2, size);

	}

	public void fuseki() throws Exception {
		ClassLoader classLoader = getClass().getClassLoader();
		File file = new File(classLoader.getResource("fuseki-embedded.ttl").getFile());
		File fusekihome = new File(classLoader.getResource("fuseki-home").getFile());

		FusekiEnv.FUSEKI_HOME = fusekihome.toPath();
		FusekiEnv.FUSEKI_BASE = FusekiEnv.FUSEKI_HOME;
		ServerInitialConfig serverSetup = new ServerInitialConfig();
		serverSetup.fusekiServerConfigFile = file.getCanonicalPath();
		FusekiServerListener.initialSetup = serverSetup;
		JettyFuseki.initializeServer(make(3131, false, true));
		JettyFuseki instance = JettyFuseki.instance;
		instance.start();
		server = instance;
	}

	public static JettyServerConfig make(int port, boolean allowUpdate, boolean listenLocal) {
		JettyServerConfig config = new JettyServerConfig();
		// Avoid any persistent record.
		config.port = port;
		config.contextPath = "/";

		config.loopback = listenLocal;
		config.jettyConfigFile = null;
		config.enableCompression = true;
		config.verboseLogging = false;
		return config;
	}

}