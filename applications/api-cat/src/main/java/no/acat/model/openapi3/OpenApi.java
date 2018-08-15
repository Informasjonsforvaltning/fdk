package no.acat.model.openapi3;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.util.List;

@Data
public class OpenApi {

    @ApiModelProperty("specifies the open api version of the specification")
    String openapi;

    @ApiModelProperty("the application information")
    ApiInfo info;

    @ApiModelProperty("list of servers that hosts the api")
    List<Server> servers;

    @ApiModelProperty("the access paths (operations) that the api supports")
    Paths paths;
}
