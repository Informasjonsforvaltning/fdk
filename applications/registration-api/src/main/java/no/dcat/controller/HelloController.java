package no.dcat.controller;

import com.github.ulisesbocchio.spring.boot.security.saml.user.SAMLUserDetails;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class HelloController {

    @RequestMapping("/home")
    String home(Model model) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        SAMLUserDetails userDetails = (SAMLUserDetails) authentication.getPrincipal();
        model.addAttribute("itworks", "YES");
        model.addAttribute("fnr", userDetails.getAttribute("uid"));
        model.addAttribute("SecurityLevel", userDetails.getAttribute("SecurityLevel"));
        model.addAttribute("Culture", userDetails.getAttribute("Culture"));
        model.addAttribute("OnBehalfOf", userDetails.getAttribute("OnBehalfOf"));
        model.addAttribute("epostadresse", userDetails.getAttribute("epostadresse"));
        model.addAttribute("mobiltelefonnummer", userDetails.getAttribute("mobiltelefonnummer"));
        model.addAttribute("reservasjon", userDetails.getAttribute("reservasjon"));
        model.addAttribute("status", userDetails.getAttribute("status"));

        return "home";
    }

    @RequestMapping("/loggetut")
    String loggetut(Model model) {

        return "loggetut";
    }
}
