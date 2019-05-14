package no.fdk.userapi;

import com.fasterxml.jackson.annotation.JsonProperty;
import no.fdk.altinn.Organisation;
import no.fdk.altinn.Person;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;


//todo, this is actually an adapter. Declare JsonProperty on abstract class instead
public class User {
    List<Organisation> organisations;
    private Person person;

    User(Person person, List<Organisation> organisations) {
        this.person = person;
        this.organisations = organisations;
    }

    public String getId() {
        return person.getSocialSecurityNumber();
    }

    private List<String> getNames() {
        return Arrays.asList(person.getName().split("\\s+"));
    }

    public String getFirstName() {
        List<String> firstNamesList = getNames().subList(0, (getNames().size() - 1));
        return String.join(" ", firstNamesList);
    }

    public String getLastName() {
        return getNames().get(getNames().size() - 1);
    }

    @JsonProperty("fdk_access")
    public String getPrivileges() {
        List<String> privilegesList = organisations.stream().map(o -> "publisher:" + o.getOrganisationNumber() + ":admin").collect(Collectors.toList());
        return String.join(" ", privilegesList);
    }
}
