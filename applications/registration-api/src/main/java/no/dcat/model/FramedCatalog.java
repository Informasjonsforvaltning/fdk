package no.dcat.model;

import com.google.gson.annotations.SerializedName;
import no.dcat.model.Catalog;

import java.util.List;

public class FramedCatalog {

    @SerializedName("@graph")
    List<Catalog> graph;

    public List<Catalog> getGraph() {
        return graph;
    }
}
