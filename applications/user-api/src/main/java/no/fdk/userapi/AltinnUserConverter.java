package no.fdk.userapi;

import no.fdk.altinn.Organisation;
import no.fdk.altinn.Person;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.function.Predicate;
import java.util.stream.Collectors;

@Service
public class AltinnUserConverter {
    private String orgNrWhitelistString;
    private String orgFormWhitelistString;
    @Value("${application.adminList}")
    private String adminListString;

    private Predicate<Organisation> organisationFilter = (o) -> getOrgNrWhitelist().contains(o.getOrganisationNumber()) || getOrgFormWhitelist().contains(o.getOrganisationForm());

    AltinnUserConverter(@Value("${application.orgNrWhitelist}") String orgNrWhitelistString,
                        @Value("${application.orgFormWhitelist}") String orgFormWhitelistString,
                        @Value("${application.adminList}") String adminListString) {
        this.orgNrWhitelistString = orgNrWhitelistString;
        this.orgFormWhitelistString = orgFormWhitelistString;
        this.adminListString = adminListString;
    }

    private List<String> getOrgNrWhitelist() {
        return Arrays.asList(orgNrWhitelistString.split(","));
    }

    private List<String> getOrgFormWhitelist() {
        return Arrays.asList(orgFormWhitelistString.split(","));
    }

    private List<String> getAdminListString() {
        return Arrays.asList(adminListString.split(","));
    }

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
                .filter(organisationFilter)
                .map(o -> "publisher:" + o.getOrganisationNumber() + ":admin").collect(Collectors.toList());

            if (getAdminListString().contains(this.getId())) {
                privilegesList.add("admin");
            }
            return String.join(",", privilegesList);
        }
    }
}
