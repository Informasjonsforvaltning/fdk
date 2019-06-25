package no.fdk.keycloak.restuser;

import com.fasterxml.jackson.core.type.TypeReference;
import org.jboss.logging.Logger;
import org.keycloak.broker.provider.util.SimpleHttp;
import org.keycloak.component.ComponentModel;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.RealmModel;
import org.keycloak.models.UserModel;
import org.keycloak.storage.StorageId;
import org.keycloak.storage.UserStorageProvider;
import org.keycloak.storage.user.UserLookupProvider;

import java.io.IOException;
import java.util.Map;

public class RestUserStorageProvider implements UserStorageProvider,
    UserLookupProvider {
    private static final Logger logger = Logger.getLogger(RestUserStorageProvider.class);
    //TODO read url from conf
    private static final String USER_URL_BASE = "http://user-api:8080/users/";
    protected ComponentModel model;
    protected KeycloakSession session;

    public RestUserStorageProvider(KeycloakSession session, ComponentModel model) {
        this.model = model;
        this.session = session;
        logger.info("user storage provider init:" + model.toString());
    }

    @Override
    public void close() {
    }

    @Override
    public UserModel getUserById(String id, RealmModel realm) {

        logger.info("getUserById: " + id);
        String username = StorageId.externalId(id);
        return getUserByUsername(username, realm);
    }

    @Override
    public UserModel getUserByUsername(String username, RealmModel realm) {
        /*

         We throw runtime error because of implementation limitation of user federation integration with authentication federation.
        The only way how to query federation user, is to use the authentication strategy "Create User If Unique", because this consults user federation.
        Using this strategy, however would create new users in keycloak local user repository as fallback, if not found in federation.
        Throwing an error is a workaround for this problem, as in this case authentication fails and new user is not created.
        Keep in mind that this error can normally occur only on system misconfiguration - normally we expect all authenticated users to be found in federation.

         */


        if (username == null) {
            throw new RuntimeException("Invalid username: null");
        }

        Map<String, String> userData = getUserData(username);

        UserModel user = new RestUserAdapter(session, realm, model, userData);

        if (!username.equals(user.getUsername())) {
            throw new RuntimeException("Response error: Username does not match");
        }

        String firstName = user.getFirstName();
        String lastName = user.getLastName();

        if ((null == firstName || firstName.isEmpty()) && (null == lastName || lastName.isEmpty())) {
            throw new RuntimeException("Response error: User does not have name");
        }

        return user;
    }

    Map<String, String> getUserData(String username) {
        Map<String, String> userData;
        try {
            userData = SimpleHttp.doGet(USER_URL_BASE + username, session)
                .asJson(new TypeReference<Map<String, String>>() {
                });
        } catch (IOException e) {
            throw new RuntimeException("Authentication error, user not found");
        }
        return userData;
    }

    @Override
    public UserModel getUserByEmail(String email, RealmModel realm) {
        throw new RuntimeException("getUserByEmail method not implemented");
    }

}
