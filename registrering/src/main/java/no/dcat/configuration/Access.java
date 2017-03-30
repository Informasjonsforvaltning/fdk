package no.dcat.configuration;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class Access {


    private String username;
    private String password;
    private String orgnr;
}
