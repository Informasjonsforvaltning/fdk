package no.dcat.datastore.domain.harvest;

import lombok.Data;

@Data
public class ChangeInformation   {
    private int inserts;
    private int updates;
    private int deletes;
}