package no.fdk.altinn;

public class Person {
    private Subject subject;

    Person(Subject subject) {
        this.subject = subject;
    }

    public String getName() {
        return subject.name;
    }

    public String getSocialSecurityNumber() {
        return subject.socialSecurityNumber;
    }
}
