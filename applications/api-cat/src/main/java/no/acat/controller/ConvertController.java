package no.acat.controller;

import com.google.common.base.Strings;
import no.fdk.webutils.exceptions.BadRequestException;
import no.fdk.acat.bindings.ConvertRequest;
import no.fdk.acat.bindings.ConvertResponse;
import no.fdk.acat.common.model.apispecification.ApiSpecification;
import no.fdk.acat.converters.apispecificationparser.UniversalParser;
import org.apache.commons.io.IOUtils;
import org.springframework.web.bind.annotation.*;

import java.net.URL;
import java.util.ArrayList;
import java.util.List;

import static java.nio.charset.StandardCharsets.UTF_8;

@CrossOrigin
@RestController
@RequestMapping(value = "/apis")
public class ConvertController {

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
                spec = IOUtils.toString(new URL(url).openStream(), UTF_8);
            } catch (Exception e) {
                throw new BadRequestException("Error downloading spec: " + e.getMessage());
            }
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
