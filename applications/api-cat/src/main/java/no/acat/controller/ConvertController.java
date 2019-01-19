package no.acat.controller;

import com.google.common.base.Strings;
import io.swagger.v3.oas.models.OpenAPI;
import no.acat.service.ParserService;
import no.acat.spec.ParseException;
import no.dcat.webutils.exceptions.BadRequestException;
import no.fdk.acat.bindings.ConvertRequest;
import no.fdk.acat.bindings.ConvertResponse;
import no.fdk.acat.common.model.apispecification.ApiSpecification;
import no.fdk.acat.converters.apispecificationparser.UniversalParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping(value = "/apis")
public class ConvertController {
    private ParserService parserService;

    @Autowired
    public ConvertController(ParserService parserService) {
        this.parserService = parserService;
    }

    @RequestMapping(value = "/convert", method = RequestMethod.POST, produces = "application/json")
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

        try {
            ApiSpecification apiSpecification = new UniversalParser().parse(spec);
            responseBody.setApiSpecification(apiSpecification);
        } catch (no.fdk.acat.converters.apispecificationparser.ParseException e) {
            messages.add(e.getMessage());
        }

        if (messages.size() > 0) {
            responseBody.setMessages(messages);
        }

        return responseBody;
    }

}
