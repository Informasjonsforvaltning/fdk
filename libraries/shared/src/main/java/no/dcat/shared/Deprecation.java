package no.dcat.shared;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class Deprecation {

    @ApiModelProperty("the time period of the deprecation warning")
    private PeriodOfTime period;

    @ApiModelProperty("the message to show")
    private String message;

    @ApiModelProperty("url to api-specification that replaces this one")
    private String replacedBy;
}
