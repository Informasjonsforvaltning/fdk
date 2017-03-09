package no.dcat.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;
import org.springframework.hateoas.core.Relation;

import java.util.Date;
import java.util.List;
import java.util.Map;

@Document(indexName = "register", type = Dataset.ELASTIC_TYPE)
@Data
@Relation(collectionRelation = "datasets")
@ToString(includeFieldNames = false)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Dataset {

    public static final String ELASTIC_TYPE = "dataset";

    // dct:identifier
    // Norwegian: Identifikator
    @Id
    private String id;

    //Can't specify parent if no parent field has been configured
    @Field(type = FieldType.String, store = true)
    private String catalog;

    // dct:title
    // Norwegian: Tittel
    @Field
    private Map<String,String> title;

    //dct:description
    //Norwegian: Beskrivelse
    @Field
    private Map<String,String> description;

    //dcat:contactPoint
    //Norwegian: Kontaktpunkt
    @Field
    private List<Contact> contactPoint;

    //dcat:keyword
    //Norwegian: Emneord
    @Field
    private List<Map<String,String>> keyword;

    //dct:publisher
    //Norwegian: Utgiver
    @Field
    private Publisher publisher;

    //dct:issued
    //Norwegian: Utgivelsesdato
    @Field
    private Date issued;

    //dct:modified
    //Norwegian: Modifiseringsdato
    @Field
    private Date modified;

    //dct:language
    //Norwegian: Språk
    @Field
    private SkosCode language;

    //dcat:landingPage
    //Norwegian: Landingsside
    @Field
    private String landingPage;

    //dcat:theme
    //Norwegian: Tema
    @Field
    private List<DataTheme> theme;

    //dcat:distribution
    //Norwegian: Datasett distribusjon
    @Field
    private List<Distribution> distribution;

    //dcat:conformsTo
    //Norwegian: I samsvar med
    @Field
    private List<String> conformsTo;

    //dct:temporal
    //Norwegian: tidsperiode
    @Field
    private List<PeriodOfTime> temporal;

    //dct:spatial
    //Norwegian: dekningsområde
    @Field
    private List<SkosCode> spatial;

    //dct:accessRights
    //Norwegian: tilgangsnivå
    @Field
    private SkosCode accessRights;

    //dcatno:accessRightsComment
    //Norwegian: Skjermingshjemmel.
    //Norwegian extension to the dcat standard. Recommended used with accesRights.
    @Field
    private List<String> accessRightsComment;

    //dct:references
    //Norwegian: Refererer til.
    @Field
    private List<String> references;

    //dct:provenance
    //Norwegian: Opphav
    @Field
    private SkosCode provenance;

    //dct:identifier
    //Norwegian: identifikator
    @Field
    private List<String> identifier;

    //foaf:page
    //Norwegian: dokumentasjon
    @Field
    private List<String> page;

    //dct:accrualPeriodicity
    //Norwegian: frekvens
    @Field
    private SkosCode accrualPeriodicity;

    //dct:subject
    //Norwegian: begrep
    @Field
    private List<String> subject;

    //dct:type
    //Norwegian: type
    @Field
    private String type;

    //adms:identifier
    //Norwegian: annen identifikator
    @Field
    private List<String> admsIdentifier;

    //Meta information about editiong of the dataset description
    @Field
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date _lastModified;


    public Dataset() {
        //Blank override
    }

    public Dataset(String id) {
        this.id = id;
    }
}
