package no.fdk.acat.common.model.apispecification.info;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Info {
    private String title;
    private String description;
    private String termsOfService;
    private Contact contact;
    private License license;
    private String version;
}

