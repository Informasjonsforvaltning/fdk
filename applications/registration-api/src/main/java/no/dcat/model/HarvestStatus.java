package no.dcat.model;

import lombok.Data;

@Data
public class HarvestStatus {
    private final Boolean success;
    private final String errorMessage;

    public static HarvestStatus Success() {
        return new HarvestStatus(true, null);
    }

    public static HarvestStatus Error(String message) {
        return new HarvestStatus(false, message);
    }

    public static HarvestStatus PartialSuccess(String message) {return new HarvestStatus(true, message);}
}
