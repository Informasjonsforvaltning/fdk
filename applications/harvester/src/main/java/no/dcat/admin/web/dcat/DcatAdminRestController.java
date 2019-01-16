package no.dcat.admin.web.dcat;

import no.dcat.admin.settings.FusekiSettings;
import no.dcat.datastore.AdminDataStore;
import no.dcat.datastore.AdminDcatDataService;
import no.dcat.datastore.DcatDataStore;
import no.dcat.datastore.Fuseki;
import no.dcat.datastore.UserNotFoundException;
import no.dcat.datastore.domain.DcatSource;
import no.dcat.datastore.domain.User;
import no.dcat.shared.admin.DcatSourceDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.PostConstruct;
import javax.validation.Valid;
import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "*")
public class DcatAdminRestController {

    @Autowired
    private FusekiSettings fusekiSettings;
    private AdminDataStore adminDataStore;
    private AdminDcatDataService adminDcatDataService;

    private final Logger logger = LoggerFactory.getLogger(DcatAdminController.class);

    @PostConstruct
    public void initialize() {
        adminDataStore = new AdminDataStore(new Fuseki(fusekiSettings.getAdminServiceUri()));
        adminDcatDataService = new AdminDcatDataService(adminDataStore, new DcatDataStore(new Fuseki(fusekiSettings.getDcatServiceUri())));
    }

    @RequestMapping("/api/admin/dcat-sources")
    public ResponseEntity<List<DcatSourceDto>> getDataSources() {
        return new ResponseEntity<List<DcatSourceDto>>(
                adminDataStore.getDcatSources().stream()
                        .map((DcatSource dcatSource) -> convertToDto(dcatSource))
                        .collect(Collectors.toList()),
                HttpStatus.OK);
    }

    @RequestMapping(value = "/api/admin/dcat-source", method = RequestMethod.POST)
    public ResponseEntity<String> addDataSource(@Valid @RequestBody DcatSourceDto dcatSourceDto, Principal principal) {
        if (principal == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        DcatSource dcatSource = convertToDomain(dcatSourceDto);

        try {
            User userObject = adminDataStore.getUserObject(principal.getName());
            // if you are not admin, you can only add dcat source to yourself
            if (!userObject.isAdmin() && !userObject.getUsername().equals(dcatSource.getUser())) {
                return new ResponseEntity(HttpStatus.UNAUTHORIZED);
            }
        } catch (UserNotFoundException e) {
            logger.error("User not found",e);
            return new ResponseEntity(HttpStatus.UNAUTHORIZED);
        }

        adminDataStore.addDcatSource(dcatSource);
        logger.debug("Added Dcat source: {}" + dcatSource.toString());

        return new ResponseEntity<>(HttpStatus.ACCEPTED);
    }

    @RequestMapping(value = "/api/admin/dcat-source", method = RequestMethod.DELETE)
    public ResponseEntity<String> deleteDataSource(@Valid @RequestParam("delete") String dcatName, Principal principal) throws UserNotFoundException {
        if (principal == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        try {
            adminDcatDataService.deleteDcatSource(dcatName, adminDataStore.getUserObject(principal.getName()));
            logger.debug("Deleted dcat source with id: {}", dcatName);
        } catch (UserNotFoundException e) {
            throw e;
        }

        return new ResponseEntity<>(HttpStatus.ACCEPTED);
    }

    private DcatSource convertToDomain(DcatSourceDto dto) {
        return new DcatSource(dto.getId(), dto.getDescription(), dto.getUrl(), dto.getUser(), dto.getOrgnumber());
    }

    private DcatSourceDto convertToDto(DcatSource domain) {
        return new DcatSourceDto(domain.getId(), domain.getDescription(), domain.getUrl(), domain.getUser(), domain.getOrgnumber());
    }
}

