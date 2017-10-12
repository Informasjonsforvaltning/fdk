package no.dcat.admin.security;

import no.dcat.admin.settings.FusekiSettings;
import no.difi.dcat.datastore.AdminDataStore;
import no.difi.dcat.datastore.Fuseki;
import no.difi.dcat.datastore.UserNotFoundException;
import no.difi.dcat.datastore.domain.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@Component
public class FusekiUserDetailsService implements UserDetailsService {

    @Autowired
    private FusekiSettings fusekiSettings;
    private AdminDataStore adminDataStore;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private final Logger logger = LoggerFactory.getLogger(FusekiUserDetailsService.class);

    @PostConstruct
    public void initialize() {
        adminDataStore = new AdminDataStore(new Fuseki(fusekiSettings.getAdminServiceUri()));
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        Map<String, String> userMap = new HashMap<>();

        createTestUser("test_user", "password", "USER");
        createTestUser("test_admin", "password", "ADMIN");

        try {
            userMap = adminDataStore.getUser(username);
        } catch (UserNotFoundException e) {
            throw new UsernameNotFoundException(e.getMessage());
        }

        return new org.springframework.security.core.userdetails.User(username, userMap.get("password"), Arrays.asList(new SimpleGrantedAuthority(userMap.get("role"))));
    }

    private void createTestUser(String username, String password, String role) {
        try {
            User user = new User(null, username, passwordEncoder.encode(password), username + "@example.org", role);
            adminDataStore.addUser(user);
        } catch (Exception e) {
            logger.warn(e.getMessage(),e);
        }
    }
}

