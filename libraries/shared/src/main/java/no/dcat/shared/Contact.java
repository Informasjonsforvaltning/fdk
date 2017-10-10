package no.dcat.shared;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.ToString;

/**
 * Created by bjg on 24.02.2017.
 */
@Data
@ToString(includeFieldNames = false)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Contact {

    private String id;


    private String uri;


    private String fullname;


    private String email;


    private String organizationName;


    private String organizationUnit;


    private String hasURL;


    private String hasTelephone;
}
