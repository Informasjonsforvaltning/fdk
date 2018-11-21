package no.dcat.model;

import no.dcat.shared.testcategories.UnitTest;
import org.junit.Test;
import org.junit.experimental.categories.Category;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.not;
import static org.junit.Assert.assertThat;

@Category(UnitTest.class)
public class ApiRegistrationTest {


    @Test
    public void harvestStatusIsStored() {
        ApiRegistration registration = new ApiRegistration();

        ApiHarvestStatus status = new ApiHarvestStatus();
        status.success = true;
        registration.setHarvestStatus(status);

        assertThat(status, is(registration.getHarvestStatus()));
    }
}
