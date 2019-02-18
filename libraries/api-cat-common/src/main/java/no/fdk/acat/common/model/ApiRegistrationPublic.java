package no.fdk.acat.common.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.ToString;
import no.fdk.acat.common.model.apispecification.ApiSpecification;


@Data
@ToString(includeFieldNames = false)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiRegistrationPublic extends ApiEditableProperties{

    private String id;

    @ApiModelProperty("Catalog id is equal to orgNr")
    private String catalogId;

    @ApiModelProperty("The url of the specification which are used to harvest the specification ")
    private String apiSpecUrl;

    @ApiModelProperty("Original API spec")
    private String apiSpec;

    private ApiSpecification apiSpecification;
}
