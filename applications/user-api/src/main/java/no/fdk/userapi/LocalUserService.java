package no.fdk.userapi;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import static no.fdk.userapi.ResourceRole.ResourceType.PUBLISHER;
import static no.fdk.userapi.ResourceRole.Role.READ;

@Service
public class LocalUserService {

    private String orgCatalogueHost;

    LocalUserService(@Value("${application.hosts.orgCatalogueHost}") String orgCatalogueHost) {
        this.orgCatalogueHost = orgCatalogueHost;
    }

    private List<String> getOrganisationsAssociatedWithDomain(String domain) {
        try {
            String urlString = orgCatalogueHost + "/domains/" + domain + "/organizations";
            URLConnection connection = new URL(urlString).openConnection();
            connection.setRequestProperty("Accept", "application/json");
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()))) {
                String jsonBody = reader.lines().collect(Collectors.joining(System.lineSeparator()));
                ObjectMapper mapper = new ObjectMapper();
                return mapper.readValue(jsonBody, List.class);
            }
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }

    String getAuthorities(String id) {
        String domain = id.substring(id.indexOf("@") + 1);
        List<String> organisations = getOrganisationsAssociatedWithDomain(domain);

        List<String> resourceRoleStrings = organisations.stream()
            .map(o -> new ResourceRole(PUBLISHER, o, READ))
            .map(Object::toString)
            .collect(Collectors.toList());

        return String.join(",", resourceRoleStrings);
    }
}
