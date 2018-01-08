package no.dcat.manipulate;

import lombok.Data;

@Data
public class ElasticRecord<T> {

    private String _index;
    private String _type;
    private String _id;
    private float _score;
    private T _source;
}
