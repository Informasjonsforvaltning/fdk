package no.dcat.themes.service;

import com.google.gson.annotations.SerializedName;
import no.dcat.shared.DataTheme;
import no.dcat.shared.SkosCode;

import java.util.List;

public class FramedSkosCode {


    @SerializedName("@graph")
    List<SkosCode> graph;

    public List<SkosCode> getGraph() {
        return graph;
    }
}
