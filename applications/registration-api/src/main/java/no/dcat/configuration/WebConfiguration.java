package no.dcat.configuration;

import no.dcat.datastore.domain.dcat.RdfMessageConverter;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;

@ComponentScan("no.fdk.harvestqueue")
@Configuration
public class WebConfiguration implements WebMvcConfigurer {

    @Override
    public void extendMessageConverters(List<HttpMessageConverter<?>> converters) {
        RdfMessageConverter converter = new RdfMessageConverter();
        converters.add(0, new RdfMessageConverter());
    }
}
