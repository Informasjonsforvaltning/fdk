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
package no.fdk.keycloak.user;

import org.jboss.logging.Logger;
import org.keycloak.component.ComponentModel;
import org.keycloak.credential.CredentialInput;
import org.keycloak.credential.CredentialInputValidator;
import org.keycloak.credential.CredentialModel;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.RealmModel;
import org.keycloak.models.UserCredentialModel;
import org.keycloak.models.UserModel;
import org.keycloak.models.cache.CachedUserModel;
import org.keycloak.models.cache.OnUserCache;
import org.keycloak.storage.StorageId;
import org.keycloak.storage.UserStorageProvider;
import org.keycloak.storage.user.UserLookupProvider;

import java.util.HashMap;
import java.util.Map;

/**
 * u
 *
 * @author <a href="mailto:bill@burkecentral.com">Bill Burke</a>
 * @version $Revision: 1 $
 */
public class RestUserStorageProvider implements UserStorageProvider,
    UserLookupProvider
//    ,
//        UserRegistrationProvider,
//        UserQueryProvider,
//    CredentialInputUpdater,

//    OnUserCache
//    ,
//    CredentialInputValidator
{
    public static final String PASSWORD_CACHE_KEY = UserAdapter.class.getName() + ".password";
    private static final Logger logger = Logger.getLogger(RestUserStorageProvider.class);
    protected ComponentModel model;
    protected KeycloakSession session;

    private Map<String, UserEntity> demoUsers = new HashMap<String, UserEntity>() {{
        put("a", new UserEntity("a", "a", "a"));
        put("b", new UserEntity("b", "b", "b"));
    }};

//    @Override
//    public void preRemove(RealmModel realm) {
//
//    }
//
//    @Override
//    public void preRemove(RealmModel realm, GroupModel group) {
//
//    }
//
//    @Override
//    public void preRemove(RealmModel realm, RoleModel role) {
//
//    }

    public RestUserStorageProvider(KeycloakSession session, ComponentModel model) {
        this.model = model;
        this.session = session;
    }

    @Override
    public void close() {
    }

    //todo understand when it is called and what is default id for federated users there is some id generator function
    //todo call by username
    @Override
    public UserModel getUserById(String id, RealmModel realm) {

        logger.info("getUserById: " + id);
//        throw new RuntimeException("getUserById method not implemented");
//        String persistenceId = StorageId.externalId(id);

//        UserEntity entity = em.find(UserEntity.class, persistenceId);
//        if (entity == null) {
//            logger.info("could not find user by id: " + id);
//            return null;
//        }
//        return new UserAdapter(session, realm, model, entity);
        String username = StorageId.externalId(id);
        return getUserByUsername(username, realm);
    }

    // username will be mapped as idp:<pid> in the idporten mapper.
    @Override
    public UserModel getUserByUsername(String username, RealmModel realm) {
        logger.info("getUserByUsername: " + username);
//        TypedQuery<UserEntity> query = em.createNamedQuery("getUserByUsername", UserEntity.class);
//        query.setParameter("username", username);
//        List<UserEntity> result = query.getResultList();
//        if (result.isEmpty()) {
//            logger.info("could not find username: " + username);
//            return null;
//        }

        logger.info("justbeforeget" + username);

        UserEntity user = demoUsers.get(username);

        if (user == null) {
            logger.info("user not foundfound:" + username);
            return null;
        }
        logger.info("user found:" + user.toString());
        logger.info("user adapted:" + (new UserAdapter(session, realm, model, user)).toString());

        return new UserAdapter(session, realm, model, user);
    }

//    @Override
//    public UserModel addUser(RealmModel realm, String username) {
//        UserEntity entity = new UserEntity();
//        entity.setId(UUID.randomUUID().toString());
//        entity.setUsername(username);
//        em.persist(entity);
//        logger.info("added user: " + username);
//        return new UserAdapter(session, realm, model, entity);
//    }

//    @Override
//    public boolean removeUser(RealmModel realm, UserModel user) {
//        String persistenceId = StorageId.externalId(user.getId());
//        UserEntity entity = em.find(UserEntity.class, persistenceId);
//        if (entity == null) return false;
//        em.remove(entity);
//        return true;
//    }

//    @Override
//    public void onCache(RealmModel realm, CachedUserModel user, UserModel delegate) {
//        String password = ((UserAdapter) delegate).getPassword();
//        if (password != null) {
//            user.getCachedWith().put(PASSWORD_CACHE_KEY, password);
//        }
//    }

    @Override
    public UserModel getUserByEmail(String email, RealmModel realm) {
        throw new RuntimeException("getUserByEmail method not implemented");
//        TypedQuery<UserEntity> query = em.createNamedQuery("getUserByEmail", UserEntity.class);
//        query.setParameter("email", email);
//        List<UserEntity> result = query.getResultList();
//        if (result.isEmpty()) return null;
//        return new UserAdapter(session, realm, model, result.get(0));
    }

//    @Override
//    public boolean updateCredential(RealmModel realm, UserModel user, CredentialInput input) {
//        if (!supportsCredentialType(input.getType()) || !(input instanceof UserCredentialModel)) return false;
//        UserCredentialModel cred = (UserCredentialModel)input;
//        UserAdapter adapter = getUserAdapter(user);
//        adapter.setPassword(cred.getValue());
//
//        return true;
//    }

//    public UserAdapter getUserAdapter(UserModel user) {
//        UserAdapter adapter = null;
//        if (user instanceof CachedUserModel) {
//            adapter = (UserAdapter)((CachedUserModel)user).getDelegateForUpdate();
//        } else {
//            adapter = (UserAdapter)user;
//        }
//        return adapter;
//    }

//    @Override
//    public void disableCredentialType(RealmModel realm, UserModel user, String credentialType) {
//        if (!supportsCredentialType(credentialType)) return;
//
//        getUserAdapter(user).setPassword(null);
//
//    }
//
//    @Override
//    public Set<String> getDisableableCredentialTypes(RealmModel realm, UserModel user) {
//        if (getUserAdapter(user).getPassword() != null) {
//            Set<String> set = new HashSet<>();
//            set.add(CredentialModel.PASSWORD);
//            return set;
//        } else {
//            return Collections.emptySet();
//        }
//    }

//    @Override
//    public boolean supportsCredentialType(String credentialType) {
//        return CredentialModel.PASSWORD.equals(credentialType);
//    }

//    @Override
//    public boolean isConfiguredFor(RealmModel realm, UserModel user, String credentialType) {
//        return supportsCredentialType(credentialType) && getPassword(user) != null;
//    }
//
//    @Override
//    public boolean isValid(RealmModel realm, UserModel user, CredentialInput input) {
//        if (!supportsCredentialType(input.getType()) || !(input instanceof UserCredentialModel)) return false;
//        UserCredentialModel cred = (UserCredentialModel) input;
//        String password = getPassword(user);
//        return password != null && password.equals(cred.getValue());
//    }

//    @Override
//    public int getUsersCount(RealmModel realm) {
//        Object count = em.createNamedQuery("getUserCount")
//                .getSingleResult();
//        return ((Number)count).intValue();
//    }

//    @Override
//    public List<UserModel> getUsers(RealmModel realm) {
//        return getUsers(realm, -1, -1);
//    }

//    @Override
//    public List<UserModel> getUsers(RealmModel realm, int firstResult, int maxResults) {

//    public String getPassword(UserModel user) {
//        String password = null;
//        if (user instanceof CachedUserModel) {
//            password = (String) ((CachedUserModel) user).getCachedWith().get(PASSWORD_CACHE_KEY);
//        } else if (user instanceof UserAdapter) {
//            password = ((UserAdapter) user).getPassword();
//        }
//        return password;
//    }

//    @Override
//    public List<UserModel> searchForUser(String search, RealmModel realm) {
//        return searchForUser(search, realm, -1, -1);
//    }

//    @Override
//    public List<UserModel> searchForUser(String search, RealmModel realm, int firstResult, int maxResults) {
//        TypedQuery<UserEntity> query = em.createNamedQuery("searchForUser", UserEntity.class);
//        query.setParameter("search", "%" + search.toLowerCase() + "%");
//        if (firstResult != -1) {
//            query.setFirstResult(firstResult);
//        }
//        if (maxResults != -1) {
//            query.setMaxResults(maxResults);
//        }
//        List<UserEntity> results = query.getResultList();
//        List<UserModel> users = new LinkedList<>();
//        for (UserEntity entity : results) users.add(new UserAdapter(session, realm, model, entity));
//        return users;
//    }

//    @Override
//    public List<UserModel> searchForUser(Map<String, String> params, RealmModel realm) {
//        return Collections.EMPTY_LIST;
//    }
//
//    @Override
//    public List<UserModel> searchForUser(Map<String, String> params, RealmModel realm, int firstResult, int maxResults) {
//        return Collections.EMPTY_LIST;
//    }
//
//    @Override
//    public List<UserModel> getGroupMembers(RealmModel realm, GroupModel group, int firstResult, int maxResults) {
//        return Collections.EMPTY_LIST;
//    }
//
//    @Override
//    public List<UserModel> getGroupMembers(RealmModel realm, GroupModel group) {
//        return Collections.EMPTY_LIST;
//    }
//
//    @Override
//    public List<UserModel> searchForUserByUserAttribute(String attrName, String attrValue, RealmModel realm) {
//        return Collections.EMPTY_LIST;
//    }
}
