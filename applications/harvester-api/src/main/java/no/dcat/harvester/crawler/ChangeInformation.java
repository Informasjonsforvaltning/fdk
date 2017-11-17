package no.dcat.harvester.crawler;

import lombok.Data;

@Data
public class ChangeInformation   {
    private int inserts;
    private int updates;
    private int deletes;
}