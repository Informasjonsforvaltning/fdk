package no.dcat.data.store.domain.dcat;

public class Contact {

	private String id;
	private String fullname;
	private String email;
	private String organizationName;
	private String organizationUnit;
	private String hasURL;

	public String getTelephone() {
		return telephone;
	}

	public void setTelephone(String telephone) {
		this.telephone = telephone;
	}

	private String telephone;
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getFullname() {
		return fullname;
	}
	public void setFullname(String fullname) {
		this.fullname = fullname;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}


	public void setOrganizationName(String organizationName) {
		this.organizationName = organizationName;
	}

	public String getOrganizationName() {
		return organizationName;
	}

	public void setOrganizationUnit(String organizationUnit) {
		this.organizationUnit = organizationUnit;
	}

	public String getOrganizationUnit() {
		return organizationUnit;
	}

	public void setHasURL(String hasURL) {
		this.hasURL = hasURL;
	}

	public String getHasURL() {
		return hasURL;
	}
}
