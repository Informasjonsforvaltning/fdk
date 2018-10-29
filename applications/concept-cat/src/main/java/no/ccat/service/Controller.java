package no.ccat.service;

import no.dcat.shared.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.net.MalformedURLException;

@RestController
@Scope("thread")
public class Controller {

    @Autowired
    private SubjectsService subjectsService;

    static private final Logger logger = LoggerFactory.getLogger(Controller.class);


    @PreAuthorize("hasAuthority('INTERNAL_CALL')")
    @CrossOrigin
    @RequestMapping(value = "/subjects",  method = RequestMethod.GET)
    public Subject getRemoteResourceForSubject(@RequestParam String uri) throws MalformedURLException {
        logger.info("Request for subject with uri <{}>", uri);
        try {
            Subject subject = subjectsService.addSubject(uri);
            logger.info("Return subject: {}", subject);
            return subject;
        }catch (Exception e){
            logger.error("Unable to find subject with URI <{}>. Reason {}",uri, e.getLocalizedMessage());
            throw e;
        }
    }


}
