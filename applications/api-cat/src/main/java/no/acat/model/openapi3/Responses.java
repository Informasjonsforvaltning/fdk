package no.acat.model.openapi3;

import com.fasterxml.jackson.annotation.JsonAnyGetter;
import com.fasterxml.jackson.annotation.JsonAnySetter;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.util.HashMap;
import java.util.Map;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Responses {

    Map<String, Response> responseCodes;

    @JsonAnyGetter
    public Map<String, Response> getResponseCodes() {
        return responseCodes;
    }

    @JsonAnySetter
    public void setResponseCode(String code, Response response) {
        if (responseCodes == null) {
            responseCodes = new HashMap<>();
        }
        responseCodes.put(code, response);
    }
}
