package no.fdk.registration.common;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiRegistrationPublic extends ApiRegistrationEditableProperties {

    private String id;

    @ApiModelProperty("Catalog id is equal to orgNr")
    private String catalogId;
}
