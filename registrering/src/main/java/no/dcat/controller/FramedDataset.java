package no.dcat.controller;

import com.google.gson.annotations.SerializedName;
import no.dcat.model.Dataset;

import java.util.List;

public class FramedDataset {

    @SerializedName("@graph")
    List<Dataset> graph;

    public List<Dataset> getGraph() {
        return graph;
    }
}
