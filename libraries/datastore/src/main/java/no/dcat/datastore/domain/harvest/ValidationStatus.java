package no.dcat.datastore.domain.harvest;

import lombok.Data;

import java.util.List;

@Data
public class ValidationStatus {
    private int errors;
    private int warnings;
    private List<String> validationMessages;
}
