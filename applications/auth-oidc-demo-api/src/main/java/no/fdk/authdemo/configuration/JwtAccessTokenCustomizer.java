package no.fdk.authdemo.configuration;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.security.oauth2.resource.JwtAccessTokenConverterConfigurer;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.security.oauth2.provider.token.DefaultAccessTokenConverter;
import org.springframework.security.oauth2.provider.token.store.JwtAccessTokenConverter;

import java.util.Arrays;
import java.util.Collection;
import java.util.Map;

public class JwtAccessTokenCustomizer extends DefaultAccessTokenConverter implements JwtAccessTokenConverterConfigurer {

    private static final Logger logger = LoggerFactory.getLogger(JwtAccessTokenCustomizer.class);

    public void configure(JwtAccessTokenConverter converter) {
        converter.setAccessTokenConverter(this);
        logger.info("Configured {}", JwtAccessTokenConverter.class.getSimpleName());
    }

    @Override
    public OAuth2Authentication extractAuthentication(Map<String, ?> tokenMap) {
        // Spring oauth2 expects authorities item in the token map.
        // Extract list of authorities from fdk_access field
        Object fdkAccessProperty = tokenMap.get("fdk_access");
        if (fdkAccessProperty != null) {
            String fdkAccessClaim = tokenMap.get("fdk_access").toString();
            String[] authorities = fdkAccessClaim.split("\\s*(,|\\s)\\s*");
            Collection<String> authorityList = Arrays.asList(authorities);
            ((Map<String, Object>) tokenMap).put("authorities", authorityList);
        }

        return super.extractAuthentication(tokenMap);
    }
}
