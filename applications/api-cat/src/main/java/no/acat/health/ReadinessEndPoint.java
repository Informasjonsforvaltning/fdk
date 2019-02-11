package no.acat.health;

import no.acat.repository.ApiDocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.actuate.endpoint.annotation.Endpoint;
import org.springframework.boot.actuate.endpoint.annotation.ReadOperation;
import org.springframework.boot.actuate.endpoint.web.WebEndpointResponse;
import org.springframework.boot.actuate.health.Health;
import org.springframework.stereotype.Component;

@Component
@Endpoint(id = "readiness")
public class ReadinessEndPoint {
    private ApiDocumentRepository apiDocumentRepository;

    @Autowired
    public ReadinessEndPoint(ApiDocumentRepository apiDocumentRepository) {
        this.apiDocumentRepository = apiDocumentRepository;
    }

    @ReadOperation
    public WebEndpointResponse<Health> health() {
        boolean up;

        try {
            long count = this.apiDocumentRepository.getCount();
            up = count > 0;
        } catch (Exception e) {
            up = false;
        }

        if (!up) {
            return new WebEndpointResponse(Health.down().build(), 503);
        }
        return new WebEndpointResponse(Health.up().build(), 200);
    }
}
