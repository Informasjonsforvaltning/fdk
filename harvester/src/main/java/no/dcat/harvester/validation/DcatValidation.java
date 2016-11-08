package no.dcat.harvester.validation;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.apache.jena.query.QueryExecutionFactory;
import org.apache.jena.query.QueryParseException;
import org.apache.jena.query.ResultSet;
import org.apache.jena.rdf.model.Model;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
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
		logger.info("Reading validation rules: "  +file.toString());

		PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
		try {
			Resource[] resources = resolver.getResources("classpath*:validation-rules/**/*.rq");

			final boolean[] valid = {true};
			final ValidationHandler finalValidationHandler = validationHandler;

			for (Resource r : resources) {
				logger.info("validation-file: " + r.toString());
				InputStream is = r.getInputStream();

				String query = IOUtils.toString(is, "UTF-8");

				ResultSet resultSet = null;
				try {
					resultSet = QueryExecutionFactory.create(query, model).execSelect();

				} catch (QueryParseException e) {

					logger.error("QueryParseException in " + r.toString() + " : " + e.getMessage());
					throw e;
				}

				while (resultSet.hasNext()) {
					ValidationError error = new ValidationError(resultSet.next());
					finalValidationHandler.handle(error);
					if (error.isError()) {
						valid[0] = false;
					}
				}

			}
			/*
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

*/
			return valid[0];
		} catch (IOException e) {
			logger.error("Unable to load validation rules " + e.getMessage());
		}
		return false;
	}

}
