package no.difi.dcat.datastore.domain.dcat;

import lombok.Data;
import no.dcat.shared.DataTheme;
import no.dcat.shared.SkosCode;

import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * Model class for dcat:Dataset
 * See https://doc.difi.no/dcat-ap-no/#_datasett_2
 **/
@Data
public class Dataset extends no.dcat.shared.Dataset{

	//dcat:catalog
	//Norwegian: Katalog
	//Reference to catalog owning the dataset
	private Catalog catalog;


}
