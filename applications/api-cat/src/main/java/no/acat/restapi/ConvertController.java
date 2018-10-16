package no.acat.restapi;

import com.google.common.base.Strings;
import io.swagger.v3.oas.models.OpenAPI;
import lombok.AllArgsConstructor;
import no.acat.spec.ParseException;
import no.acat.spec.Parser;
import no.dcat.client.apicat.ConvertRequest;
import no.dcat.client.apicat.ConvertResponse;
import no.dcat.webutils.exceptions.BadRequestException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@AllArgsConstructor
public class ConvertController {
    private static final Logger logger = LoggerFactory.getLogger(ConvertController.class);

    @RequestMapping("/convert")
    @PostMapping(produces = "application/json")
    public ConvertResponse convert(@RequestBody ConvertRequest request) throws BadRequestException {
        ConvertResponse responseBody = new ConvertResponse();
        List<String> messages = new ArrayList();
        String spec = request.getSpec();
        String url = request.getUrl();
        logger.debug("Starting convert spec:{}, url:{}", spec, url);

        if (Strings.isNullOrEmpty(spec) && Strings.isNullOrEmpty(url)) {
            throw new BadRequestException("Url or spec parameter is required");
        }

        if (Strings.isNullOrEmpty(spec) && !Strings.isNullOrEmpty(url)) {
            try {
                spec = Parser.getSpecFromUrl(url);
            } catch (Exception e) {
                throw new BadRequestException("Error downloading spec: " + e.getMessage());
            }
        }

        try {
            OpenAPI openAPI = Parser.parse(spec);
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
