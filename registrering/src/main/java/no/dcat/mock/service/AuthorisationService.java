package no.dcat.mock.service;

import java.util.HashMap;
import java.util.Map;

public class AuthorisationService {

    private static Map<String, String> userOrganisaitions = new HashMap<>();

    static {
        userOrganisaitions.put("16079411314", "974760673");
        userOrganisaitions.put("16079411233", "974761076");
        userOrganisaitions.put("16079411152", "889640782 ");
    }

    public static String getOrganisation(String ssn) {
        return userOrganisaitions.get(ssn);
    }
}
