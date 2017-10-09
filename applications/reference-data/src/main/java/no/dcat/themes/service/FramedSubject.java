package no.dcat.themes.service;

import com.google.gson.annotations.SerializedName;
import no.dcat.shared.Subject;

import java.util.List;

public class FramedSubject {


    @SerializedName("@graph")
    List<Subject> graph;

    public List<Subject> getGraph() {
        return graph;
    }
}
