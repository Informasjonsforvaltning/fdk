package no.fdk.keycloak.restuser;

import com.fasterxml.jackson.core.type.TypeReference;
import org.keycloak.broker.oidc.KeycloakOIDCIdentityProviderFactory;
import org.keycloak.broker.oidc.OIDCIdentityProviderFactory;
import org.keycloak.broker.oidc.mappers.AbstractClaimMapper;
import org.keycloak.broker.provider.BrokeredIdentityContext;
import org.keycloak.broker.provider.util.SimpleHttp;
import org.keycloak.models.IdentityProviderMapperModel;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.RealmModel;
import org.keycloak.models.UserModel;
import org.keycloak.provider.ProviderConfigProperty;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Consumer;


public class RestUserAttributeMapper extends AbstractClaimMapper {

    public static final String[] COMPATIBLE_PROVIDERS = {KeycloakOIDCIdentityProviderFactory.PROVIDER_ID, OIDCIdentityProviderFactory.PROVIDER_ID};
    public static final String USER_LOOKUP_URL_PREFIX = "user_lookup_url_prefix";
    public static final String PROVIDER_ID = "rest-user-attribute-idp-mapper";
    private static final List<ProviderConfigProperty> configProperties = new ArrayList<>();

    static {
        ProviderConfigProperty property;
        ProviderConfigProperty property1;
        property1 = new ProviderConfigProperty();
        property1.setName(CLAIM);
        property1.setLabel("User ID Claim");
        property1.setHelpText("Name of claim to use as user id for lookup");
        property1.setType(ProviderConfigProperty.STRING_TYPE);
        configProperties.add(property1);
        property = new ProviderConfigProperty();
        property.setName(USER_LOOKUP_URL_PREFIX);
        property.setLabel("User profile lookup url prefix");
        property.setHelpText("Url for user profile lookup. User id will appended to url.");
        property.setType(ProviderConfigProperty.STRING_TYPE);
        configProperties.add(property);
    }

    @Override
    public List<ProviderConfigProperty> getConfigProperties() {
        return configProperties;
    }

    @Override
    public String getId() {
        return PROVIDER_ID;
    }

    @Override
    public String[] getCompatibleProviders() {
        return COMPATIBLE_PROVIDERS;
    }

    @Override
    public String getDisplayCategory() {
        return "Attribute Importer";
    }

    @Override
    public String getDisplayType() {
        return "Rest user Importer";
    }

    @Override
    public void preprocessFederatedIdentity(KeycloakSession session, RealmModel realm, IdentityProviderMapperModel mapperModel, BrokeredIdentityContext context) {

        Map<String, String> userData = getRestUserData(session, mapperModel, context);

        userData.forEach((k, v) -> {
            if ("email".equalsIgnoreCase(k)) {
                setIfNotEmpty(context::setEmail, v);
            } else if ("firstName".equalsIgnoreCase(k)) {
                setIfNotEmpty(context::setFirstName, v);
            } else if ("lastName".equalsIgnoreCase(k)) {
                setIfNotEmpty(context::setLastName, v);
            } else {
                context.setUserAttribute(k, v);
            }
        });
    }

    @Override
    public void updateBrokeredUser(KeycloakSession session, RealmModel realm, UserModel user, IdentityProviderMapperModel mapperModel, BrokeredIdentityContext context) {

        Map<String, String> userData = getRestUserData(session, mapperModel, context);

        userData.forEach((k, v) -> {
            if ("email".equalsIgnoreCase(k)) {
                setIfNotEmpty(user::setEmail, v);
            } else if ("firstName".equalsIgnoreCase(k)) {
                setIfNotEmpty(user::setFirstName, v);
            } else if ("lastName".equalsIgnoreCase(k)) {
                setIfNotEmpty(user::setLastName, v);
            } else {
                user.setSingleAttribute(k, v);
            }
        });
    }

    @Override
    public String getHelpText() {
        return "Import user fields and attributes from REST endpoint declared claim if it exists in ID, access token or the claim set returned by the user profile endpoint into the specified user property or attribute.";
    }

    private Map<String, String> getRestUserData(KeycloakSession session, IdentityProviderMapperModel mapperModel, BrokeredIdentityContext context) {
        Object claimValue = getClaimValue(mapperModel, context);
        if (claimValue == null) {
            return new HashMap<String,String>();
        }
        String userId = String.valueOf(claimValue);
        String urlPrefix = mapperModel.getConfig().get(USER_LOOKUP_URL_PREFIX);
        String userUrl = urlPrefix + userId;
        try {
            return SimpleHttp.doGet(userUrl, session).asJson(new TypeReference<Map<String, String>>() {
            });
        } catch (IOException e) {
            throw new RuntimeException("Authentication error, user not found");
        }
    }

    private void setIfNotEmpty(Consumer<String> consumer, String value) {
        if (value != null && !value.isEmpty()) {
            consumer.accept(value);
        }
    }
}
