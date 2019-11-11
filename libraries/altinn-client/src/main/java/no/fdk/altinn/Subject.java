package no.fdk.altinn;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class Subject {
    @JsonProperty("Name")
    public String name;
    @JsonProperty("Type")
    public String type;
    @JsonProperty("OrganizationNumber")
    public String organizationNumber;
    @JsonProperty("OrganizationForm")
    public String organizationForm;
    @JsonProperty("Status")
    public String status;
    @JsonProperty("SocialSecurityNumber")
    public String socialSecurityNumber;
}
