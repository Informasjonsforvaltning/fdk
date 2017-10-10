package no.dcat.shared;

/**
 * Created by extkkj on 10.10.2017.
 */
public class HelpText {
    public HelpText(String title, String description) {
        this.title = title;
        this.description = description;
    }

    public String getAbstract() {
        return title;
    }

    public void setAbstract(String title) {
        this.title = title;
    }

    private String title;

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    private String description;



}
