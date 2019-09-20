package no.fdk.userapi;

import no.fdk.altinn.Organisation;
import no.fdk.altinn.Person;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.function.Predicate;
import java.util.stream.Collectors;

@Service
public class AltinnUserConverter {

    private List<String> INCLUDED_ORGNR = Arrays.asList(
        "920210023"     /* this matches in prod system "GJELDSREGISTERET AS”*/
        , "910258028"   /* this matches in mock data "LILAND OG ERDAL REVISJON", used in dev, ut1, st1 and it1*/
    );
    private List<String> INCLUDED_ORGFORM = Arrays.asList("ADOS", "FKF", "FYLK", "IKS", "KF", "KIRK", "KOMM", "ORGL", "SF", "STAT", "SÆR");
    private Predicate<Organisation> organisationPrivilegeFilter = (o) -> INCLUDED_ORGNR.contains(o.getOrganisationNumber()) || INCLUDED_ORGFORM.contains(o.getOrganisationForm());

    User convert(Person person) {
        return new AltinnUserConverter.AltinnUserAdapter(person);
    }

    private class AltinnUserAdapter implements User {
        private Person person;

        AltinnUserAdapter(Person person) {
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

        public String getAuthorities() {
            List<String> privilegesList = person.getOrganisations().stream()
                .filter(organisationPrivilegeFilter)
                .map(o -> "publisher:" + o.getOrganisationNumber() + ":admin").collect(Collectors.toList());
            return String.join(",", privilegesList);
        }
    }
}
