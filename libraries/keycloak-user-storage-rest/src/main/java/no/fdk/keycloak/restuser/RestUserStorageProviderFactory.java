package no.fdk.keycloak.restuser;

import org.keycloak.component.ComponentModel;
import org.keycloak.models.KeycloakSession;
import org.keycloak.storage.UserStorageProviderFactory;

public class RestUserStorageProviderFactory implements UserStorageProviderFactory<RestUserStorageProvider> {

    @Override
    public RestUserStorageProvider create(KeycloakSession session, ComponentModel model) {
        return new RestUserStorageProvider(session, model);
    }

    @Override
    public String getId() {
        return "user-storage-rest";
    }

    @Override
    public String getHelpText() {
        return "User storage rest provider";
    }

    @Override
    public void close() {
    }
}
