package no.ccat.config;

import no.fdk.webutils.exceptions.GlobalControllerExceptionHandler;
import org.springframework.web.bind.annotation.ControllerAdvice;

@ControllerAdvice
public class ControllerExceptionHandler extends GlobalControllerExceptionHandler {
}
