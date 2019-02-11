package no.dcat.harvester.validation;

import no.fdk.test.testcategories.UnitTest;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.util.FileManager;
import org.junit.Assert;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;
import java.util.Arrays;

/**
 * Created by nodavsko on 08.11.2016.
 */
@Category(UnitTest.class)
public class DcatValidationTest {
    private static Logger logger = LoggerFactory.getLogger(DcatValidationTest.class);

    @Test
    public void validateWithValidationHandlerAsNullShouldWork() {

        ClassLoader classLoader = getClass().getClassLoader();
        String dataFileUrl = classLoader.getResource("validation-test-data/").getFile();
        if (dataFileUrl == null) Assert.fail();
        File file = new File(dataFileUrl);

        Arrays.stream(file.listFiles((f) -> f.getName().endsWith(".rdf"))).forEach((f) -> {
            Model model = null;
            try {
                model = FileManager.get().loadModel(f.getCanonicalPath());
            } catch (IOException e) {
                e.printStackTrace();
            }
            Assert.assertTrue(DcatValidation.validate(model, null));
        });
    }

    @Test
    public void datasetWithWrongSyntaxShouldThrowException() {
        ClassLoader classLoader = getClass().getClassLoader();
        File file = new File(classLoader.getResource("datasett-syntax-error.ttl").getFile());

        Model model = null;
        try {
            model = FileManager.get().loadModel(file.getCanonicalPath());

        } catch (Exception e) {
            Assert.assertTrue("Exception thrown reading file with wrong syntax", true);
            return;
        }

        Assert.fail();
    }

    @Test
    public void validateDatasetWithErrorShouldReturnFalseAndErrorMessage() {

        ClassLoader classLoader = getClass().getClassLoader();
        File file = new File(classLoader.getResource("datasett-with-error.ttl").getFile());

        Model model = null;
        try {
            model = FileManager.get().loadModel(file.getCanonicalPath());
        } catch (Exception e) {
            Assert.fail();
        }

        final boolean[] errorFlag = {false};
        boolean validationFlag = DcatValidation.validate(model, (error) -> {
            if (error.isError()) {
                errorFlag[0] = true;
                logger.debug(error.toString());
            }
        });

        Assert.assertTrue(errorFlag[0]);
        Assert.assertFalse(validationFlag);

    }


    @Test
    public void validateWithNullModelShouldThrowIllegalArgumentException() {

        try {
            DcatValidation.validate(null, null);
        } catch (IllegalArgumentException e) {
            return;
        }

        Assert.fail();

    }
}


