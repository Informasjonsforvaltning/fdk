package no.dcat.model;

import lombok.Data;
import lombok.ToString;
import org.springframework.data.elasticsearch.annotations.Field;

/**
 * Created by bjg on 24.02.2017.
 */
@Data
@ToString(includeFieldNames = false)
public class Contact {
    @Field
    private String id;

    @Field
    private String fullname;

    @Field
    private String email;

    @Field
    private String organizationName;

    @Field
    private String organizationUnit;

    @Field
    private String hasURL;
}
