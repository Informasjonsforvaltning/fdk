package no.fdk.altinn;

import java.util.List;

public class Person {
    List<Organisation> organisations;
    private Subject subject;

    Person(Subject subject, List<Organisation> organisations) {
        this.subject = subject;
        this.organisations = organisations;
    }

    public String getName() {
        return subject.name;
    }

    public String getSocialSecurityNumber() {
        return subject.socialSecurityNumber;
    }

    public List<Organisation> getOrganisations() {
        return organisations;
    }
}
