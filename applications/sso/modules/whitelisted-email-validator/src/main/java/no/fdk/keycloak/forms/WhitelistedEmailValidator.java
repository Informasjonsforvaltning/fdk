package no.fdk.keycloak.forms;

import org.apache.http.HttpStatus;
import org.jboss.logging.Logger;
import org.keycloak.Config;
import org.keycloak.authentication.FormAction;
import org.keycloak.authentication.FormActionFactory;
import org.keycloak.authentication.FormContext;
import org.keycloak.authentication.ValidationContext;
import org.keycloak.authentication.forms.RegistrationPage;
import org.keycloak.broker.provider.util.SimpleHttp;
import org.keycloak.events.Details;
import org.keycloak.events.Errors;
import org.keycloak.forms.login.LoginFormsProvider;
import org.keycloak.models.*;
import org.keycloak.models.utils.FormMessage;
import org.keycloak.provider.ProviderConfigProperty;
import org.keycloak.services.messages.Messages;
import org.keycloak.services.validation.Validation;

import javax.ws.rs.core.MultivaluedMap;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class WhitelistedEmailValidator implements FormAction, FormActionFactory {
    private static final String ORGANISATION_CATALOGUE_DOMAINS_URL_PATTERN = "http://organization-catalogue:8080/domains/:domain";
    private static final String PROVIDER_ID = "whitelisted-email-validator-action";
    private static final Logger logger = Logger.getLogger(WhitelistedEmailValidator.class);
    private static AuthenticationExecutionModel.Requirement[] REQUIREMENT_CHOICES = {
        AuthenticationExecutionModel.Requirement.REQUIRED,
        AuthenticationExecutionModel.Requirement.DISABLED
    };

    @Override
    public String getHelpText() {
        return "Validates that email domain name belongs to whitelisted organisations.";
    }

    @Override
    public List<ProviderConfigProperty> getConfigProperties() {
        return null;
    }

    @Override
    public void validate(ValidationContext context) {
        MultivaluedMap<String, String> formData = context.getHttpRequest().getDecodedFormParameters();
        List<FormMessage> errors = new ArrayList<>();

        context.getEvent().detail(Details.REGISTER_METHOD, "form");

        String email = formData.getFirst(Validation.FIELD_EMAIL);

        if (email == null || !isValidEmail(email, context.getSession())) {
            errors.add(new FormMessage(RegistrationPage.FIELD_EMAIL, Messages.INVALID_EMAIL));
        }

        if (errors.size() > 0) {
            context.error(Errors.INVALID_REGISTRATION);
            context.validationError(formData, errors);
        } else {
            context.success();
        }
    }

    private boolean isValidEmail(String email, KeycloakSession session) {
        logger.infov("Starting email validation for {0}", email);
        String domain = email.substring(email.indexOf('@') + 1);
        logger.infov("Extracted {0} domain from {1}", domain, email);
        try {
            String url = ORGANISATION_CATALOGUE_DOMAINS_URL_PATTERN.replaceAll(":domain", domain);
            logger.infov("Created request URL ({0}) for checking whitelisted email", url);
            int status = SimpleHttp
                .doGet(url, session)
                .acceptJson()
                .asStatus();
            logger.infov("Server responded with status: {0}", status);
            if (status == HttpStatus.SC_OK) {
                logger.infov("Email domain is whitelisted");
                return true;
            }
            logger.infov("Email domain not allowed");
            return false;
        } catch (IOException e) {
            logger.errorv("Failed to fetch organisation for {0}", domain, e);
        }
        return false;
    }

    @Override
    public void success(FormContext context) {

    }

    @Override
    public void buildPage(FormContext context, LoginFormsProvider form) {

    }

    @Override
    public boolean requiresUser() {
        return false;
    }

    @Override
    public boolean configuredFor(KeycloakSession session, RealmModel realm, UserModel user) {
        return true;
    }

    @Override
    public void setRequiredActions(KeycloakSession session, RealmModel realm, UserModel user) {

    }

    @Override
    public boolean isUserSetupAllowed() {
        return false;
    }

    @Override
    public void close() {

    }

    @Override
    public String getDisplayType() {
        return "Whitelisted Email Validation";
    }

    @Override
    public String getReferenceCategory() {
        return null;
    }

    @Override
    public boolean isConfigurable() {
        return false;
    }

    @Override
    public AuthenticationExecutionModel.Requirement[] getRequirementChoices() {
        return REQUIREMENT_CHOICES;
    }

    @Override
    public FormAction create(KeycloakSession session) {
        return this;
    }

    @Override
    public void init(Config.Scope config) {

    }

    @Override
    public void postInit(KeycloakSessionFactory factory) {

    }

    @Override
    public String getId() {
        return PROVIDER_ID;
    }
}
