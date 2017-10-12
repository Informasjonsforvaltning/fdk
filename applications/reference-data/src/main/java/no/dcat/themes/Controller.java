package no.dcat.themes;

import no.dcat.shared.*;
import no.dcat.themes.service.CodesService;
import no.dcat.themes.service.HelpTextService;
import no.dcat.themes.service.SubjectsService;
import no.dcat.themes.service.ThemesService;
import org.apache.jena.shared.NotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.MalformedURLException;
import java.util.List;

@RestController
@Scope("thread")

public class Controller {

    @Autowired
    private CodesService codesService;

    @Autowired
    private HelpTextService helpTextService;

    @Autowired
    private ThemesService themesService;

    @Autowired
    private SubjectsService subjectsService;

    static private final Logger logger = LoggerFactory.getLogger(Controller.class);


    @CrossOrigin
    @RequestMapping(value = "/codes", produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public List<String> codeTypes() {

        return codesService.listCodes();

    }


    @CrossOrigin
    @RequestMapping(value = "/codes/{type}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public List<SkosCode> codes(@PathVariable(name = "type") String type) {

        return codesService.getCodes(Types.valueOf(type));

    }


    @CrossOrigin
    @RequestMapping(value = "/themes", produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public List<DataTheme> themes() {

        return themesService.getThemes();

    }

    @CrossOrigin
    @RequestMapping(value = "/helptexts/", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public List<HelpText> helpTexts() {

        return helpTextService.getHelpTexts();

    }

    @CrossOrigin
    @RequestMapping(value = "/helptexts/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    @ExceptionHandler(NotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public List<HelpText> helpTexts(@PathVariable(name = "id") String id) {

        return helpTextService.getHelpTexts(id);

    }

    @PreAuthorize("hasAuthority('INTERNAL_CALL')")
    @CrossOrigin
    @RequestMapping(value = "/locations", consumes = MediaType.APPLICATION_JSON_UTF8_VALUE, method = RequestMethod.POST)
    public SkosCode putLocation(@RequestBody LocationUri resource) throws MalformedURLException {
        logger.debug(resource.getUri());
        try {

            return codesService.addLocation(resource.getUri());
        }catch (Exception e){
            logger.error("URI was: "+resource.getUri());
            throw e;
        }
    }

    @PreAuthorize("hasAuthority('INTERNAL_CALL')")
    @CrossOrigin
    @RequestMapping(value = "/subjects",  method = RequestMethod.GET)
    public Subject getRemoteResourceForSubject(@RequestParam String uri) throws MalformedURLException {
        logger.debug(uri);
        try {
            return subjectsService.addSubject(uri);
        }catch (Exception e){
            logger.error("URI was: "+uri);
            throw e;
        }
    }


}
