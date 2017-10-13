package no.difi.dcat.datastore.domain.dcat;

import lombok.Data;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Data
public class Catalog extends no.dcat.shared.Catalog{

	List<Dataset> dataset;
}
