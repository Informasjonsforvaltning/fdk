package no.dcat.model.exceptions;

/** Created by  */
public class ApispecNotFoundException extends Exception {
  private static final long serialVersionUID = 1L;

  public ApispecNotFoundException(String errorMessage) {
    super(errorMessage);
  }
}
