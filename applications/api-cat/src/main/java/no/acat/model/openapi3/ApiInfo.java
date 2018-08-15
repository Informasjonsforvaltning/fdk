package no.acat.model.openapi3;

import lombok.Data;

@Data
public class ApiInfo {
    String description;
    String version;
    String title;
    String termsOfService;
    Contact contact;
    License license;
}
