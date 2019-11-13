package no.fdk.userapi;

import no.fdk.altinn.AltinnClient;
import no.fdk.altinn.Organization;
import no.fdk.altinn.Person;
import no.fdk.userapi.configuration.WhitelistProperties;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.function.Predicate;
import java.util.stream.Collectors;

import static no.fdk.userapi.ResourceRole.ROOT_ADMIN;
import static no.fdk.userapi.ResourceRole.ResourceType.organization;
import static no.fdk.userapi.ResourceRole.Role.admin;

@Service
public class AltinnUserService {
    private AltinnClient altinnClient;
    private WhitelistProperties whitelists;

    private Predicate<Organization> organizationFilter = (o) -> whitelists.getOrgNrWhitelist().contains(o.getOrganizationNumber()) || whitelists.getOrgFormWhitelist().contains(o.getOrganizationForm());

    AltinnUserService(WhitelistProperties whitelists, AltinnClient altinnClient) {
        this.altinnClient = altinnClient;
        this.whitelists = whitelists;
    }

    Optional<User> getUser(String id) {
        // Currently we only fetch one role association from Altinn
        // and we interpret it as publisher admin role in fdk system

        return altinnClient.getPerson(id).map(AltinnUserService.AltinnUserAdapter::new);
    }

    Optional<String> getAuthorities(String id) {
        return altinnClient.getPerson(id).map(this::getPersonAuthorities);
    }

    private String getPersonAuthorities(Person person) {

        List<String> resourceRoleTokens = person.getOrganizations().stream()
            .filter(organizationFilter)
            .map(o -> new ResourceRole(organization, o.getOrganizationNumber(), admin))
            .map(Object::toString)
            .collect(Collectors.toList());

        if (whitelists.getAdminList().contains(person.getSocialSecurityNumber())) {
            resourceRoleTokens.add(ROOT_ADMIN.toString());
        }

        return String.join(",", resourceRoleTokens);
    }

    private static class AltinnUserAdapter implements User {
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
    }
}
