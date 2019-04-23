package no.fdk.authdemo.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.method.configuration.GlobalMethodSecurityConfiguration;

@Configuration
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class MethodSecurityConfig extends GlobalMethodSecurityConfiguration {

    public MethodSecurityConfig() {
    }

    @Bean
    public FdkPermissionEvaluator fdkPermissionEvaluator() {
        return new FdkPermissionEvaluator();
    }

//     TODO it is unknown why the permission evaluator bean is sufficient for overriding.
//     Could it be timing issue?
//     The below override was found in documentation: https://www.baeldung.com/spring-security-create-new-custom-security-expression
//     However, it did not get executed, therefore is commented out.

//    @Override
//    protected MethodSecurityExpressionHandler createExpressionHandler() {
//        DefaultMethodSecurityExpressionHandler expressionHandler = new DefaultMethodSecurityExpressionHandler();
//
//        expressionHandler.setPermissionEvaluator(fdkPermissionEvaluator());
//
//        return expressionHandler;
//    }

}
