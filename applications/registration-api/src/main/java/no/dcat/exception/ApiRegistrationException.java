package no.dcat.exception;

public class ApiRegistrationException extends Exception {
	private static final long serialVersionUID = 1L;
	private String errorMessage;

	public String getErrorMessage() {
		return errorMessage;
	}
	public ApiRegistrationException(String errorMessage) {
		super(errorMessage);
		this.errorMessage = errorMessage;
	}
	public ApiRegistrationException() {
		super();
	}
}