package no.dcat.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Organization {
    @JsonProperty("organizationId")
    private String organizationId;
    @JsonProperty("name")
    private String name;
    @JsonProperty("allowDelegatedRegistration")
    private Boolean allowDelegatedRegistration;
}
