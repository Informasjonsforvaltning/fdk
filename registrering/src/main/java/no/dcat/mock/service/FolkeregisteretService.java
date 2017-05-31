package no.dcat.mock.service;

import java.util.HashMap;
import java.util.Map;

public class FolkeregisteretService {
    private static Map<String, String> userNames = new HashMap<>();

    static {
        userNames.put("16079411314", "Bjarne Brønnøy");
        userNames.put("16079411233", "Siv Skatt");
        userNames.put("16079411152", "Narve Nav");
    }

    public static String getName(String ssn) {
        return userNames.get(ssn);
    }
}
