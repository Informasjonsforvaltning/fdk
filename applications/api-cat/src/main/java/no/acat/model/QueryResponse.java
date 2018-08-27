package no.acat.model;

import lombok.Data;

import java.util.List;

@Data
public class QueryResponse {

    long total;
    List<ApiDocument> hits;
}
