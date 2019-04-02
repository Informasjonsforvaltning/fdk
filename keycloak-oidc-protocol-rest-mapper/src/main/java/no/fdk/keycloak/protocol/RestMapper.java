package no.fdk.keycloak.protocol;

import com.fasterxml.jackson.core.type.TypeReference;
import org.apache.http.HttpEntity;
import org.apache.http.HttpHeaders;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.jboss.logging.Logger;
import org.keycloak.Config;
import org.keycloak.connections.httpclient.HttpClientProvider;
import org.keycloak.models.*;
import org.keycloak.protocol.ProtocolMapperUtils;
import org.keycloak.protocol.oidc.mappers.*;
import org.keycloak.provider.ProviderConfigProperty;
import org.keycloak.representations.IDToken;
import org.keycloak.util.JsonSerialization;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/*
 * Our own example protocol mapper.
 */
public class RestMapper extends AbstractOIDCProtocolMapper implements OIDCAccessTokenMapper, OIDCIDTokenMapper, UserInfoTokenMapper {
    public static final String PROVIDER_ID = "oidc-rest-mapper";
    public static final String PROPERTY_ENTITIY_URL_BASE = "entity_url_base";
    public static final String PROPERTY_ENTITY_FIELD = "entity_field";
    private static final Logger logger = Logger.getLogger(RestMapper.class);
    /*
     * A config which keycloak uses to display a generic dialog to configure the token.
     */
    private static final List<ProviderConfigProperty> configProperties = new ArrayList<>();

    static {
        ProviderConfigProperty property;
        property = new ProviderConfigProperty();
        property.setName(ProtocolMapperUtils.USER_ATTRIBUTE);
        property.setLabel("Entity id from property");
        property.setType(ProviderConfigProperty.STRING_TYPE);
        property.setHelpText(ProtocolMapperUtils.USER_MODEL_PROPERTY_HELP_TEXT);
        configProperties.add(property);

        property = new ProviderConfigProperty();
        property.setName(PROPERTY_ENTITIY_URL_BASE);
        property.setLabel("Entity url base");
        property.setType(ProviderConfigProperty.STRING_TYPE);
        property.setHelpText("Base of REST entity endpoint URL. eg \"https://servername:8080/users/\"");
        configProperties.add(property);

        property = new ProviderConfigProperty();
        property.setName(PROPERTY_ENTITY_FIELD);
        property.setLabel("Entity field");
        property.setType(ProviderConfigProperty.STRING_TYPE);
        property.setHelpText("Name of field to be mapped as claim");
        configProperties.add(property);

        // The builtin protocol mapper let the user define under which claim name (key)
        // the protocol mapper writes its value. To display this option in the generic dialog
        // in keycloak, execute the following method.
        OIDCAttributeMapperHelper.addAttributeConfig(configProperties, RestMapper.class);

        logger.debugf("static init hello = '%s'", "world");
    }

    private KeycloakSession session;

    public void postInit(KeycloakSessionFactory factory) {
        this.session = factory.create();
    }

    @Override
    public void init(Config.Scope config) {
    }

    @Override
    public String getDisplayCategory() {
        return "Token mapper";
    }

    @Override
    public String getDisplayType() {
        return "REST mapper";
    }

    @Override
    public String getHelpText() {
        return "Calls REST Json endpoint and reads a copies value of a field to designated claim";
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
    protected void setClaim(IDToken token, ProtocolMapperModel mappingModel, UserSessionModel userSession) {
        UserModel user = userSession.getUser();
        String propertyName = mappingModel.getConfig().get(ProtocolMapperUtils.USER_ATTRIBUTE);
        String urlBase = mappingModel.getConfig().get(PROPERTY_ENTITIY_URL_BASE);
        String fieldName = mappingModel.getConfig().get(PROPERTY_ENTITY_FIELD);
        String responseValue = null;

        String propertyValue = ProtocolMapperUtils.getUserModelValue(user, propertyName);
        Map<String, String> responseMap;
        logger.debugf("debugging rest mapper. url= '%s', idfield='%s', id='%s', field='%s'", urlBase,propertyName,propertyValue,fieldName);
        try {
            HttpClient httpClient = session.getProvider(HttpClientProvider.class).getHttpClient();
            HttpResponse response = null;
            String uri = urlBase + propertyValue;
            for (int i = 0; i < 2; i++) { // follow redirects once
                HttpGet get = new HttpGet(uri);
                response = httpClient.execute(get);
                int status = response.getStatusLine().getStatusCode();
                if (status == 302) {
                    //redirect
                    uri = response.getFirstHeader(HttpHeaders.LOCATION).getValue();
                    continue;
                }
            }
            HttpEntity entity = response.getEntity();
            InputStream is = entity.getContent();
            responseMap = JsonSerialization.readValue(is, new TypeReference<Map<String, String>>() {
            });
            responseValue = responseMap.get(fieldName);
            is.close();
        } catch (Exception e) {
            logger.warn("Error executing mapping lookup", e);
        }
        if (responseValue == null) return;
        OIDCAttributeMapperHelper.mapClaim(token, mappingModel, responseValue);
    }

}
