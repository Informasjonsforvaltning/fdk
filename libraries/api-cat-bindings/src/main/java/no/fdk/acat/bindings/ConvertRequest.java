package no.fdk.acat.bindings;


import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class ConvertRequest {

    String url;

    String spec;
}
