package no.dcat.datastore;

/**
 * Created by havardottestad on 06/01/16.
 */
public class UserAlreadyExistsException extends Exception {
	/**
	 * 
	 */
	private static final long serialVersionUID = 50816983706152072L;

	public UserAlreadyExistsException(String username) {
		super(username);

	}
}
