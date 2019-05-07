/*
 * Copyright 2016 Red Hat, Inc. and/or its affiliates
 * and other contributors as indicated by the @author tags.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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

/**
 * u
 *
 * @author <a href="mailto:bill@burkecentral.com">Bill Burke</a>
 * @version $Revision: 1 $
 */
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
        logger.info("getUserByUsername: " + username);
        if(username==null){
            return null;
        }

        try {
            Map<String, String> userData = SimpleHttp.doGet(USER_URL_BASE + username, session)
                .asJson(new TypeReference<Map<String, String>>() {
                });
            logger.info("user found:" + userData.toString());
            UserModel user = new RestUserAdapter(session, realm, model, userData);
            if (!username.equals(user.getUsername())) {
                throw new IOException("Response parse error");
            }
            logger.info("user adapted:" + user.toString());
            return user;
        } catch (IOException e) {
            logger.warn("Error fetching user data", e);
            return null;
        }

    }

    @Override
    public UserModel getUserByEmail(String email, RealmModel realm) {
        throw new RuntimeException("getUserByEmail method not implemented");
    }

}
