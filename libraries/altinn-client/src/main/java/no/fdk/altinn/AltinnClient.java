package no.fdk.altinn;

import com.google.common.collect.ImmutableMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.util.Assert;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import static org.springframework.http.HttpMethod.GET;

public class AltinnClient {
    private static Logger logger = LoggerFactory.getLogger(AltinnClient.class);

    private String altinnProxyHost;

    // disable default constructor so that configuration is ensured
    private AltinnClient() {
    }

    public AltinnClient(String altinnProxyHost) {
        Assert.notNull(altinnProxyHost, "Required argument altinnProxyHost");
        this.altinnProxyHost = altinnProxyHost;
    }

    private static Optional<Subject> extractPersonSubject(String socialSecurityNumber, List<Subject> reportees) {
        return reportees.stream()
            .filter(s -> "Person".equals(s.type) && socialSecurityNumber.equals(s.socialSecurityNumber))
            .findFirst();
    }

    private static List<Organisation> extractOrganisations(List<Subject> reportees) {
        return reportees.stream()
            .filter(s -> "Enterprise".equals(s.type))
            .map(Organisation::new)
            .collect(Collectors.toList());
    }

    private List<Subject> getReportees(String socialSecurityNumber) {
        RestTemplate restTemplate = new RestTemplate();

        String reporteesUrlTemplate = altinnProxyHost + "/api/serviceowner/reportees?ForceEIAuthentication&subject={subject}&servicecode=4814&serviceedition=1&$top=1000";
        Map<String, String> params = ImmutableMap.of("subject", socialSecurityNumber);

        return restTemplate.exchange(reporteesUrlTemplate, GET, null, new ParameterizedTypeReference<List<Subject>>() {
        }, params).getBody();
    }

    public Optional<Person> getPerson(String socialSecurityNumber) {
        List<Subject> reportees = getReportees(socialSecurityNumber);

        Optional<Subject> personSubject = extractPersonSubject(socialSecurityNumber, reportees);

        return personSubject.map(ps -> new Person(ps, extractOrganisations(reportees)));
    }

}

