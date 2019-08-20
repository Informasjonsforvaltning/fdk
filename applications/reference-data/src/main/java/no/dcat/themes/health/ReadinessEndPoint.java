package no.dcat.themes.health;

import no.dcat.themes.service.ThemesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.actuate.endpoint.annotation.Endpoint;
import org.springframework.boot.actuate.endpoint.annotation.ReadOperation;
import org.springframework.boot.actuate.endpoint.web.WebEndpointResponse;
import org.springframework.boot.actuate.health.Health;
import org.springframework.stereotype.Component;

@Component
@Endpoint(id = "readiness")
public class ReadinessEndPoint {
    private ThemesService themesService;

    @Autowired
    public ReadinessEndPoint(ThemesService themesService) {
        this.themesService = themesService;
    }

    @ReadOperation
    public WebEndpointResponse<Health> health() {
        boolean up;

        try {
            int count = themesService.getThemes().size();
            up = count > 0;
        } catch (Exception e) {
            up = false;
        }

        if (!up) {
            return new WebEndpointResponse<>(Health.down().build(), 503);
        }
        return new WebEndpointResponse<>(Health.up().build(), 200);
    }
}
