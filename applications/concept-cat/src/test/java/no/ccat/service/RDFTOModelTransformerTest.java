package no.ccat.service;

import no.dcat.shared.testcategories.UnitTest;
import org.junit.Assert;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.springframework.test.context.ActiveProfiles;

@ActiveProfiles("unit-integration")
@Category(UnitTest.class)
public class RDFTOModelTransformerTest {

    @Test
    public void verifySanitization() throws Throwable {
        String unsanitizedPhone = "tel: +4755555555";
        String sanitizedPhone = "+4755555555";
        String unsanitizedEmail = "mailto: somemail@somewhere.com";
        String sanitizedEmail = "somemail@somewhere.com";

        Assert.assertTrue("Sanitization was not done as expected", sanitizedEmail.equalsIgnoreCase(RDFToModelTransformer.sanitizeField(unsanitizedEmail)));
        Assert.assertTrue("Sanitization was not done as expected", sanitizedPhone.equalsIgnoreCase(RDFToModelTransformer.sanitizeField(unsanitizedPhone)));
    }
}
