package no.dcat.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;

import java.util.Date;

/**
 * Class for storing meta information about the status
 * of data set objects while they are being registered
 *
 * Created by bjg on 08.03.2017.
 */
@Document(indexName = "registerMeta", type = Catalog.ELASTIC_TYPE)
@Data
@ToString(includeFieldNames = false)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DatasetMetainformation {

    public static final String ELASTIC_TYPE = "datasetMeta";

    //id of metainfo entry
    @Id
    private String id;

    //id of dataset this meta-entry concerns
    private String datasetId;

    private Date lastModified;
    private String validationStatus;
    private String comment;
}
