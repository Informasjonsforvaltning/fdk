package no.dcat.harvester.crawler.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.ToString;
import no.dcat.shared.LosTheme;

import java.util.List;

@Data
@ToString(includeFieldNames = false)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DatasetWithLOS extends no.dcat.shared.Dataset {

    private List<String> expandedLosTema;

    private List<LosTheme> losTheme;
}
