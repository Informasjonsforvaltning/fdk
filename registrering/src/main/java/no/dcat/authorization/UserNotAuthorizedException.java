package no.dcat.authorization;

/**
 * Created by bjg on 23.06.2017.
 */
public class UserNotAuthorizedException extends Exception{

    public UserNotAuthorizedException(String userId) {
        super("No authorizations found for user: " + userId);
    }

}

