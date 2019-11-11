package no.fdk.altinn;

import java.util.List;

public class Person {
    List<Organization> organizations;
    private Subject subject;

    Person(Subject subject, List<Organization> organizations) {
        this.subject = subject;
        this.organizations = organizations;
    }

    public String getName() {
        return subject.name;
    }

    public String getSocialSecurityNumber() {
        return subject.socialSecurityNumber;
    }

    public List<Organization> getOrganizations() {
        return organizations;
    }
}
