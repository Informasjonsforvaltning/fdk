package no.dcat.portal.webapp.comparator;

import no.dcat.portal.webapp.domain.DataTheme;

import java.io.Serializable;
import java.util.Comparator;

/**
 * Class for comparing title property on DataTheme.
 */
public class ThemeTitleComparator implements Comparator<DataTheme>, Serializable {
    private final String lang;

    public ThemeTitleComparator(String language) {
        lang = language;
    }

    /**
     * Compare the property title on to objects of type DataTheme.
     *
     * @param o1 First object of type DataTheme to be compared.
     * @param o2 Second object of type DataTheme to be compared with the first object.
     * @return integer: 0 if both titles are null, -1 if o1 is null, 1 of o2 is null
     */
    @Override
    public int compare(DataTheme o1, DataTheme o2) {

        if (o1.getTitle() == null && o2.getTitle() == null) {
            return 0;
        }

        if (o1.getTitle() == null) {
            return -1;
        }

        if (o2.getTitle() == null) {
            return 1;
        }

        if (o1.getTitle().get(lang) == null && o2.getTitle().get(lang) == null) {
            return 0;
        }

        if (o1.getTitle().get(lang) == null) {
            return -1;
        }

        if (o2.getTitle().get(lang) == null) {
            return 1;
        }

        return o1.getTitle().get(lang).compareTo(o2.getTitle().get(lang));
    }
}
