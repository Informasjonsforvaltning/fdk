package no.acat.controller.dsop;

import com.google.gson.Gson;
import io.swagger.annotations.ApiModelProperty;
import lombok.Builder;
import lombok.Data;
import no.acat.model.ApiDocument;
import no.dcat.shared.Publisher;
import no.fdk.acat.common.model.apispecification.ApiSpecification;
import no.fdk.acat.common.model.apispecification.servers.Server;
import org.elasticsearch.search.SearchHit;

import java.util.Date;
import java.util.Optional;

@Data
@Builder
public class Endpoint {
    static final String[] SOURCE_FIELDS = {"id", "publisher.id", "serviceType", "apiSpecification.servers.url", "deprecationInfoExpirationDate"};
    @ApiModelProperty("url to the the api-description in API-catalogue")
    String apiRef;

    @ApiModelProperty("The organization number to the publisher of the API")
    String orgNo;

    @ApiModelProperty("The standard (\"type of service\") the API conforms to")
    String serviceType;

    @ApiModelProperty("The Server Object url of the API")
    String url;

    // TODO expected in DSOP, but not implemented in api document.
//    @ApiModelProperty("The date-time from which the endpoint is active")
//    Date activationDate

    @ApiModelProperty("The date-time to which the endpoint is active")
    Date expirationDate;

    @ApiModelProperty("Transport method")
    String transportProfile;

    static Endpoint fromElasticHit(SearchHit hit) {
        ApiDocument apiDocument = new Gson().fromJson(hit.getSourceAsString(), ApiDocument.class);

        String orgNo = Optional.ofNullable(apiDocument.getPublisher()).map(Publisher::getId).orElse(null);
        String serverUrl = Optional.ofNullable(apiDocument.getApiSpecification())
            .map(ApiSpecification::getServers)
            .map(servers -> servers.get(0))
            .map(Server::getUrl)
            .orElse(null);

        return Endpoint.builder()
            .apiRef("https://fellesdatakatalog.brreg.no/apis/" + apiDocument.getId())
            .orgNo(orgNo)
            .serviceType(apiDocument.getServiceType())
            .url(serverUrl)
            .expirationDate(apiDocument.getDeprecationInfoExpirationDate())
            .transportProfile("eOppslag")
            .build();
    }


}
