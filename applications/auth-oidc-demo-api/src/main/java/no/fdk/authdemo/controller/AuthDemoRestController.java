package no.fdk.authdemo.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.security.Principal;

@CrossOrigin
@RestController
@RequestMapping(value = "/demoapi")
public class AuthDemoRestController {
    private static final Logger logger = LoggerFactory.getLogger(AuthDemoRestController.class);


    @Autowired
    public AuthDemoRestController() {
    }

    @RequestMapping(value = "/protected", method = RequestMethod.GET)
    public String getProtected() {

        return "secretcontent for admin role only";
    }

    @RequestMapping(value = "/protected2/{id}", method = RequestMethod.GET)
    @PreAuthorize("hasPermission(#id, 'publisher', 'admin')")
    public String getProtected2(@PathVariable String id) {

        return "item admin content";
    }

    @CrossOrigin(origins = "*")
    @RequestMapping(value = "/sessioninfo", method = RequestMethod.GET)
    public String sessioninfo(Principal principal, HttpServletRequest request) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String response = "";

        if (null != authentication) {
            response += "authentication:" + authentication.toString();
        }
        if (null != principal) {
            response += "principal:" + principal.toString();
        }

        response += "authorities:" + authentication.getAuthorities().toString();

        return response;
    }

    @RequestMapping(value = "/open", method = RequestMethod.GET)
    public String open() {
        return "open";
    }

}
