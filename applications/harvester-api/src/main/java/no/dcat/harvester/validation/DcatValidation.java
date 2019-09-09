package no.dcat.harvester.validation;

import org.apache.commons.io.IOUtils;
import org.apache.jena.query.QueryExecutionFactory;
import org.apache.jena.query.QuerySolution;
import org.apache.jena.query.ResultSet;
import org.apache.jena.rdf.model.Literal;
import org.apache.jena.rdf.model.Model;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.util.Assert;

import java.io.IOException;
import java.io.InputStream;

/**
 * Created by havardottestad on 04/01/16.
 * Rewritten by nodavsko on 07/11/16.
 */
public class DcatValidation {

    private static final Logger logger = LoggerFactory.getLogger(DcatValidation.class);

    /**
     * Validates the model argument against the various validation rules of DCAT-AP-xx
     * Validation warnings and errors are recorded in the validationHandler parameter.
     * <predicate>
     * The operation returns false if errors are detected. It returns true if only warnings have been detected.
     * It reads validation files in SPARQL format that is stored under src/main/resources/validation-rules.
     *
     * @param model             the DCAT RDF model to be validated.
     * @param validationHandler a handler for reporting validation problems
     * @return a boolean that is true if no errors are detected and false if errors are detected
     */
    public static boolean validate(Model model, ValidationHandler validationHandler) {
        Assert.notNull(model);

        if (validationHandler == null) {
            validationHandler = (error) -> {
            };
        }

        PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
        try {
            // identify validation rules files
            Resource[] resources = resolver.getResources("classpath*:validation-rules/**/*.rq");

            final boolean[] valid = {true};
            final ValidationHandler finalValidationHandler = validationHandler;

            // for each file validate
            for (Resource r : resources) {
                //logger.trace("Checking against validation-rule in file: " + r.toString());
                InputStream is = r.getInputStream();

                String query = IOUtils.toString(is, "UTF-8");

                ResultSet resultSet = null;
                try {
                    resultSet = QueryExecutionFactory.create(query, model).execSelect();

                } catch (Exception e) {

                    logger.error("QueryParseException in " + r.toString() + " : " + e.getMessage());
                    throw e;
                } finally {
                    try {
                        is.close();
                    } catch (Throwable t) {
                        //We silently swallow any errors on closing, any serious errors should have been caught and logged in the exception clause above
                    }
                }

                while (resultSet != null && resultSet.hasNext()) {

                    ValidationError error = validationError(resultSet.next());
                    finalValidationHandler.handle(error);
                    if (error.isError()) {
                        valid[0] = false;
                    }
                }
            }

            return valid[0];
        } catch (IOException e) {
            logger.error("Unable to load validation rules " + e.getMessage(), e);
        }
        return false;
    }

    static ValidationError validationError(QuerySolution next) {
        Literal messageLiteral = next.getLiteral("Message");
        String message = "Validation error: no error message supplied";
        if (messageLiteral != null) {
            message = messageLiteral.toString();
        }

        ValidationError error = new ValidationError(
                next.getLiteral("Class_Name").toString(),
                next.getLiteral("Rule_ID").getInt(),
                ValidationError.RuleSeverity.valueOf(next.getLiteral("Rule_Severity").toString()),
                next.getLiteral("Rule_Description").toString(),
                message,
                next.get("s"),
                next.get("p"),
                next.get("o"));

        return error;
    }

}
