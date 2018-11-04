package no.acat.restapi;

import com.google.common.base.Strings;
import no.acat.service.ParserService;
import no.acat.spec.ParseException;
import no.dcat.client.apicat.ConvertRequest;
import no.dcat.client.apicat.ConvertResponse;
import no.dcat.openapi.OpenAPI;
import no.dcat.webutils.exceptions.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@CrossOrigin
@RestController
public class ConvertController {
    private ParserService parserService;

    @Autowired
    public ConvertController(ParserService parserService) {
        this.parserService = parserService;
    }

    @RequestMapping("/convert")
    @PostMapping(produces = "application/json")
    public ConvertResponse convert(@RequestBody ConvertRequest request) throws BadRequestException {
        ConvertResponse responseBody = new ConvertResponse();
        List<String> messages = new ArrayList();
        String spec = request.getSpec();
        String url = request.getUrl();

        if (Strings.isNullOrEmpty(spec) && Strings.isNullOrEmpty(url)) {
            throw new BadRequestException("Url or spec parameter is required");
        }

        if (Strings.isNullOrEmpty(spec) && !Strings.isNullOrEmpty(url)) {
            try {
                spec = ParserService.getSpecFromUrl(url);
            } catch (Exception e) {
                throw new BadRequestException("Error downloading spec: " + e.getMessage());
            }
        }

        try {
            OpenAPI openAPI = parserService.parse(spec);
            responseBody.setOpenApi(openAPI);
        } catch (ParseException e) {
            messages.add(e.getMessage());
        }

        if (messages.size() > 0) {
            responseBody.setMessages(messages);
        }

        return responseBody;
    }

}
