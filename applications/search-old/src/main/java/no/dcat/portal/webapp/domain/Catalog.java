package no.dcat.portal.webapp.domain;

import java.util.Date;
import java.util.List;
import java.util.Map;

public class Catalog {

	private String id;
	private Map<String, String> title;
	private Map<String, String> description;
	private Publisher publisher;
	private Date issued;
	private Date modified;
	private String language;
	private List<String> themeTaxonomy;
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
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
	public String getLanguage() {
		return language;
	}
	public void setLanguage(String language) {
		this.language = language;
	}
	public List<String> getThemeTaxonomy() { return themeTaxonomy; }
	public void setThemeTaxonomy(List<String> themeTaxonomy) { this.themeTaxonomy = themeTaxonomy; }
	
	
}
