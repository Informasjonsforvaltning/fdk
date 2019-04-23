This is an experiment to implement generic OIDC resource server, without any reference that IDP is keycloak. Permission control implemented in spring security.

There reasons for independent standard client are explained here:

Benefits Of Using Spring OAuth2 Over Keycloak Adapters:
https://medium.com/@bcarunmail/securing-rest-api-using-keycloak-and-spring-oauth2-6ddf3a1efcc2

https://github.com/bcarun/spring-oauth2-keycloak-connector/blob/master/src/main/resources/application.properties

Note that other competing alternatives to this would be.
It could be possible, that in the big registration api the generic oidc approach is best, while in in the new autonomous system, we can declare publishers as entitities and handle access rules declaratively with keycloak policy enfocement
 
1) use keycloak adapter instead of generic oidc client, but custom implement permission check

2) use keycloak policy enforcement in keycloak spring boot adapter

3) use keycloak policy enforcement in keycloak spring security adapter
