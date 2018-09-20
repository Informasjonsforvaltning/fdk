package no.dcat.controller;

import com.github.ulisesbocchio.spring.boot.security.saml.user.SAMLUserDetails;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class LoggetutController {

    @RequestMapping("/loggetut")
    String loggetut(Model model) {

        return "loggetut";
    }
}
