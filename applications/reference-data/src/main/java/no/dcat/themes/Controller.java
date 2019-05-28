package no.dcat.themes;

import no.dcat.shared.DataTheme;
import no.dcat.shared.HelpText;
import no.dcat.shared.LocationUri;
import no.dcat.shared.SkosCode;
import no.dcat.shared.Subject;
import no.dcat.shared.Types;
import no.dcat.themes.service.*;
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
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;

@RestController
@Scope("thread")
public class Controller {

    @Autowired
    private CodesService codesService;

    @Autowired
    private ThemesService themesService;

    @Autowired
    private SubjectsService subjectsService;

    @Autowired
    private LOSService losService;

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
    @RequestMapping(value = "/los", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public List<LosNode> losFullSearch()  {
        return losService.getAll();
    }

    @CrossOrigin
    @RequestMapping(value = "/loscodesbyid", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public LosNode getLosNode( String id)  {
        try {
            URI u = new URI(id);
            return losService.getByURI(u);
        } catch (URISyntaxException use) {
            logger.debug("Request for LOS by URI failed. URI "+ id);
        }
        return null;
    }

    @CrossOrigin
    @RequestMapping(value = "/loscodes/hasLosTheme", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public Boolean hasLosTheme( String[] themes )  {
        if (themes == null || themes.length ==0) {
            return false;
        }
        List<String> themesList = new ArrayList<>();
        for (String str : themes) {
            themesList.add(str);
        }
        return losService.hasLosThemes(themesList);
    }

    @CrossOrigin
    @RequestMapping(value = "/loscodes/expandLosTheme", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public String[] expandLosThemes( String[] themes) {
        if (themes == null || themes.length ==0) {
            return null;
        }
        List<String> themesList = new ArrayList<>();
        for (String str : themes) {
            themesList.add(str);
        }
        List<String> expanded = losService.expandLosThemes(themesList);
        String [] returnValues = expanded.toArray(new String[0]);
        return returnValues;
    }
    @CrossOrigin
    @RequestMapping(value = "/loscodes/expandLosThemeByPaths", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public String[] expandLosThemesByPaths( String[] themes) {
        if (themes == null || themes.length ==0) {
            return null;
        }
        List<String> themesList = new ArrayList<>();
        for (String str : themes) {
            themesList.add(str);
        }
        List<String> expanded = losService.expandLosThemesByPaths(themesList);
        String [] returnValues = expanded.toArray(new String[0]);
        return returnValues;
    }

    @CrossOrigin
    @RequestMapping(value = "/themes", produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public List<DataTheme> themes() {
        return themesService.getThemes();
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
