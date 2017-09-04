package no.difi.dcat.datastore.domain.Elasticsearch;

import java.util.Map;

public class Dashboard {

	private String _index;
	private String _type;
	private String _id;
	private int _version;
	private int _score;
	private Map<String, Object> _source;

	public String get_index() {
		return _index;
	}

	public void set_index(String _index) {
		this._index = _index;
	}

	public String get_type() {
		return _type;
	}

	public void set_type(String _type) {
		this._type = _type;
	}

	public String get_id() {
		return _id;
	}

	public void set_id(String _id) {
		this._id = _id;
	}

	public int get_version() {
		return _version;
	}

	public void set_version(int _version) {
		this._version = _version;
	}

	public int get_score() {
		return _score;
	}

	public void set_score(int _score) {
		this._score = _score;
	}

	public Map<String, Object> get_source() {
		return _source;
	}

	public void set_source(Map<String, Object> _source) {
		this._source = _source;
	}

}
