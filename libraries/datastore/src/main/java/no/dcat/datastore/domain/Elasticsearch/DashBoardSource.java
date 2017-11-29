package no.dcat.datastore.domain.Elasticsearch;

import java.util.ArrayList;
import java.util.Map;

public class DashBoardSource {

	private String title;
	private int hits;
	private String description;
	private ArrayList<Map<String, Object>> panelsJSON;
	private Map<String, Object> optionsJSON;
	private Map<String, Object> uiStateJSON;
	private int version;
	private boolean timeRestore;
	private Map<String, Object> kibanaSavedObjectMeta;

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public int getHits() {
		return hits;
	}

	public void setHits(int hits) {
		this.hits = hits;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public ArrayList<Map<String, Object>> getPanelsJSON() {
		return panelsJSON;
	}

	public void setPanelsJSON(ArrayList<Map<String, Object>> panelsJSON) {
		this.panelsJSON = panelsJSON;
	}

	public Map<String, Object> getOptionsJSON() {
		return optionsJSON;
	}

	public void setOptionsJSON(Map<String, Object> optionsJSON) {
		this.optionsJSON = optionsJSON;
	}

	public Map<String, Object> getUiStateJSON() {
		return uiStateJSON;
	}

	public void setUiStateJSON(Map<String, Object> uiStateJSON) {
		this.uiStateJSON = uiStateJSON;
	}

	public int getVersion() {
		return version;
	}

	public void setVersion(int version) {
		this.version = version;
	}

	public boolean isTimeRestore() {
		return timeRestore;
	}

	public void setTimeRestore(boolean timeRestore) {
		this.timeRestore = timeRestore;
	}

	public Map<String, Object> getKibanaSavedObjectMeta() {
		return kibanaSavedObjectMeta;
	}

	public void setKibanaSavedObjectMeta(Map<String, Object> kibanaSavedObjectMeta) {
		this.kibanaSavedObjectMeta = kibanaSavedObjectMeta;
	}

}
