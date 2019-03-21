package no.dcat.admin.web.dcat;

import no.dcat.admin.settings.ApplicationSettings;
import no.dcat.admin.settings.FusekiSettings;
import no.dcat.datastore.AdminDataStore;
import no.dcat.datastore.Fuseki;
import no.dcat.datastore.domain.DcatSource;
import no.dcat.datastore.domain.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import javax.annotation.PostConstruct;
import java.net.URL;
import java.security.Principal;
import java.util.List;
import java.util.Optional;

@Controller
@CrossOrigin(origins = "*")
public class DcatAdminController {

    //tttttt

    @Autowired
    private FusekiSettings fusekiSettings;
    @Autowired
    private ApplicationSettings applicationSettings;
    private AdminDataStore adminDataStore;

    private final Logger logger = LoggerFactory.getLogger(DcatAdminController.class);

    @PostConstruct
    public void initialize() {
        adminDataStore = new AdminDataStore(new Fuseki(fusekiSettings.getAdminServiceUri()));
    }


    @RequestMapping("/")
    public ModelAndView index() {
        return new ModelAndView("redirect:/admin");
    }

    @RequestMapping("/admin")
    public ModelAndView viewAllDcatSources(@RequestParam(value = "edit", required = false) String editDcatSourceName,
                                    Principal principal) {
        String name = principal.getName();

        boolean isAdmin = User.isAdmin(name, adminDataStore);

        List<DcatSource> dcatSources;
        if (isAdmin) {
            dcatSources = adminDataStore.getDcatSources();
        } else {
            dcatSources = adminDataStore.getDcatSourcesForUser(name);
        }

        ModelAndView model = new ModelAndView("admin");
        model.addObject("dcatSources", dcatSources);
        model.addObject("username", name);
        model.addObject("isAdmin", isAdmin);

        if (editDcatSourceName != null) {
            logger.trace("Looking for dcat source name to edit {}", editDcatSourceName);
            Optional<DcatSource> editDcatSource = dcatSources.stream().filter((DcatSource dcatSource) -> dcatSource.getId().equalsIgnoreCase(editDcatSourceName)).findFirst();
            if (editDcatSource.isPresent()) {
                logger.trace("Dcat source found {}", editDcatSourceName);
                model.addObject("editDcatSource", editDcatSource.get());
            }
        }

        return model;
    }

    @RequestMapping("/dcatSource")
    public ModelAndView viewSingleDcatSource(@RequestParam(value = "id", required = true) String id, Principal principal) {

        logger.debug("View {}",id);
        Optional<DcatSource> dcatSourceById = adminDataStore.getDcatSourceById(id);

        logger.debug("Datasource by id {}",dcatSourceById.get());

        ModelAndView model = new ModelAndView("dcatSource");
        model.addObject("dcatSource", dcatSourceById.get());

        return model;
    }


    @RequestMapping(value = "/admin/harvestDcatSource", method = RequestMethod.GET)
    public ModelAndView harvestDcatSource(@RequestParam("id") String dcatSourceId, ModelMap model) {
        logger.info("Start harvest of dcat source: " + dcatSourceId);
        String urlString = applicationSettings.getHarvesterUrl() + "/api/admin/harvest?id=" + dcatSourceId;
        try {
            URL url = new URL(urlString);
            url.openConnection().getInputStream();
        } catch (Exception e) {

            logger.error("Unable to open connection to harvester {} due to {}", urlString, e.getMessage());

        }

        model.clear();
        return new ModelAndView("redirect:/admin");
    }
}


