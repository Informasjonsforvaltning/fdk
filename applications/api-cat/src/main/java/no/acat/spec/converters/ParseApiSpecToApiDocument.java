package no.acat.spec.converters;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.v3.oas.models.OpenAPI;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import no.acat.config.Utils;
import no.acat.model.ApiDocument;
import org.apache.commons.io.Charsets;
import org.apache.commons.io.IOUtils;
import org.springframework.stereotype.Component;
import java.io.IOException;
import java.net.URL;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@Component
@Slf4j
@AllArgsConstructor
public class ParseApiSpecToApiDocument {

    private static final ObjectMapper objectMapper = Utils.jsonMapper();


    public ApiDocument parseApiSpecFromUrl(String url, String data){
        String apiSpec = null;
        OpenAPI openAPI = null;

        try {
            OpenAPI test = objectMapper.readValue(new URL(url),OpenAPI.class);
            apiSpec = IOUtils.toString(new URL(url).openStream(), Charsets.UTF_8);
        } catch (IOException e) {
            throw new IllegalArgumentException("Error downloading api spec from url: " + url);
        }
        if(OpenApiV3JsonSpecConverter.canConvert(apiSpec)){
            openAPI = OpenApiV3JsonSpecConverter.convert(apiSpec);
        } else if (SwaggerJsonSpecConverter.canConvert(apiSpec)){
            openAPI = SwaggerJsonSpecConverter.convert(apiSpec);
        }
        try {
             String parsedjson = objectMapper.writeValueAsString(openAPI);
        } catch (IOException e) {
            e.printStackTrace();
        }

        return createApiDocumnet(url,openAPI);
    }

    private ApiDocument createApiDocumnet(String url, OpenAPI openAPI){
        Map<String,String> title = new HashMap<>();
        Map<String,String> description = new HashMap<>();
        title.put("no",openAPI.getInfo().getTitle());
        description.put("no",openAPI.getInfo().getDescription());
        Set<String> formate = new HashSet<>();
        //openAPI.getPaths()
        log.info("test \n\n\n {}  \n\n\n",openAPI.getOpenapi());
        return ApiDocument.builder().apiSpecUrl(url).title(title).description(description).build();
    }

   /* private ApiDocument createApiDocument(OpenAPI openAPI, ApiCatalogRecord apiCatalogRecord){
        ApiDocument apiDocument = new ApiDocument();
        apiDocument.setAccessRights();
        apiDocument.setAccrualPeriodicity();
        apiDocument.setApiDocUrl(apiCatalogRecord.getApiDocUrl());
        apiDocument.setApiSpecUrl(apiCatalogRecord.getApiSpecUrl());
        apiDocument.setApiSpec();
        apiDocument.setContactPoint();
        apiDocument.setDatasetReferences();
        apiDocument.setDeprecation();
        Map<String, String> apiSpecDescription = new HashMap();
        apiSpecDescription.put("En",openAPI.getInfo().getDescription());
        apiDocument.setDescription(apiSpecDescription);
        apiDocument.setFormats(openAPI.getPaths();
        apiDocument.setId();
        apiDocument.setOnline();
        apiDocument.setOpenApi(openAPI);
        apiDocument.setHarvest();
        log.info("The Parsed object in string format ================##########\n\n {}  \n \n###############========== ", parsedjson );
        log.info("orginal spec read from url and converted to string ===========#####\n\n {}  \n\n",apiSpec);
        log.info("mapped from objcet mapper ==============#############\n\n  {}   \n\n###########============", test);
        return apiDocument;
    }*/

}
