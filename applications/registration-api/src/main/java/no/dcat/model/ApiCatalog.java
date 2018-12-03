package no.dcat.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.annotations.ApiModelProperty;
import lombok.*;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Mapping;
import org.springframework.data.elasticsearch.annotations.Setting;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(includeFieldNames = false)
@JsonInclude(JsonInclude.Include.NON_NULL)
@Document(indexName = "reg-api-catalog", type = "apicatalog")
@Setting(settingPath = "reg-api-catalog.settings.json")
@Mapping(mappingPath = "apicatalog.mapping.json")
public class ApiCatalog {

    @ApiModelProperty("The id given by the harvest system")
    private String id;

    @ApiModelProperty("The orgno of the publisher of the API Catalog")
    private String orgNo;

    @ApiModelProperty("The source URI of the catalog of apis")
    private String harvestSourceUri;

    private Status status;

}
