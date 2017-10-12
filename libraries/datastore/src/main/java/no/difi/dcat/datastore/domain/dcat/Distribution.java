package no.difi.dcat.datastore.domain.dcat;

import java.util.HashMap;
import java.util.Map;

public class Distribution {
	
	private String id;
	private Map<String,String> title;
	private Map<String,String> description;
	private String accessURL;
	private String license;
	private String format;
	
	private Dataset dataset;
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public Dataset getDataset() {
		return dataset;
	}
	public void setDataset(Dataset dataset) {
		this.dataset = dataset;
	}
	public Map<String, String> getTitle() {
		if (title == null) {
			title = new HashMap<>();
		}
		return title;
	}
	public void setTitle(Map<String, String> title) {
		this.title = title;
	}
	public Map<String, String> getDescription() {
		if (description == null) {
			description = new HashMap<>();
		}
		return description;
	}
	public void setDescription(Map<String, String> description) {
		this.description = description;
	}
	public String getAccessURL() {
		return accessURL;
	}
	public void setAccessURL(String accessURL) {
		this.accessURL = accessURL;
	}
	public String getLicense() {
		return license;
	}
	public void setLicense(String license) {
		this.license = license;
	}
	public String getFormat() {
		return format;
	}
	public void setFormat(String format) {
		this.format = format;
	}
	
	
}
