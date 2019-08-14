package no.fdk.userapi;

import no.fdk.altinn.Person;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;


public class UserAltinnAdapter implements User {
    private Person person;

    UserAltinnAdapter(Person person) {
        this.person = person;
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

    public String getPrivileges() {
        // todo filter orgform or whitelist organisationnumber
        //  includedOrgforms: ADOS,FKF,FYLK,IKS,KF,KIRK,KOMM,ORGL,SF,STAT,SÆR
        //  includedOrgnr: 974760673
        List<String> privilegesList = person.getOrganisations().stream()
            .map(o -> "publisher:" + o.getOrganisationNumber() + ":admin").collect(Collectors.toList());
        return String.join(" ", privilegesList);
    }
}
