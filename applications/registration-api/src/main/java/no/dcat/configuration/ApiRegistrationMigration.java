package no.dcat.configuration;

import no.dcat.model.ApiRegistration;
import no.dcat.service.ApiRegistrationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;
import java.util.HashSet;

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

        for (ApiRegistration apiRegistration : apiRegistrations) {
            if (apiRegistration.getDatasetReferences() != null) {
                if (apiRegistration.getDatasetUris() == null) {
                    apiRegistration.setDatasetUris(new HashSet<>(apiRegistration.getDatasetReferences()));
                }
                apiRegistration.setDatasetReferences(null);
                apiRegistrationRepository.save(apiRegistration);
                logger.info("Migrated ApiRegistrations from datasetReferences to datasetUris, id=" + apiRegistration.getId());
            }
        }
    }
}
