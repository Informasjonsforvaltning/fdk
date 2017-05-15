package no.dcat.api.web;

import com.google.common.cache.LoadingCache;
import no.dcat.api.settings.FusekiSettings;
import no.difi.dcat.datastore.DcatDataStore;
import no.difi.dcat.datastore.Fuseki;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.annotation.PostConstruct;
import javax.validation.Valid;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;


@RestController
@CrossOrigin(origins = "*")
public class DcatRestController {

	@Autowired
	private FusekiSettings fusekiSettings;

	@Autowired
	private LoadingCache<Key, String> dcatCache;

	private final Logger logger = LoggerFactory.getLogger(DcatRestController.class);
	private DcatDataStore dcatDataStore;


	@PostConstruct
	public void initialize() {
		dcatDataStore = new DcatDataStore(new Fuseki(fusekiSettings.getDcatServiceUri()));
	}

	/**
	 * Supported urls:
	 * - /api/dcat
	 * - /api/dcat?format=jsonld
	 * - /api/dcat?format=rdf/xml
	 *
	 * @param format
	 * @return
	 */
	@RequestMapping(value = "/api/dcat")
	public ResponseEntity getDcat(@Valid @RequestParam(value = "format", required = false) String format) {

		SupportedFormat supportedFormat = SupportedFormat.parseFormat(format);

		try {

			Key key = new Key(fusekiSettings.getDcatServiceUri() + "/get?graph=urn:x-arq:UnionGraph", supportedFormat.getMimetype().toString());

			final HttpHeaders httpHeaders= new HttpHeaders();
			httpHeaders.setContentType(supportedFormat.getMimetype());

			return new ResponseEntity<>(dcatCache.get(key),httpHeaders, HttpStatus.OK);


		} catch (ExecutionException e) {
			logger.error("Error getting DCAT from Fuseki: " + e.getMessage());
			return new ResponseEntity<String>(HttpStatus.INTERNAL_SERVER_ERROR);

		}
	}


	@RequestMapping(value = "/api/invalidateCache", method = RequestMethod.POST)
	public ResponseEntity invalidateCache() {
		dcatCache.invalidateAll();
		return new ResponseEntity<String>(HttpStatus.OK);

	}


	@RequestMapping(value = "/api/refreshCache", method = RequestMethod.POST)
	public ResponseEntity refreshCache() {

		List<Key> keyset = new ArrayList<>(dcatCache.asMap().keySet());
		keyset.forEach(dcatCache::refresh);

		return new ResponseEntity<String>(HttpStatus.OK);

	}


// This compression filter is quite slow, it's better to set up compression in tomcat.
//
//	@Bean
//	public CompressingFilter compressingFilter() {
//		CompressingFilter compressingFilter = new CompressingFilter();
//		return compressingFilter;
	/*
		<dependency>
			<groupId>net.sourceforge.pjl-comp-filter</groupId>
			<artifactId>pjl-comp-filter</artifactId>
			<version>1.7</version>
		</dependency>
	 */
//	}




}

