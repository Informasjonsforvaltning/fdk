package no.dcat.shared.admin;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.hibernate.validator.constraints.NotEmpty;
import org.hibernate.validator.constraints.URL;

public class DcatSourceDto {

    private final String id;

    @NotEmpty
    private final String description;

    @URL
    @NotEmpty
    private final String url;

    @NotEmpty
    private final String user;

    private final String orgnumber;

    @JsonCreator
    public DcatSourceDto(
            @JsonProperty("id") String id,
            @JsonProperty("description") String description,
            @JsonProperty("url)") String url,
            @JsonProperty("user") String user,
            @JsonProperty("orgnumber") String orgnumber) {
        this.id = id;
        this.description = description;
        this.url = url;
        this.user = user;
        this.orgnumber = orgnumber;
    }

    public String getId() {
        return id;
    }

    public String getDescription() {
        return description;
    }

    public String getUrl() {
        return url;
    }

    public String getUser() {
        return user;
    }

    public String getOrgnumber() {
        return orgnumber;
    }
}
