package no.dcat.mock.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class AuthorisationService {

    private static Map<String, String[]> userOrganisations = new HashMap<>();

    static {
        userOrganisations.put("16079411314", new String[]{"974760673"});
        userOrganisations.put("16079411233", new String[]{"974761076", "974760673"});
        userOrganisations.put("16079411152", new String[]{"889640782"});
    }

    public static String[] getOrganisations(String ssn) {
        return userOrganisations.get(ssn);
    }
}
