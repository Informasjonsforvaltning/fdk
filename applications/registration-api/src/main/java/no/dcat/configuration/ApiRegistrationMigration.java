package no.dcat.configuration;

import no.dcat.model.ApiRegistration;
import no.dcat.service.ApiRegistrationRepository;
import no.fdk.acat.converters.apispecificationparser.OpenAPIToApiSpecificationConverter;
import no.fdk.acat.converters.apispecificationparser.ParseException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;

@Configuration
public class ApiRegistrationMigration {
    private Logger logger = LoggerFactory.getLogger(ApiRegistrationMigration.class);

    private ApiRegistrationRepository apiRegistrationRepository;

    @Autowired
    public ApiRegistrationMigration(ApiRegistrationRepository apiRegistrationRepository) {
        this.apiRegistrationRepository = apiRegistrationRepository;
    }

    @PostConstruct
    public void migrate() {
        Iterable<ApiRegistration> apiRegistrations = apiRegistrationRepository.findAll();

        OpenAPIToApiSpecificationConverter converter = new OpenAPIToApiSpecificationConverter();
        for (ApiRegistration apiRegistration : apiRegistrations) {
            if (apiRegistration.getOpenApi() != null) {
                try {
                    if (apiRegistration.getApiSpecification() == null) {
                        apiRegistration.setApiSpecification(converter.convert(apiRegistration.getOpenApi()));
                    }
                    apiRegistration.setOpenApi(null);
                    apiRegistrationRepository.save(apiRegistration);
                    logger.info("Migrated ApiRegistrations from OpenAPI to ApiSpecification, id=" + apiRegistration.getId());
                } catch (ParseException e) {
                    logger.warn("ApiRegistration conversion failed for id=:" + apiRegistration.getId(), e);
                }
            }
        }
    }
}
