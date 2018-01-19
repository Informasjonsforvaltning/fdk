package no.dcat.shared.admin;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.hibernate.validator.constraints.Email;
import org.hibernate.validator.constraints.NotEmpty;

public class UserDto {

    private final String userid;

    @NotEmpty
    private final String username;

    private final String password;

    @NotEmpty
    @Email
    private final String email;

    @NotEmpty
    private final String role;

    @JsonCreator
    public UserDto(
            @JsonProperty("userid") String userid,
            @JsonProperty("username") String username,
            @JsonProperty("password") String password,
            @JsonProperty("email") String email,
            @JsonProperty("role") String role) {
        this.userid = userid;
        this.username = username;
        this.password = password;
        this.email = email;
        this.role = role;
    }

    public String getId() {
        return userid;
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }
}
