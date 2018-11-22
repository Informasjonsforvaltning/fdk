package no.ccat.config;

import no.ccat.service.ElasticsearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ElasticsearchConfig {
    // trigger initialization of ElasticsearchService
    @Autowired
    ElasticsearchService earlyBean;
}
