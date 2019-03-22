package no.fdk.acat.common.model.apispecification.servers;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Server {
    private String url = null;
    private String description = null;
}
