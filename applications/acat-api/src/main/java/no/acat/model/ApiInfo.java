package no.acat.model;

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
