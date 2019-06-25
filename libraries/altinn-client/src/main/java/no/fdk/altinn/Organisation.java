package no.fdk.altinn;

public class Organisation {
    private Subject subject;

    Organisation(Subject subject) {
        this.subject = subject;
    }

    public String getName() {
        return subject.name;
    }

    public String getOrganisationForm() {
        return subject.organisationForm;
    }
    public String getOrganisationNumber() {
        return subject.organisationNumber;
    }
}
