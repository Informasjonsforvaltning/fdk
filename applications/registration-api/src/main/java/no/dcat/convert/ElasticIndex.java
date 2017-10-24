package no.dcat.convert;

import lombok.Data;
import no.dcat.model.Dataset;


@Data
public class ElasticIndex {
    private String _index;
    private String _type;
    private String _id;
    private float _score;
    private Dataset _source;
}
