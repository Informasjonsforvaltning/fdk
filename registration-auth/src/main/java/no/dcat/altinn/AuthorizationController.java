package no.dcat.altinn;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.springframework.http.MediaType.APPLICATION_JSON_UTF8_VALUE;
import static org.springframework.web.bind.annotation.RequestMethod.GET;

@RestController
@RequestMapping("api/serviceowner")
public class AuthorizationController {

    private static Logger logger = LoggerFactory.getLogger(AuthorizationController.class);
    private Map<String, List<Entity>> userEntities = new HashMap<>();
    private Map<String, String> userNames = new HashMap<>();

    // example of request url "https://tt02.altinn.no/api/serviceowner/reportees?
    // ForceEIAuthentication&subject=02084902333&
    // servicecode=4814&
    // serviceedition=3";

    @CrossOrigin
    @RequestMapping(value = "/reportees", method = GET,
            produces = APPLICATION_JSON_UTF8_VALUE)
    public HttpEntity<List<Entity>> getReportees(@RequestParam("ForceEIAuthentication") String forceEIAuthentication,
                                          @RequestParam("subject") String subject,
                                          @RequestParam(value="servicecode", defaultValue="4814") String serviceCode,
                                          @RequestParam(value="serviceedition", defaultValue="3") String serviceEdition) {

        logger.debug("call to altinn mock authorization get reportees with subject {}", subject);

        List<Entity> entities = userEntities.get(subject);

        if (entities == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(entities, HttpStatus.OK);
    }


    public AuthorizationController() {
        try {
            ClassPathResource testUsersResource = new ClassPathResource("testUsers.json");
            ObjectMapper mapper = new ObjectMapper();
            List<TestUser> users = mapper.readValue(testUsersResource.getInputStream(), new TypeReference<List<TestUser>>() {
            });

            users.forEach(user -> {
                logger.debug("TestUser {} ", user.getSsn());
                String ssn = (String) user.getSsn();
                userEntities.put(ssn, user.getEntities());
            });

        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
