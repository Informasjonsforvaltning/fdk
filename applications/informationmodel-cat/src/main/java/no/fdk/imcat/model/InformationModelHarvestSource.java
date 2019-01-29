package no.fdk.imcat.model;

public class InformationModelHarvestSource {
    public String harvestSourceUri; // this is unique external identifier, we use it for internal id lookup to avoid duplicates
    public String publisherOrgNr;
    public String sourceType;
    public String title;
    public String schema;
}
