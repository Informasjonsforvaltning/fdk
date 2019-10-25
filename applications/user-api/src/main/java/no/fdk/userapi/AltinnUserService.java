package no.fdk.userapi;

import no.fdk.altinn.AltinnClient;
import no.fdk.altinn.Organisation;
import no.fdk.altinn.Person;
import no.fdk.userapi.configuration.WhitelistProperties;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.function.Predicate;
import java.util.stream.Collectors;

import static no.fdk.userapi.ResourceRole.ROOT_ADMIN;
import static no.fdk.userapi.ResourceRole.ResourceType.PUBLISHER;
import static no.fdk.userapi.ResourceRole.Role.ADMIN;

@Service
public class AltinnUserService {
    private AltinnClient altinnClient;
    private WhitelistProperties whitelists;

    private Predicate<Organisation> organisationFilter = (o) -> whitelists.getOrgNrWhitelist().contains(o.getOrganisationNumber()) || whitelists.getOrgFormWhitelist().contains(o.getOrganisationForm());

    AltinnUserService(WhitelistProperties whitelists, AltinnClient altinnClient) {
        this.altinnClient = altinnClient;
        this.whitelists = whitelists;
    }

    Optional<User> getUser(String id) {
        // Currently we only fetch one role association from Altinn
        // and we interpret it as publisher admin role in fdk system

        return altinnClient.getPerson(id).map(AltinnUserService.AltinnUserAdapter::new);
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
            List<ResourceRole> resourceRoles = person.getOrganisations().stream()
                .filter(organisationFilter)
                .map(o -> new ResourceRole(PUBLISHER, o.getOrganisationNumber(), ADMIN))
                .collect(Collectors.toList());

            if (whitelists.getAdminList().contains(this.getId())) {
                resourceRoles.add(ROOT_ADMIN);
            }

            List<String> resourceRoleStrings = resourceRoles.stream().map(Object::toString).collect(Collectors.toList());

            return String.join(",", resourceRoleStrings);
        }
    }
}
