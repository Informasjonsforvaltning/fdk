package no.dcat.api.web;


public class Key {

	String url = "";
	String contentType = "";

	public Key(String url, String contentType) {
		this.url = url;
		this.contentType = contentType;
	}

	@Override
	public boolean equals(Object obj) {
		if(obj instanceof Key){
			Key key = ((Key) obj);
			if(key.url == null || key.contentType == null) return false;

			return key.url.equals(url) && key.contentType.equals(contentType);
		}
		return false;
	}

	@Override
	public int hashCode() {
		return (url+contentType).hashCode();
	}


	public String getUrl() {
		return url;
	}

	public String getContentType() {
		return contentType;
	}
}
