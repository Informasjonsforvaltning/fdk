package no.dcat.controller;

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
