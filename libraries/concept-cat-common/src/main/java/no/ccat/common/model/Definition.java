package no.ccat.common.model;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.util.Date;
import java.util.List;
import java.util.Map;

@Data
public class Definition {
    private Map<String, String> text;
    private Map<String, String> remark;

    private Source source;
    private String targetGroup; // TODO this is string-enum

    @ApiModelProperty("The source Relationship [skosno:forholdTilKilde]")
    private String sourceRelationship;

    @ApiModelProperty("The range [skosno:Omfang]")
    private TextAndURI range;

    @ApiModelProperty("The sources [dct:source] containing [rdfs:label] / [rdfs:seeAlso] pairs  ")
    private List<TextAndURI> sources;

    private Date lastUpdated;
}
