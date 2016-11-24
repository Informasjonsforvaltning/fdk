package no.dcat.portal.webapp;

/**
 * Class for holding dataitem info, used by thymleaf.
 */
public class DataitemQuery {
    private String q;
    private String theme;

    public String getQ() {
        return this.q;
    }

    public void setQ(String q) {
        this.q = q;
    }

    public String getTheme() {
        return this.theme;
    }

    public void setTheme(String theme) {
        this.theme = theme;
    }
}
