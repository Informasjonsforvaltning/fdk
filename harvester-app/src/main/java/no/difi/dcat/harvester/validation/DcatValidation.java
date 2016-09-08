package no.difi.dcat.harvester.validation;

import org.apache.commons.io.FileUtils;
import org.apache.jena.query.QueryExecutionFactory;
import org.apache.jena.query.QueryParseException;
import org.apache.jena.query.ResultSet;
import org.apache.jena.rdf.model.Model;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;
import java.util.Arrays;

/**
 * Created by havardottestad on 04/01/16.
 */
public class DcatValidation {

	private static final Logger logger = LoggerFactory.getLogger(DcatValidation.class);


	public static boolean validate(Model model, ValidationHandler validationHandler) {
		if (validationHandler == null) {
			validationHandler = (error) -> {
			};
		}

		ClassLoader classLoader = DcatValidation.class.getClassLoader();
		File file = new File(classLoader.getResource("validation-rules").getFile());

		final boolean[] valid = {true};
		final ValidationHandler finalValidationHandler = validationHandler;

		// iterate over directories inside resources/validation-rules
		Arrays.stream(file.listFiles((f) -> f.isDirectory()))
				.sorted()
				.forEach((d) -> {
					// iterate over rules inside given directory
					Arrays.stream(d.listFiles((dir) -> dir.getName().endsWith(".rq")))
							.sorted()
							.forEach((f) -> {
								try {
									String query = FileUtils.readFileToString(f);
									ResultSet resultSet = null;
									try {
										resultSet = QueryExecutionFactory.create(query, model).execSelect();

									} catch (QueryParseException e) {

										logger.error("QueryParseException in " + f.getCanonicalPath() + " : " + e.getMessage());
										throw e;
									}

									while (resultSet.hasNext()) {
										ValidationError error = new ValidationError(resultSet.next());
										finalValidationHandler.handle(error);
										if (error.isError()) {
											valid[0] = false;
										}
									}
								} catch (IOException e) {
									e.printStackTrace();
								}

							});
				});


		return valid[0];

	}

}
