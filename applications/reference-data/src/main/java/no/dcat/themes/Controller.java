package no.dcat.themes;

import no.dcat.shared.DataTheme;
import no.dcat.shared.HelpText;
import no.dcat.shared.LocationUri;
import no.dcat.shared.SkosCode;
import no.dcat.shared.Subject;
import no.dcat.shared.Types;
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
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

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
    @RequestMapping(value = "/helptexts", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public List<HelpText> helpTexts() {

        return helpTextService.getHelpTexts();

    }

    @CrossOrigin
    @RequestMapping(value = "/helptexts/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    @ExceptionHandler(NotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public HelpText helpTexts(@PathVariable(name = "id") String id) {

        return helpTextService.getHelpTexts(id);

    }

    @PreAuthorize("hasAuthority('INTERNAL_CALL')")
    @CrossOrigin
    @RequestMapping(value = "/locations", consumes = MediaType.APPLICATION_JSON_UTF8_VALUE, method = RequestMethod.POST)
    public SkosCode putLocation(@RequestBody LocationUri resource) throws MalformedURLException {
        logger.info("register new location: {}", resource.getUri());
        try {
            return codesService.addLocation(resource.getUri());
        }catch (Exception e){
            logger.error("Unable to find location with URI <{}>. Reason {}",resource.getUri(), e.getMessage());
            throw e;
        }
    }

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
