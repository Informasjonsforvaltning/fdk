package no.dcat.admin.store;

import no.dcat.admin.store.domain.DcatSource;
import no.dcat.admin.store.domain.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * @author by havardottestad, sebnmuller
 */
public class AdminDcatDataService {


	private final AdminDataStore adminDataStore;
	private final DcatDataStore dcatDataStore;


	private final Logger logger = LoggerFactory.getLogger(AdminDcatDataService.class);

	public AdminDcatDataService(AdminDataStore adminDataStore, DcatDataStore dcatDataStore) {
		this.adminDataStore = adminDataStore;
		this.dcatDataStore = dcatDataStore;
	}



	/**
	 * @param dcatSourceId
	 */
	public void deleteDcatSource(String dcatSourceId, User loggedInUser) {


		Optional<DcatSource> dcatSourceById = adminDataStore.getDcatSourceById(dcatSourceId);
		
		if(!dcatSourceById.isPresent()) return;
		DcatSource dcatSource = dcatSourceById.get();

		if(!dcatSource.getUser().equalsIgnoreCase(loggedInUser.getUsername()) && !loggedInUser.isAdmin()){
			throw new SecurityException(loggedInUser.getUsername()+" tried to delete a DcatSource belonging to "+dcatSource.getUser());
		}

		String query = String.join("\n",
				"delete {",
				"	graph <http://dcat.difi.no/usersGraph/> {",
				"		?dcatSource ?b ?c.",
				"		?c ?d ?e.",
				"		?f ?g ?dcatSource ." ,

				"	}",
				"} where {",
				"           BIND(IRI(?dcatSourceUri) as ?dcatSource)",
				"		?dcatSource ?b ?c.",
				"		OPTIONAL{" ,
				"			?c ?d ?e." ,
				"		}",
				"		OPTIONAL{" ,
				"			?f ?g ?dcatSource ." ,
				"		}",

				"}");

		Map<String, String> map = new HashMap<>();

		map.put("dcatSourceUri", dcatSource.getId());

		adminDataStore.fuseki.sparqlUpdate(query, map);

		dcatDataStore.deleteDataCatalogue(dcatSource);
//		elasticsearch = new Elasticsearch();
//		Client client = elasticsearch.returnElasticsearchTransportClient("localhost", 9300);
//		
//		if(elasticsearch.deleteDocument(".kibana", "search", dcatSourceId, client)) {
//			logger.info("[crawler_admin] [success] Deleted DCAT source from Elasticsearch: {}", dcatSource.toString());
//		} else {
//			logger.error("[crawler_admin] [fail] DCAT source was not deleted from Elasticsearch: {}", dcatSource.toString());
//		}
		
		if (adminDataStore.fuseki.ask("ask { ?dcatSourceUri foaf:accountName ?dcatSourceUri}", map)) { 
			logger.error("[crawler_admin] [fail] DCAT source was not deleted from Fuseki: {}", dcatSource.toString());
		} else {
			logger.info("[crawler_admin] [success] Deleted DCAT source from Fuseki: {}", dcatSource.toString());
		}
		
	}
	
	public void deleteUser(String username, User user) {
		
		if (user.isAdmin()) {
				
				String query = String.join("\n",
						"delete {",
						"	graph <http://dcat.difi.no/usersGraph/> {",
						"		?user ?b ?c.",
						"	}",
						"} where {",
						"		?user foaf:accountName ?username;",
						"		?b ?c .",
						"		FILTER (NOT EXISTS {?user difiMeta:dcatSource ?dcatSource})",
						"}");

				Map<String, String> map = new HashMap<>();

				map.put("username", username);

				adminDataStore.fuseki.sparqlUpdate(query, map);	
				if (adminDataStore.fuseki.ask("ask { ?user foaf:accountName ?username}", map)) {
					logger.error("[user_admin] [fail] User was not deleted: {}", user.toString());
				} else {
					logger.info("[user_admin] [success] Deleted user: {}", user.toString());
			}

		} else {
			logger.warn("ADMIN role is required to delete users");
		}
	}
}
