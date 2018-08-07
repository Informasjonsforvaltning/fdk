package no.acat.model;


import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiDocument {
    String uri;
    String openapi;
    ApiInfo info;
    List<Server> servers;
    Paths paths;
}
