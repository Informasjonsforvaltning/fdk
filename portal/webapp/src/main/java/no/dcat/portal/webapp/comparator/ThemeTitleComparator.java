package no.dcat.portal.webapp.comparator;

import no.difi.dcat.datastore.domain.dcat.DataTheme;

import java.util.Comparator;

/**
 * Class for comparing title property on DataTheme.
 */
public class ThemeTitleComparator implements Comparator<DataTheme> {

    /**
     * Compare the property title on to objects of type DataTheme.
     *
     * @param o1 First object of type DataTheme to be compared.
     * @param o2 Second object of type DataTheme to be compared with the first object.
     * @return
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

        if (o1.getTitle().get("nb") == null && o2.getTitle().get("nb") == null) {
            return 0;
        }

        if (o1.getTitle().get("nb") == null) {
            return -1;
        }

        if (o2.getTitle().get("nb") == null) {
            return 1;
        }

        return o1.getTitle().get("nb").compareTo(o2.getTitle().get("nb"));
    }
}
