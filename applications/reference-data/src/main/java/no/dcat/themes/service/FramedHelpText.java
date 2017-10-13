package no.dcat.themes.service;

import com.google.gson.annotations.SerializedName;
import no.dcat.shared.HelpText;

import java.util.List;

/**
 * Created by extkkj on 10.10.2017.
 */
public class FramedHelpText {

    @SerializedName("@graph")
    List<HelpText> graph;

    public List<HelpText> getGraph() {
        return graph;
    }


}
