package no.acat.restapi;

import no.acat.model.ApiDocument;
import no.acat.model.ApiSource;
import no.acat.spec.converters.ParseApiSpecToApiDocument;
import no.dcat.shared.testcategories.UnitTest;
import org.junit.Before;
import org.junit.Test;
import org.junit.Assert;
import org.junit.experimental.categories.Category;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit4.SpringRunner;

@Category(UnitTest.class)
@RunWith(SpringRunner.class)
public class ParseApiSpecTilApiDocumentControllerTest {

    ParseApiSpecTilApiDocumentController parseApiSpecTilApiDocumentController;
    @MockBean
    ParseApiSpecToApiDocument apiSpecToApiDocument;

    @Before
    public void setUp(){
        MockitoAnnotations.initMocks(this);
        parseApiSpecTilApiDocumentController = new ParseApiSpecTilApiDocumentController(apiSpecToApiDocument);
    }

    @Test
    public  void parseApiSpecTest(){
        String url = "http://www.barnehagefakta.no/swagger/docs/v1";
        ApiDocument apiDocument = new ApiDocument();
        apiDocument.setApiDocUrl("api document url");
        apiDocument.setApiSpecUrl(url);
        ApiSource apiSource = new ApiSource(url,"");
        Mockito.when(apiSpecToApiDocument.parseApiSpecFromUrl(apiSource)).thenReturn(apiDocument);
        ApiDocument result = parseApiSpecTilApiDocumentController.parseApiSpec(apiSource);
        Assert.assertNotNull(result);
        Assert.assertEquals(result.getApiDocUrl(),apiDocument.getApiDocUrl());
    }


}
