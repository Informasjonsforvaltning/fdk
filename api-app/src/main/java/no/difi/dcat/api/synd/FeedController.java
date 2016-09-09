package no.difi.dcat.api.synd;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import javax.annotation.PostConstruct;

import org.apache.jena.rdf.model.Model;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import no.difi.dcat.api.settings.FusekiSettings;
import no.difi.dcat.datastore.AdminDataStore;
import no.difi.dcat.datastore.DcatDataStore;
import no.difi.dcat.datastore.Fuseki;
import no.difi.dcat.datastore.domain.DcatSource;

@Controller
public class FeedController {
	
	@Autowired
	private DcatFeed dcatFeed;
	
	@Autowired
	private FusekiSettings fusekiSettings;
	private DcatDataStore dcatDataStore;
	private AdminDataStore adminDataStore;

	private final Logger logger = LoggerFactory.getLogger(FeedController.class);

	@PostConstruct
	public void initialize() {
		dcatDataStore = new DcatDataStore(new Fuseki(fusekiSettings.getDcatServiceUri()));
		adminDataStore = new AdminDataStore(new Fuseki(fusekiSettings.getAdminServiceUri()));
	}
	
	@RequestMapping(value="/api/rss/feed", method=RequestMethod.GET)
	public ModelAndView getRssContent() {
		ModelAndView mav = new ModelAndView(new DcatRssView());
		
		List<String> graphs = dcatDataStore.listGraphs();
		
		List<DcatFeed> dcatFeeds = new ArrayList<>();
		
		for (String graphName : graphs) {
			Model model = dcatDataStore.getDataCatalogue(graphName);
			Optional<DcatSource> dcatSource = adminDataStore.getDcatSourceByGraph(graphName);
			if (dcatSource.isPresent()) {
				dcatFeeds.addAll(dcatFeed.createFeed(model, dcatSource.get()));
			}
		}
		
		mav.addObject("feeds", dcatFeeds);
		return mav;
	}
}