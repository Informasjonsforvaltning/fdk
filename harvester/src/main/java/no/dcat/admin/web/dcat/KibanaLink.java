package no.dcat.admin.web.dcat;

import no.dcat.admin.settings.ApplicationSettings;

/**
 * Created by havardottestad on 12/05/16.
 */
public class KibanaLink {

    String firstHalf;
    String secondHalf;

    KibanaLink(ApplicationSettings applicationSettings) {
        firstHalf = applicationSettings.getKibanaLinkFirstHalf();
        secondHalf = applicationSettings.getKibanaLinkSecondHalf();
    }

    public String getFirstHalf() {
        return firstHalf;
    }

    public String getSecondHalf() {
        return secondHalf;
    }
}