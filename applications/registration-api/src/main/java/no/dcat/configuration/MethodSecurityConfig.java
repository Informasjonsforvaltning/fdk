package no.dcat.configuration;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.expression.method.DefaultMethodSecurityExpressionHandler;
import org.springframework.security.access.expression.method.MethodSecurityExpressionHandler;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.method.configuration.GlobalMethodSecurityConfiguration;

/**
 * Created by dask on 02.06.2017.
 */
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class MethodSecurityConfig extends GlobalMethodSecurityConfiguration {
    private static Logger logger = LoggerFactory.getLogger(MethodSecurityConfig.class);

    private final FdkPermissionEvaluator fdkPermissionEvaluator;

    public MethodSecurityConfig() {
        logger.info("method config");
        this.fdkPermissionEvaluator = new FdkPermissionEvaluator();
    }

    @Override
    protected MethodSecurityExpressionHandler createExpressionHandler() {
        DefaultMethodSecurityExpressionHandler expressionHandler = new DefaultMethodSecurityExpressionHandler();

        expressionHandler.setPermissionEvaluator(fdkPermissionEvaluator);

        return expressionHandler;
    }

}
