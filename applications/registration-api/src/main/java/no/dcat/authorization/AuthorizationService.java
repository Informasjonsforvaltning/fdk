package no.dcat.authorization;

import org.apache.http.client.HttpClient;
import org.apache.http.conn.ssl.DefaultHostnameVerifier;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.conn.ssl.TrustStrategy;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.ssl.SSLContexts;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.http.client.ClientHttpRequestFactory;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import javax.annotation.PostConstruct;
import javax.net.ssl.SSLContext;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.security.*;
import java.security.cert.CertificateException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.function.Predicate;
import java.util.stream.Collectors;

/**
 * Created by dask on 16.06.2017.
 */

@Service
public class AuthorizationService {
    private static final Logger logger = LoggerFactory.getLogger(AuthorizationService.class);

    static String[] TLS_PROTOCOLS = {"TLSv1.2"};
    static String[] CIPHER_SUITES = null; // {"TLS_RSA_WITH_AES_128_GCM_SHA256"};

    @Value("${application.apikey}")
    private String apikey;

    @Value("${application.clientSSLCertificateKeystoreLocation}")
    private String clientSSLCertificateKeystoreLocation;

    @Value("${application.clientSSLCertificateKeystorePassword}")
    private String clientSSLCertificateKeystorePassword;

    @Value("${application.altinnServiceUrl}")
    String altinnServiceUrl;

    @Value("${application.altinnServiceCode}")
    String altinnServiceCode;

    @Value("${application.altinnServiceEdition}")
    String altinnServiceEdition;

    @Autowired
    EntityNameService entityNameService;

    @Autowired
    AuthorizedOrgformService authorizedOrgformService;

    final static String servicePath = "api/serviceowner/reportees?ForceEIAuthentication&subject=%s&servicecode=%s&serviceedition=%s";

    private ClientHttpRequestFactory requestFactory;

    @PostConstruct
    public void constructor() {
        assert altinnServiceUrl != null;
        logger.info("Altinn service url: {}", altinnServiceUrl );

        assert altinnServiceCode != null;
        logger.info("Altinn service code: {}", altinnServiceCode );

        assert altinnServiceEdition != null;
        logger.info("Altinn service edition: {}", altinnServiceEdition );

        assert apikey != null;
        logger.info("Altinn apikey: {}", apikey);

        assert clientSSLCertificateKeystoreLocation != null;
        logger.info("Altinn client certificate keystore location: {}", clientSSLCertificateKeystoreLocation);

        assert clientSSLCertificateKeystorePassword != null;
        logger.info("Altinn client certificate keystore password: {}", clientSSLCertificateKeystorePassword);

        try {
            requestFactory = getRequestFactory();
        } catch (KeyStoreException | IOException | UnrecoverableKeyException | NoSuchAlgorithmException | CertificateException | KeyManagementException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * returns the organizations that this user is allowed to register datasets on
     *
     * @param ssn the user identifier
     * @return list of organization numbers
     */
    public List<String> getOrganisations(String ssn) throws AuthorizationServiceException {
        return getAuthorizedOrganisations(ssn);
    }

    String getReporteesUrl(String ssn) {
        return altinnServiceUrl + "/" + String.format(servicePath, ssn, altinnServiceCode, altinnServiceEdition);
    }

    /**
     * Processes the entities returned by the authorization service and registers user and organization names in the
     * entity name service.
     *
     * @param ssn the user identification
     * @return a list of organisation numbers that the user is allowed to
     * @throws AuthorizationServiceException
     */
    protected List<String> getAuthorizedOrganisations(String ssn) throws AuthorizationServiceException {
        List<String> organisations = new ArrayList<>();

        String name = "Bruker ikke funnet i Altinn";
        entityNameService.setUserName(ssn, name);

        List<Entity> authorizedEntities = getAuthorizedEntities(ssn);

        List<Entity> entries = authorizedEntities.stream().filter(isApprovedEntityType()).collect(Collectors.toList());

        for (Entity entry : entries) {

            if (entry.getSocialSecurityNumber() != null) {
                if (entry.getSocialSecurityNumber().equals(ssn)) {
                    name = entry.getName();
                }
            } else {
                organisations.add(entry.getOrganizationNumber());
                entityNameService.setOrganizationName(entry.getOrganizationNumber(), entry.getName());
            }
        }

        entityNameService.setUserName(ssn, name);

        return organisations;
    }

    private Predicate<Entity> isApprovedEntityType() {
        return entry -> "Person".equals(entry.getType()) || ("Enterprise".equals(entry.getType()) && authorizedOrgformService.isIncluded(entry));
    }

    /**
     * Calls the authorization service.
     *
     * @param ssn the user identifier
     * @return The response from the authorization service. A set of entities where each entity represents an organization or a person.
     * @throws AuthorizationServiceException
     */
    public List<Entity> getAuthorizedEntities(String ssn) throws AuthorizationServiceException {

        RestTemplate restTemplate = new RestTemplate(requestFactory);

        HttpHeaders headers = new HttpHeaders();
        headers.set("ApiKey", apikey);
        headers.set("Accept", "application/json");

        HttpEntity<String> entity = new HttpEntity<>(headers);
        try {
            logger.info("Authorization request for {}", ssn);

            logger.debug("altinn-auth-request-url    : {}", getReporteesUrl(ssn));
            logger.debug("altinn-auth-request-headers: {}", entity.toString());

            ResponseEntity<List<Entity>> response = restTemplate.exchange(getReporteesUrl(ssn),
                    HttpMethod.GET, entity, new ParameterizedTypeReference<List<Entity>>() {});

            logger.debug("altinn-auth-response: {}", response.toString());

            if (response.getStatusCode() == HttpStatus.OK) {
                return response.getBody();
            }

            throw new AuthorizationServiceException(response.getStatusCode());

        } catch (HttpClientErrorException e) {
            String message = String.format("Authorization request failed: %s", e.getLocalizedMessage());
            logger.warn(message, e);
            throw new AuthorizationServiceException(message);
        }
    }

    /**
     * Configures ClientHttpRequestFactory to provide client certificate for two way https connection.
     *
     * @return the ClientHttpRequestFactory with configured SSLContext
     * @throws KeyStoreException
     * @throws IOException
     * @throws UnrecoverableKeyException
     * @throws NoSuchAlgorithmException
     * @throws CertificateException
     * @throws KeyManagementException
     */

    ClientHttpRequestFactory getRequestFactory() throws KeyStoreException, IOException, UnrecoverableKeyException, NoSuchAlgorithmException, CertificateException, KeyManagementException {

        KeyStore keyStore = KeyStore.getInstance("PKCS12");
        logger.debug("open ssl certificate file {}", clientSSLCertificateKeystoreLocation);

        keyStore.load(new FileInputStream(new File(clientSSLCertificateKeystoreLocation)),
                clientSSLCertificateKeystorePassword.toCharArray());

        TrustStrategy acceptingTrustStrategy = (chain, authType) -> true;

        SSLContext sslContext = SSLContexts.custom()
                .loadKeyMaterial(keyStore, clientSSLCertificateKeystorePassword.toCharArray())
                .loadTrustMaterial(null, acceptingTrustStrategy)
                .build();

        logger.debug("TLS_PROTOCOLS = {}", Arrays.toString(TLS_PROTOCOLS));

        SSLConnectionSocketFactory f = new SSLConnectionSocketFactory(
                sslContext,
                TLS_PROTOCOLS,
                CIPHER_SUITES, new DefaultHostnameVerifier());

        HttpClient httpClient = HttpClients.custom()
                .setSSLSocketFactory(f)
                .build();

        HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
        requestFactory.setHttpClient(httpClient);

        return requestFactory;
    }

    void setAuthorizedOrgformService(AuthorizedOrgformService authorizedOrgformService) {
        this.authorizedOrgformService = authorizedOrgformService;
    }
}
