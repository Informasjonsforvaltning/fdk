package no.dcat.admin.web.user;

import no.dcat.admin.settings.FusekiSettings;
import no.dcat.datastore.AdminDataStore;
import no.dcat.datastore.AdminDcatDataService;
import no.dcat.datastore.DcatDataStore;
import no.dcat.datastore.Fuseki;
import no.dcat.datastore.UserAlreadyExistsException;
import no.dcat.datastore.UserNotFoundException;
import no.dcat.datastore.domain.User;
import no.dcat.shared.admin.UserDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.PostConstruct;
import javax.validation.Valid;
import java.security.Principal;

@RestController
@CrossOrigin(origins = "*")
public class UserAdminRestController {

    @Autowired
    private FusekiSettings fusekiSettings;
    private AdminDataStore adminDataStore;
    private AdminDcatDataService adminDcatDataService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private final Logger logger = LoggerFactory.getLogger(UserAdminRestController.class);

    @PostConstruct
    public void initialize() {
        adminDataStore = new AdminDataStore(new Fuseki(fusekiSettings.getAdminServiceUri()));
        adminDcatDataService = new AdminDcatDataService(adminDataStore, new DcatDataStore(new Fuseki(fusekiSettings.getDcatServiceUri())));

    }

    @RequestMapping(value = "/api/admin/user", method = RequestMethod.POST)
    public ResponseEntity<String> addUser(@Valid @RequestBody UserDto userDto, Principal principal) {
        if (principal == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        try {
            User userObject = adminDataStore.getUserObject(principal.getName());
            // only admin can create a user
            if (!userObject.isAdmin()) {
                return new ResponseEntity(HttpStatus.UNAUTHORIZED);
            }
        } catch (UserNotFoundException e) {
            logger.error("User not found",e);
            return new ResponseEntity(HttpStatus.UNAUTHORIZED);
        }

        try {
            User user = convertToDomain(userDto);
            if (user.getPassword() != null && !user.getPassword().isEmpty()) {
                user.setPassword(passwordEncoder.encode(user.getPassword()));
            }
            adminDataStore.addUser(user);
        } catch (UserAlreadyExistsException e) {
            logger.error("User already exists",e);
            return new ResponseEntity<String>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>(HttpStatus.ACCEPTED);
    }

    @RequestMapping(value = "/api/admin/user", method = RequestMethod.DELETE)
    public ResponseEntity<String> deleteUser(@Valid @RequestParam("delete") String username, Principal principal) throws UserNotFoundException {
        if (principal == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        try {
            adminDcatDataService.deleteUser(username, adminDataStore.getUserObject(principal.getName()));
        } catch (UserNotFoundException e) {
            throw e;
        }

        return new ResponseEntity<>(HttpStatus.ACCEPTED);
    }

    private static User convertToDomain(UserDto dto) {
        return new User(dto.getId(), dto.getUsername(), dto.getPassword(), dto.getEmail(), dto.getRole());
    }

    private static UserDto convertToDto(User user) {
        return new UserDto(user.getId(), user.getUsername(), user.getPassword(), user.getEmail(), user.getRole());
    }


}