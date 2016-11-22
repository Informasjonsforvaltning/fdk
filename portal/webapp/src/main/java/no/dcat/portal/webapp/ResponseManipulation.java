package no.dcat.portal.webapp;

import no.difi.dcat.datastore.domain.dcat.DataTheme;
import no.difi.dcat.datastore.domain.dcat.Dataset;
import no.difi.dcat.datastore.domain.dcat.Distribution;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

/**
 * Class for manipulating fields on the object that is attached to the viewmodel.
 */
public final class ResponseManipulation {

    private static List langs = new ArrayList<String>();

    public ResponseManipulation() {
        langs.add("nb");
        langs.add("nn");
        langs.add("en");
    }

    /**
     * Loops over all properties with a language tagg, and if the specified language is not filled out, fills it
     * with values from an other language.
     */
    public Dataset fillWithAlternativeLangValIfEmpty(Dataset dataset, String lang) {
        fillPropWithAlternativeValIfEmpty(dataset.getTitle(), lang);
        fillPropWithAlternativeValIfEmpty(dataset.getDescription(), lang);

        if (dataset.getTheme() != null) {
            for (DataTheme dataTheme : dataset.getTheme()) {
                fillPropWithAlternativeValIfEmpty(dataTheme.getTitle(), lang);
            }
        }

        fillPropWithAlternativeValIfEmpty(dataset.getKeyword(), lang);

        if (dataset.getDistribution() != null) {
            for (Distribution distribution : dataset.getDistribution()) {
                fillPropWithAlternativeValIfEmpty(distribution.getTitle(), lang);
                fillPropWithAlternativeValIfEmpty(distribution.getDescription(), lang);
            }
        }

        return dataset;
    }

    /**
     * If the property is not defined for the specified language, fill in with values from an other language.
     *
     */
    private void fillPropWithAlternativeValIfEmpty(Map map, String language) {
        if(map != null) {
            Object nbVal = map.get(language);
            if (nbVal == null) {

                Object altVal = null;
                Iterator iter = langs.iterator();
                while (iter.hasNext()) {
                    altVal = map.get(iter.next());
                    if (altVal != null) break;
                }

                if(altVal != null) {
                    map.put(language, altVal);
                }
            }
        }
    }
}
