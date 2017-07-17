package no.dcat.themes;

import no.dcat.themes.builders.DataTheme;
import no.dcat.themes.builders.SkosCode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class Controller {

    @Autowired
    private CodesService codesService;

    @Autowired
    private ThemesService themesService;

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


}
