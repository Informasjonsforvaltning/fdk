package no.dcat.configuration;

import lombok.Builder;
import lombok.Value;

/**
 * Created by bjg on 20.06.2017.
 */
@Value
@Builder
public class Access {

    private String username;
    private String password;
    private String orgnr;

}
