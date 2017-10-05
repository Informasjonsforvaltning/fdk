package no.dcat.authorization;

import org.junit.Test;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

public class AlwaysTrueAuthorizedOrgformServiceTest {

    private AuthorizedOrgformService orgformService = new AlwaysTrueAuthorizedOrgformService();

    @Test
    public void isIncluded_alwaysTrue() throws Exception {
        assertThat(orgformService.isIncluded(null), is(true));
        assertThat(orgformService.isIncluded(new Entity()), is(true));

        Entity entity = new Entity();
        entity.setOrganizationNumber("980123456");
        assertThat(orgformService.isIncluded(null), is(true));
    }

}