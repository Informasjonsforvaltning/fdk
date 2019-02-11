package no.acat.controller;

import no.acat.utils.Utils;
import no.fdk.test.testcategories.UnitTest;
import no.fdk.acat.bindings.ConvertRequest;
import no.fdk.acat.bindings.ConvertResponse;
import no.fdk.webutils.exceptions.BadRequestException;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.experimental.categories.Category;

import java.io.IOException;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@Category(UnitTest.class)
public class ConvertControllerTest {

    private ConvertController convertController;

    @Before
    public void setup() {
        convertController = new ConvertController();
    }

    @Test(expected = BadRequestException.class)
    public void testConvertWithoutSpecShouldFailed() throws Exception {

        ConvertRequest convertRequest = mock(ConvertRequest.class);

        when(convertRequest.getSpec()).thenReturn(null);
        convertController.convert(convertRequest);
    }

    @Test
    public void checkIfReturnResponsebodySuccess() throws IOException, BadRequestException {

        String spec = Utils.getStringFromResource("enhetsregisteret-openapi3.json");
        ConvertRequest convertRequest = ConvertRequest.builder().spec(spec).build();

        ConvertResponse convertResponse = convertController.convert(convertRequest);

        Assert.assertEquals(
            convertResponse.getApiSpecification().getInfo().getTitle(),
            "Åpne Data fra Enhetsregisteret - API Dokumentasjon");
    }

    @Test
    public void checkIfGettingSpecFromUrlSuccess() throws Exception {
        String url = Utils.getResourceUrl("enhetsregisteret-openapi3.json");
        ConvertRequest convertRequest = ConvertRequest.builder().url(url).build();

        ConvertResponse convertResponse = convertController.convert(convertRequest);

        Assert.assertEquals(
            convertResponse.getApiSpecification().getInfo().getTitle(),
            "Åpne Data fra Enhetsregisteret - API Dokumentasjon");
    }

    @Test(expected = BadRequestException.class)
    public void checkIfDownloadingSpecFailed() throws Exception {
        String url = "https://fake.url";

        ConvertRequest convertRequest = ConvertRequest.builder().url(url).build();

        convertController.convert(convertRequest);
    }
}
