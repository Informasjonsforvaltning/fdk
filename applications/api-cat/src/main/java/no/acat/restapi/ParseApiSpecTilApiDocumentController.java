package no.acat.restapi;


import lombok.AllArgsConstructor;
import no.acat.model.ApiDocument;
import no.acat.model.ApiSource;
import no.acat.spec.converters.ParseApiSpecToApiDocument;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/apiparser")
@AllArgsConstructor
public class ParseApiSpecTilApiDocumentController {

    private ParseApiSpecToApiDocument parseApiSpecToApiDocument;

    @PostMapping( produces = "application/json")
    public ApiDocument parseApiSpec(@RequestBody ApiSource apiSource) {
        return parseApiSpecToApiDocument.parseApiSpec(apiSource);
    }


}
