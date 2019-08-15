package no.dcat.controller;

import no.dcat.configuration.FdkSamlUserDetails;
import no.dcat.configuration.Referer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import java.net.MalformedURLException;

import static org.springframework.web.bind.annotation.RequestMethod.GET;

/**
 * Created by dask on 22.06.2017.
 */

@Controller
public class LogoutController {
    private static Logger logger = LoggerFactory.getLogger(LogoutController.class);

    @RequestMapping(value = "/logout", method = GET)
    public ModelAndView logout(Authentication auth, HttpServletRequest request) throws MalformedURLException {
        logger.debug("[LogoutController]: handling request /logout");

        if (auth.getPrincipal() instanceof FdkSamlUserDetails) {
            String referer = Referer.getReferer(request);
            logger.debug("request uri: {}", referer );

            String host = referer + "saml/logout";
            logger.debug("[LogoutController]: redirect to {}", host);
            return new ModelAndView("redirect:" + host );
        } else {
            logger.debug("[LogoutController]: forwarding to /loggetut");
            return new ModelAndView("forward:/loggetut");
        }
    }

}
