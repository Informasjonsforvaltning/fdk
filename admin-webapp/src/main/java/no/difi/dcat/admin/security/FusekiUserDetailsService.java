package no.difi.dcat.admin.security;

import no.dcat.admin.store.AdminDataStore;
import no.dcat.admin.store.Fuseki;
import no.dcat.admin.store.UserNotFoundException;
import no.difi.dcat.admin.settings.FusekiSettings;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
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

        return new User(username, userMap.get("password"), Arrays.asList(new SimpleGrantedAuthority(userMap.get("role"))));
    }

    private void createTestUser(String username, String password, String role) {
        try {
            no.dcat.admin.store.domain.User user = new no.dcat.admin.store.domain.User(null, username, passwordEncoder.encode(password), username + "@example.org", role);
            adminDataStore.addUser(user);
        } catch (Exception e) {
            logger.warn(e.getMessage(),e);
        }
    }
}

