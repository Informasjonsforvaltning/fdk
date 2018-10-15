package no.acat.harvester;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@AllArgsConstructor
@Data
public class HarvestTask {
    public static final String HARVEST_ALL = "harvestAll";
    private final String method;
    private String argument = "";

    @Override
    public int hashCode() {
        return (method + "." + argument).hashCode();
    }

    @Override
    public boolean equals(Object obj) {
        return obj.hashCode() == this.hashCode();
    }

}
