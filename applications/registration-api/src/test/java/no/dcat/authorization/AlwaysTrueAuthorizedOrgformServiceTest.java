package no.dcat.authorization;

import no.fdk.test.testcategories.UnitTest;
import org.junit.Test;
import org.junit.experimental.categories.Category;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

@Category(UnitTest.class)
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
