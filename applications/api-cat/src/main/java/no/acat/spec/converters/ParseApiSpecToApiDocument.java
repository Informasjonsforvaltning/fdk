package no.acat.spec.converters;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.v3.oas.models.OpenAPI;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import no.acat.config.Utils;
import no.acat.model.ApiDocument;
import no.acat.model.ApiSource;
import no.dcat.shared.Contact;
import org.apache.commons.io.Charsets;
import org.apache.commons.io.IOUtils;
import org.springframework.stereotype.Component;
import java.io.IOException;
import java.net.URL;
import java.util.*;

@Component
@Slf4j
@AllArgsConstructor
public class ParseApiSpecToApiDocument {

    private static final ObjectMapper objectMapper = Utils.jsonMapper();


    public ApiDocument parseApiSpec(ApiSource apiSource){
        String apiSpec = null;
        OpenAPI openAPI = null;
        if(apiSource.getUrl()== null || apiSource.getUrl().isEmpty()){
            apiSpec = apiSource.getData();
            try{
                OpenAPI test = objectMapper.readValue(apiSource.getData(), OpenAPI.class);
            } catch (IOException e){
                throw new IllegalArgumentException("Error in data spec: {}" + e.getMessage());
            }

        } else if (apiSource.getUrl().startsWith("http") && !apiSource.getUrl().isEmpty()) {
            try {
                apiSpec = getApiSpecFromUrl(apiSource);
            } catch (IOException e) {
                throw new IllegalArgumentException("Error downloading api spec from url: " + e.getMessage());
            }
        } else {
            throw new IllegalArgumentException("Url is not starting with http are null. " );
        }

        if(OpenApiV3JsonSpecConverter.canConvert(apiSpec)){
            openAPI = OpenApiV3JsonSpecConverter.convert(apiSpec);
        } else if (SwaggerJsonSpecConverter.canConvert(apiSpec)){
            openAPI = SwaggerJsonSpecConverter.convert(apiSpec);
        }
        try {
             String parsedjson = objectMapper.writeValueAsString(openAPI);
        } catch (IOException e) {
            throw new IllegalArgumentException("Error verifying OpenAPI deserialization for: " + e.getMessage());
        }
        return createApiDocument(apiSource.getUrl(),openAPI);
    }

    public static String getApiSpecFromUrl(ApiSource apiSource) throws IOException {
        return IOUtils.toString(new URL(apiSource.getUrl()).openStream(), Charsets.UTF_8);
    }

    private ApiDocument createApiDocument(String url, OpenAPI openAPI){
        Map<String,String> title = new HashMap<>();
        Map<String,String> description = new HashMap<>();
        title.put("no",openAPI.getInfo().getTitle());
        description.put("no",openAPI.getInfo().getDescription());
        Set<String> formats = new HashSet<>();
        return ApiDocument.builder().apiSpecUrl(url).title(title).contactPoint(Arrays.asList(getContact(openAPI))).description(description).build();
    }

    private Contact getContact(OpenAPI openAPI){
        Contact contact = new Contact();
        if(openAPI.getInfo().getContact()!= null){
            if(openAPI.getInfo().getContact().getEmail()!= null ) {
                contact.setEmail(openAPI.getInfo().getContact().getEmail());
            }
            if(openAPI.getInfo().getContact().getName()!= null ) {
                contact.setOrganizationName(openAPI.getInfo().getContact().getName());
            }
            if(openAPI.getInfo().getContact().getUrl()!= null ) {
                contact.setUri(openAPI.getInfo().getContact().getUrl());
            }
        }
        return contact;
    }

}
