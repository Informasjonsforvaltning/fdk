package no.acat.restapi;


import lombok.AllArgsConstructor;
import no.acat.model.ApiDocument;
import no.acat.spec.converters.ParseApiSpecToApiDocument;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/parser/api/specifications/")
@AllArgsConstructor
public class ParseApiSpecTilApiDocumentController {

    private ParseApiSpecToApiDocument parseApiSpecToApiDocument;

    @PostMapping("/url")
    public ApiDocument parseApiSpec(@RequestBody String url, @RequestBody String data){
        return parseApiSpecToApiDocument.parseApiSpecFromUrl(url, data);
    }

}
