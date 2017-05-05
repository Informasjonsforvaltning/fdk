package no.dcat.portal.webapp.comparator;

import no.dcat.portal.webapp.domain.Publisher;

import java.io.Serializable;
import java.util.Comparator;

/**
 * Class for comparing organisasjonsform property on Publisher.
 */
public class PublisherOrganisasjonsformComparator implements Comparator<Publisher>, Serializable {

    public static final String STAT = "STAT";
    public static final String KOMM = "KOMM";

    /**
     * Compare the property organisasjonsform on to objects of type Publisher.
     * Sortorder is as follows: STAT, KOMM and others.
     *
     * @param o1 First object of type Publisher to be compared.
     * @param o2 First object of type DataTheme to be compared with.
     * @return value that tells us if o1 is less than o2 or not
     */
    @Override
    public int compare(Publisher o1, Publisher o2) {
        Integer comVal1 = getComVal(o1.getOrganisasjonsform());
        Integer comVal2 = getComVal(o2.getOrganisasjonsform());

        return comVal1.compareTo(comVal2);
    }

    private Integer getComVal(String orgForm) {
        if (orgForm == null) {
            return 3;
        }
        if (orgForm.equals(STAT)) {
            return 0;
        }
        if (orgForm.equals(KOMM)) {
            return 1;
        }
        return 2;
    }
}
