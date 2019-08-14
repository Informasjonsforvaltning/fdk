package no.fdk.userapi;

import com.fasterxml.jackson.annotation.JsonProperty;

interface User {
    String getId();

    String getFirstName();

    String getLastName();

    @JsonProperty("fdk_access")
    String getPrivileges();
}
