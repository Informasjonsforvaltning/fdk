package no.ccat.common.model;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.util.Date;
import java.util.Map;

@Data
public class Definition {
    private Map<String, String> text;
    private Map<String, String> remark;

    private Source source;
    private String targetGroup; // TODO this is string-enum

    @ApiModelProperty("The range [skosno:Omfang]")
    private TextAndURI range;

    private Date lastUpdated;
}
