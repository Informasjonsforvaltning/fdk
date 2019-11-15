package no.fdk.altinn;

public class Organization {
    private Subject subject;

    Organization(Subject subject) {
        this.subject = subject;
    }

    public String getName() {
        return subject.name;
    }

    public String getOrganizationForm() {
        return subject.organizationForm;
    }
    public String getOrganizationNumber() {
        return subject.organizationNumber;
    }
}
