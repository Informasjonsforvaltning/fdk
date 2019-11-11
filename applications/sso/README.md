When there is no client registered for sso, the configuration can be tested with the account page as client:

xxxx/auth/realms/fdk/account
f.eks: 
https://sso.ut1.fellesdatakatalog.brreg.no/auth/realms/fdk/account/

Here you can use the 4 test users
Michelle Westlie  = username mw  and password mw  and so on

Admin permissinos to test Additional info regarding permissions
https://sso.ut1.fellesdatakatalog.brreg.no

Select admin console 
Select realm = fdk
Select sessions
select client account
show sessions
select a session
open attributes
verify fdk _access values

# Themes - Developing on host with docker volume

1) Copy the fdk theme folder from container:
Get the sso container id (docker ps), then go to the themes folder and run:
docker cp <CONTAINERID>:/opt/jboss/keycloak/themes/fdk ./fdk

2) Uncomment this line in fdk/docker-compose.override.yml:
- ../fdk/applications/sso/themes/fdk:/opt/jboss/keycloak/themes/fdk

Now you can change theme files in ./themes/fdk and see the changes in keycloak. (NB: Shift+Ctrl+R for reloading cached css).