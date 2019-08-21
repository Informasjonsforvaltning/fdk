package no.dcat.authorization;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

/**
 * Created by dask on 16.06.2017.
 */
@Data
public class Entity {
    @JsonProperty("Name")
    private String name;

    @JsonProperty("Type")
    private String type;

    @JsonProperty("OrganizationNumber")
    private String organizationNumber;

    @JsonProperty("SocialSecurityNumber")
    private String socialSecurityNumber;

    @JsonProperty("Status")
    private String status;
}

