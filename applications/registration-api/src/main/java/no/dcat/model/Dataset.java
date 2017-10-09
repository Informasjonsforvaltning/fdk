package no.dcat.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.NonNull;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;
import org.springframework.hateoas.core.Relation;

import java.util.*;

@Document(indexName = "register", type = Dataset.ELASTIC_TYPE)
@Data
@Relation(collectionRelation = "datasets")
@ToString(includeFieldNames = false)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Dataset {

    public static final String ELASTIC_TYPE = "dataset";

    public static final String REGISTRATION_STATUS_DRAFT = "DRAFT";
    public static final String REGISTRATION_STATUS_PUBLISH = "PUBLISH";

    @NonNull
    @Id
    private String id;

    private String uri;

    //Can't specify parent if no parent field has been configured
    @Field(type = FieldType.String, store = true)
    private String catalog;

    // dct:title
    // Norwegian: Tittel
    @Field
    private Map<String,String> title = new HashMap<>();

    //dct:description
    //Norwegian: Beskrivelse
    @Field
    private Map<String,String> description = new HashMap<>();

    //dcatno:objective
    //Norwegian: Formål
    @Field
    private String objective;

    //dcat:contactPoint
    //Norwegian: Kontaktpunkt
    @Field
    private List<Contact> contactPoint = new ArrayList<>();

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
    private List<SkosCode> language;

    //dcat:landingPage
    //Norwegian: Landingsside
    @Field
    private List<String> landingPage;

    //dcat:theme
    //Norwegian: Tema
    @Field
    private List<DataTheme> theme;

    //dcat:distribution
    //Norwegian: Datasett distribusjon
    @Field
    private List<Distribution> distribution;

    //adms:sample
    //Norwegian: Eksempeldata
    @Field
    private List<Distribution> sample;

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



    // dcatno:legalBasisForRestriction
    //Norwegian: skjermingshjemmel
    @Field
    private List<SkosConceptWithHomepage> legalBasisForRestriction = Collections.emptyList();

    // dcatno:legalBasisForProcessing
    //Norwegian: behanlingsgrunnlag
    @Field
    private List<SkosConceptWithHomepage> legalBasisForProcessing = Collections.emptyList();

    // dcatno:legalBasisForAccess
    //Norwegian: utleveringshjemmel
    @Field
    private List<SkosConceptWithHomepage> legalBasisForAccess = Collections.emptyList();

    // dcatno:informationModel
    //Norwegian: informasjonsmodell
    @Field
    private SkosConceptWithHomepage informationModel;

    // dcatno:hasXXXXAnnotation
    @Field
    private QualityAnnotation hasAccuracyAnnotation;
    private QualityAnnotation hasCompletenessAnnotation;
    private QualityAnnotation hasCurrentnessAnnotation;
    private QualityAnnotation hasAvailabilityAnnotations;
    private QualityAnnotation hasRelevanceAnnotation;

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
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern ="yyyy-MM-dd'T'HH:mm:ss.SSSZZ")
    private Date _lastModified;

    @Field
    private String registrationStatus = REGISTRATION_STATUS_DRAFT; // DRAFT is default


    public Dataset() {
        //Blank override
    }

    public Dataset(String id) {
        this.id = id;
    }
}
