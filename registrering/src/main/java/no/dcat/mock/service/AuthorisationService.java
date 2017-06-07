package no.dcat.mock.service;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class AuthorisationService {

    private static Map<String, List<String>> userOrganisaitions = new HashMap<>();

    static {
        userOrganisaitions.put("16079411314", Arrays.asList("974760673"));
        userOrganisaitions.put("16079411233", Arrays.asList("974761076"));
        userOrganisaitions.put("16079411152", Arrays.asList("889640782", "974761076"));
    }


    public static List<String> getOrganisations(String ssn) {
        return userOrganisaitions.get(ssn);
    }
}
