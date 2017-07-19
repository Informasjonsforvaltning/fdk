package no.dcat.portal.webapp.domain;

import no.dcat.shared.SkosCode;

import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * Model class for dcat:Dataset
 * See https://doc.difi.no/dcat-ap-no/#_datasett_2
 **/
public class Dataset {

	// dct:identifier
	// Norwegian: Identifikator
	private String id;

	// dct:title
	// Norwegian: Tittel
	private Map<String,String> title;

	//dct:description
	//Norwegian: Beskrivelse
	private Map<String,String> description;

	//dcat:contactPoint
	//Norwegian: Kontaktpunkt
	private Contact contactPoint;

	//dcat:keyword
	//Norwegian: Emneord
	private Map<String, List<String>> keyword;

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
	private SkosCode language;

	//dcat:landingPage
	//Norwegian: Landingsside
	private String landingPage;

	//dcat:theme
	//Norwegian: Tema
    private List<DataTheme> theme;

	//dcat:catalog
	//Norwegian: Katalog
	//Reference to catalog owning the dataset
	private Catalog catalog;

	//dcat:distribution
	//Norwegian: Datasett distribusjon
	private List<Distribution> distribution;

	//dcat:conformsTo
	//Norwegian: I samsvar med
	private List<String> conformsTo;

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
	private List<String> accessRightsComment;

	//dct:references
	//Norwegian: Refererer til.
	private List<String> references;

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
	private List<String> subject;

	//dct:type
	//Norwegian: type
	private String type;

	//adms:identifier
	//Norwegian: annen identifikator
	private List<String> ADMSIdentifier;

	public List<DataTheme> getTheme() {
        return theme;
    }

    public void setTheme(List<DataTheme> theme) {
        this.theme = theme;
    }

	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}

	public List<Distribution> getDistribution() {
		return distribution;
	}
	public void setDistribution(List<Distribution> distribution) {
		this.distribution = distribution;
	}

	public Catalog getCatalog() {
		return catalog;
	}
	public void setCatalog(Catalog catalog) {
		this.catalog = catalog;
	}

	public Map<String, String> getTitle() {
		return title;
	}
	public void setTitle(Map<String, String> title) {
		this.title = title;
	}

	public Map<String, String> getDescription() {
		return description;
	}
	public void setDescription(Map<String, String> description) {
		this.description = description;
	}

	public Contact getContactPoint() {
		return contactPoint;
	}
	public void setContactPoint(Contact contactPoint) {
		this.contactPoint = contactPoint;
	}

	public Map<String, List<String>> getKeyword() {
		return keyword;
	}
	public void setKeyword(Map<String, List<String>> keyword) {
		this.keyword = keyword;
	}

	public Publisher getPublisher() {
		return publisher;
	}
	public void setPublisher(Publisher publisher) {
		this.publisher = publisher;
	}

	public Date getIssued() {
		return issued;
	}
	public void setIssued(Date issued) {
		this.issued = issued;
	}

	public Date getModified() {
		return modified;
	}
	public void setModified(Date modified) {
		this.modified = modified;
	}

	public SkosCode getLanguage() {
		return language;
	}
	public void setLanguage(SkosCode  language) {
		this.language = language;
	}

	public String getLandingPage() {
		return landingPage;
	}
	public void setLandingPage(String landingPage) {
		this.landingPage = landingPage;
	}

	public List<String> getConformsTo() { return conformsTo; }
	public void setConformsTo(List<String> conformsTo) { this.conformsTo = conformsTo; }

	public List<PeriodOfTime> getTemporal() { return temporal; }
	public void setTemporal(List<PeriodOfTime> temporal) { this.temporal = temporal; }

	public List<SkosCode> getSpatial() { return spatial; }
	public void setSpatial(List<SkosCode> spatial) { this.spatial = spatial; }

	public SkosCode getAccessRights() { return accessRights; }
	public void setAccessRights(SkosCode accessRights) { this.accessRights = accessRights; }

	public List<String> getAccessRightsComment() { return accessRightsComment; }
	public void setAccessRightsComment(List<String> accessRightsComment) { this.accessRightsComment = accessRightsComment; }

	public List<String> getReferences() { return references; }
	public void setReferences(List<String> references) { this.references = references; }

	public SkosCode getProvenance() { return provenance; }
	public void setProvenance(SkosCode provenance) { this.provenance = provenance; }

	public void setIdentifier(List<String> identifier) {
		this.identifier = identifier;
	}

	public List<String> getIdentifier() {
		return identifier;
	}

	public void setPage(List<String> page) {
		this.page = page;
	}

	public List<String> getPage() {
		return page;
	}

	public void setAccrualPeriodicity(SkosCode accrualPeriodicity) {
		this.accrualPeriodicity = accrualPeriodicity;
	}

	public SkosCode getAccrualPeriodicity() {
		return accrualPeriodicity;
	}

	public void setSubject(List<String> subject) {
		this.subject = subject;
	}

	public List<String> getSubject() {
		return subject;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getType() {
		return type;
	}

	public void setADMSIdentifier(List<String> ADMSIdentifier) {
		this.ADMSIdentifier = ADMSIdentifier;
	}

	public List<String> getADMSIdentifier() {
		return ADMSIdentifier;
	}
}
