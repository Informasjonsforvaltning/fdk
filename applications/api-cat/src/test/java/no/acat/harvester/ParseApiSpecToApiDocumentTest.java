package no.acat.harvester;


import no.acat.model.ApiDocument;
import no.acat.spec.converters.ParseApiSpecToApiDocument;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.junit4.SpringRunner;


@RunWith(SpringRunner.class)
public class ParseApiSpecToApiDocumentTest {

    private String url;
    private String data;

    private ParseApiSpecToApiDocument parseApiSpecToApiDocument;

    @Before
    public void setUp(){
        parseApiSpecToApiDocument = new ParseApiSpecToApiDocument();
        url= "http://www.barnehagefakta.no/swagger/docs/v1";
        data= "";
    }

    @Test
    public void parseApiSpecFromUrlTest(){
        ApiDocument apiDocument =parseApiSpecToApiDocument.parseApiSpecFromUrl(url, data);

        Assert.assertEquals(apiDocument.getTitle().get("no"),"Barnehagefakta");
    }

}
