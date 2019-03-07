package no.fdk.searchapi;

import no.fdk.test.testcategories.UnitTest;
import org.junit.experimental.categories.Category;

/**
 * Created by dask on 06.04.2017.
 */
@Category(UnitTest.class)
public class CodeRestCallTests {

//    DatasetsQueryService sqs;
//    Client client;
//    SearchResponse response;
//
//    @Before
//    public void setUp() {
//        sqs = new DatasetsQueryService();
//        client = mock(Client.class);
//        sqs.client = client;
//    }
//
//    @Test
//    public void getCodeTypesOK() throws Throwable {
//        DatasetsQueryService spy = spy(sqs);
//
//        List<String> mockTypes = new ArrayList<>();
//        mockTypes.add("type1");
//        mockTypes.add("type2");
//
//        doReturn(null).when(spy).initializeElasticsearchTransportClient();
//        doReturn(mockTypes).when(spy).getTypes(anyString());
//
//        ResponseEntity<String> actual = spy.codeTypes();
//
//        assertThat(actual.getStatusCode(), is(HttpStatus.OK));
//    }
//
//    @Test
//    public void getCodeTypesElasticConnectionError() throws Throwable {
//        DatasetsQueryService spy = spy(sqs);
//
//        doReturn(new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR)).when(spy).initializeElasticsearchTransportClient();
//
//        ResponseEntity<String> actual = spy.codeTypes();
//
//        assertThat(actual.getStatusCode(), is(HttpStatus.INTERNAL_SERVER_ERROR));
//    }
//
//    @Test
//    public void getCodeTypesNoDataInElastic() throws Throwable {
//        DatasetsQueryService spy = spy(sqs);
//
//        doReturn(null).when(spy).initializeElasticsearchTransportClient();
//        doReturn(null).when(spy).getTypes(anyString());
//
//        ResponseEntity<String> actual = spy.codeTypes();
//
//        assertThat(actual.getStatusCode(), is(HttpStatus.NOT_FOUND));
//    }
//
//
//    @Test
//    public void getCodes() throws Throwable {
//        DatasetsQueryService spy = spy(sqs);
//
//        doReturn(new ResponseEntity<>(HttpStatus.OK)).when(spy).initializeElasticsearchTransportClient();
//        doReturn(exampleCodeStrings()).when(spy).extractCodeStrings(anyString());
//
//        ResponseEntity<String> actual = spy.codes("lingusiticsystem");
//
//        assertThat(actual.getStatusCode(), is(HttpStatus.OK));
//
//    }
//
//
//    @Test
//    public void getCodesNoElasticContact() throws Throwable {
//        DatasetsQueryService spy = spy(sqs);
//
//        doReturn(new ResponseEntity<String>(HttpStatus.INTERNAL_SERVER_ERROR)).when(spy).initializeElasticsearchTransportClient();
//
//        ResponseEntity<String> actual = spy.codes("linguisticsystem");
//
//        assertThat(actual.getStatusCode(), is(HttpStatus.INTERNAL_SERVER_ERROR));
//    }
//
//    @Test
//    public void getCodesFilterLabels() throws Throwable {
//        DatasetsQueryService spy = spy(sqs);
//
//        doReturn(null).when(spy).initializeElasticsearchTransportClient();
//        doReturn(exampleCodeStrings()).when(spy).extractCodeStrings(anyString());
//
//        ResponseEntity<String> actual = spy.codes("linguisticsystem", "no");
//
//        assertThat(actual.getStatusCode(), is(HttpStatus.OK));
//    }
//
//    @Test
//    public void getCodesNullResult() throws Throwable {
//        DatasetsQueryService spy = spy(sqs);
//
//        doReturn(null).when(spy).initializeElasticsearchTransportClient();
//        doReturn(null).when(spy).extractCodeStrings(anyString());
//
//        ResponseEntity<String> actual = spy.codes("linguisticsystem", "no");
//
//        assertThat(actual.getStatusCode(), is(HttpStatus.NOT_FOUND));
//    }
//
//    private List<String> exampleCodeStrings() throws Throwable {
//        Resource codeExample = new ClassPathResource("linguisticsystem.json");
//
//        ObjectMapper mapper = new ObjectMapper();
//        String exampleData = null;
//        try (BufferedReader buffer = new BufferedReader(new InputStreamReader(codeExample.getInputStream()))) {
//            exampleData = buffer.lines().collect(Collectors.joining("\n"));
//        }
//
//        if (exampleData != null) {
//
//            Map<String, Object> codes = mapper.readValue(exampleData, HashMap.class);
//            List<Map> allCodes = (List<Map>) codes.get("codes");
//            List<String> stringCodes = new ArrayList<>();
//            for (Map<String, Object> m : allCodes) {
//                stringCodes.add(mapper.writeValueAsString(m));
//            }
//            return stringCodes;
//        }
//        return null;
//    }

}
