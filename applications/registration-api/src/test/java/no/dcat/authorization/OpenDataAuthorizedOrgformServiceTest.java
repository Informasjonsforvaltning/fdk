package no.dcat.authorization;

import no.fdk.test.testcategories.UnitTest;
import org.junit.Before;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import javax.management.RuntimeErrorException;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
@Category(UnitTest.class)
public class OpenDataAuthorizedOrgformServiceTest {

    private AuthorizedOrgformService orgformService = new OpenDataAuthorizedOrgformService();

    @Mock
    private RestTemplate restTemplate;

    @Before
    public void setUp() throws Exception {
        OpenDataAuthorizedOrgformService openDataAuthorizedOrgformService = (OpenDataAuthorizedOrgformService) orgformService;
        openDataAuthorizedOrgformService.setRestTemplate(restTemplate);
        openDataAuthorizedOrgformService.setAuthorizedCodes(new String[]{"ORGL"});
        openDataAuthorizedOrgformService.setAuthorizedOrgnr(new String[]{"980123456"});
        openDataAuthorizedOrgformService.setOpenDataEnhetsregisteret("data.brreg.no/enheter/");
    }

    @Test
    public void isIncluded_orgformIsInList_shouldBeIncluded() throws Exception {
        OpenDataEnhet statsforetak = new OpenDataEnhet("980123444", "Statsforetaket", new OpenDataOrganisasjonsform("ORGL"));
        when(restTemplate.getForEntity("data.brreg.no/enheter/980123444", OpenDataEnhet.class)).thenReturn(new ResponseEntity<>(statsforetak, HttpStatus.OK));

        Entity entity = new Entity();
        entity.setOrganizationNumber("980123444");

        assertThat(orgformService.isIncluded(entity), is(true));
    }

    @Test
    public void isIncluded_orgnrIsInList_shouldBeIncluded() throws Exception {
        OpenDataEnhet hattfjelldal = new OpenDataEnhet("980123456", "Hattfjelldal grillkiosk", new OpenDataOrganisasjonsform("ENK"));
        when(restTemplate.getForEntity("data.brreg.no/enheter/980123456", OpenDataEnhet.class)).thenReturn(new ResponseEntity<>(hattfjelldal, HttpStatus.OK));

        Entity entity = new Entity();
        entity.setOrganizationNumber("980123456");

        assertThat(orgformService.isIncluded(entity), is(true));
    }

    @Test
    public void isIncluded_orgformAndOrgnrNotInList_shouldNotBeIncluded() throws Exception {
        OpenDataEnhet annet = new OpenDataEnhet("980123333", "Annet foretak", new OpenDataOrganisasjonsform("AS"));
        when(restTemplate.getForEntity("data.brreg.no/enheter/980123333", OpenDataEnhet.class)).thenReturn(new ResponseEntity<>(annet, HttpStatus.OK));

        Entity entity = new Entity();
        entity.setOrganizationNumber("980123333");

        assertThat(orgformService.isIncluded(entity), is(false));
    }


    @Test
    public void isIncluded_orgnrNotFound_shouldNotBeIncluded() throws Exception {
        when(restTemplate.getForEntity("data.brreg.no/enheter/980121111", OpenDataEnhet.class)).thenReturn(new ResponseEntity<>(HttpStatus.NOT_FOUND));

        Entity entity = new Entity();
        entity.setOrganizationNumber("980121111");

        assertThat(orgformService.isIncluded(entity), is(false));
    }

    @Test
    public void isIncluded_serviceFailed_shouldNotBeIncluded() throws Exception {
        when(restTemplate.getForEntity("data.brreg.no/enheter/980123333", OpenDataEnhet.class)).thenThrow(new RuntimeErrorException(new Error()));

        Entity entity = new Entity();
        entity.setOrganizationNumber("980123333");

        assertThat(orgformService.isIncluded(entity), is(false));
    }

}
