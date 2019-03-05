package no.dcat.shared;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.ToString;
import no.ccat.common.model.Concept;

import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Data
@ToString(includeFieldNames = false)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Dataset {

    private String id;

    private String uri;

    private String source;
    private HarvestMetadata harvest;

    // dct:title
    // Norwegian: Tittel
    private Map<String,String> title;

    //dct:description
    //Norwegian: Beskrivelse
    private Map<String,String> description;

    private Map<String,String> descriptionFormatted;

    //dcatno:objective
    //Norwegian: Formål
    private Map<String,String> objective;

    //dcat:contactPoint
    //Norwegian: Kontaktpunkt
    private List<Contact> contactPoint ;

    //dcat:keyword
    //Norwegian: Emneord
    private List<Map<String,String>> keyword;

    //dct:publisher
    //Norwegian: Utgiver
    private Publisher publisher;

    //dct:issued
    //Norwegian: Utgivelsesdato
    private Date issued;

    //dct:modified
    //Norwegian: Modifiseringsdato
    private Date modified;

    //dct:language
    //Norwegian: Språk
    private List<SkosCode> language;

    //dcat:landingPage
    //Norwegian: Landingsside
    private List<String> landingPage;

    //dcat:theme
    //Norwegian: Tema
    private List<DataTheme> theme;

    //dcat:distribution
    //Norwegian: Datasett distribusjon
    private List<Distribution> distribution;

    //adms:sample
    //Norwegian: Eksempeldata
    private List<Distribution> sample;

    //dct:temporal
    //Norwegian: tidsperiode
    private List<PeriodOfTime> temporal;

    //dct:spatial
    //Norwegian: dekningsområde
    private List<SkosCode> spatial;

    //dct:accessRights
    //Norwegian: tilgangsnivå
    private SkosCode accessRights;

    //dcatno:accessRightsComment
    //Norwegian: Skjermingshjemmel.
    //Norwegian extension to the dcat standard. Recommended used with accesRights.
    @Deprecated
    private List<String> accessRightsComment;

    // dcatno:legalBasisForRestriction
    //Norwegian: skjermingshjemmel
    private List<SkosConcept> legalBasisForRestriction;

    // dcatno:legalBasisForProcessing
    //Norwegian: behanlingsgrunnlag
    private List<SkosConcept> legalBasisForProcessing ;

    // dcatno:legalBasisForAccess
    //Norwegian: utleveringshjemmel
    private List<SkosConcept> legalBasisForAccess ;


    // dcatno:hasXXXXAnnotation
    private QualityAnnotation hasAccuracyAnnotation;
    private QualityAnnotation hasCompletenessAnnotation;
    private QualityAnnotation hasCurrentnessAnnotation;
    private QualityAnnotation hasAvailabilityAnnotation;
    private QualityAnnotation hasRelevanceAnnotation;

    //dct:references
    //Norwegian: Refererer til.
    private List<Reference> references;

    //dct:provenance
    //Norwegian: Opphav
    private SkosCode provenance;

    //dct:identifier
    //Norwegian: identifikator
    private List<String> identifier;

    //foaf:page
    //Norwegian: dokumentasjon
   private List<String> page;

    //dct:accrualPeriodicity
    //Norwegian: frekvens
    private SkosCode accrualPeriodicity;

    //dct:subject
    //Norwegian: begrep
    private List<Subject> subject;

    private List<Concept> concepts;

    //adms:identifier
    //Norwegian: annen identifikator
    private List<String> admsIdentifier;

    //dcat:conformsTo
    //Norwegian: I samsvar med
    private List<SkosConcept> conformsTo;

    // NEW FIELDS DCAT-AP-NO 1.2?

    // dct: informationModel
    // Norwegian: informasjonsmodell
    private List<SkosConcept> informationModel;


    //dct:type
    //Norwegian: type
    private String type;

    private Catalog catalog;

}
