package no.acat.restapi;

import com.google.common.base.Strings;
import io.swagger.v3.oas.models.OpenAPI;
import lombok.AllArgsConstructor;
import no.acat.spec.ParseException;
import no.acat.spec.Parser;
import no.dcat.client.apicat.ConvertRequest;
import no.dcat.client.apicat.ConvertResponse;
import no.dcat.webutils.exceptions.BadRequestException;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@AllArgsConstructor
public class ConvertController {
    @RequestMapping("/convert")
    @PostMapping(produces = "application/json")
    public ConvertResponse convert(@RequestBody ConvertRequest request) throws BadRequestException {
        ConvertResponse responseBody = new ConvertResponse();
        List<String> messages = new ArrayList();
        String spec = request.getSpec();
        String url = request.getUrl();

        if (Strings.isNullOrEmpty(spec) && Strings.isNullOrEmpty(spec)) {
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