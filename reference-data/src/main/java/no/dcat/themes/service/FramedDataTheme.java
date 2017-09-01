package no.dcat.themes.service;

import com.google.gson.annotations.SerializedName;
import no.dcat.shared.DataTheme;

import java.util.List;

public class FramedDataTheme {


    @SerializedName("@graph")
    List<DataTheme> graph;

    public List<DataTheme> getGraph() {
        return graph;
    }
}
