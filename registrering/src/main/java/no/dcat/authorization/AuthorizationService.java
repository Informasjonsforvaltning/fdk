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
import org.springframework.core.env.Environment;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.ClientHttpRequestFactory;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import javax.net.ssl.SSLContext;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.security.KeyManagementException;
import java.security.KeyStore;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.UnrecoverableKeyException;
import java.security.cert.CertificateException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by dask on 16.06.2017.
 */


public class AuthorizationService {
    private static final Logger logger = LoggerFactory.getLogger(AuthorizationService.class);

    @Value("{apikey}")
    private static final String apikey = "7FB6140D-B194-4BF6-B3C8-257094FBF8C4"; // test key from Erlend
    private static final String apikey2 = "99A0EC51-095B-4ADC-9795-342FFB5B1564"; // WEB nøkkel fra Altinn, men funker ikke
    private static final String apikey3 = "948E57B8-8F44-43E6-921F-F512F67A7F76"; // 28.06.2017 fra Torkel Buarøy

    static String[] TLS_PROTOCOLS = {"TLSv1", "TLSv1.1" /*, "TLSv1.2"*/}; // Comment in TLSv1.2 to fail : bug in altinn or java that fails TLS handshake most of the time, but not always
    static String[] TLS_PROTOCOLSx = {"TLSv1.2"};

    static String[] CIPHER_SUITES = null; // {"TLS_RSA_WITH_AES_128_GCM_SHA256"};

    @Value("$keystoreLocation")
    public static final String keystoreLocation = "/git/fdk-properties/ssldevelop.p12";

    @Value("${keystorePassword}")
    private static final String keystorePassword = "changeit";

    private static final String GET_REQUEST_FDK = "https://tt02.altinn.no/api/serviceowner/reportees?ForceEIAuthentication&subject=02084902333&servicecode=4814&serviceedition=3";

    @Value("${application.altinnServiceUrl}")
    String altinnServiceUrl = "https://tt02.altinn.no/";

    @Value("${application.altinnServiceCode}")
    String altinnServiceCode = "4814";

    @Value("${application.altinnServiceEdition}")
    String altinnServiceEdition = "3";


    @Autowired
    private Environment environment;

    final static String servicePath = "api/serviceowner/reportees?ForceEIAuthentication&subject=%s&servicecode=%s&serviceedition=%s";

    private static Map<String, List<Entity>> userEntities = new HashMap<>();
    private static Map<String, Entity> organizationEntities = new HashMap<>();

    public static AuthorizationService SINGLETON = new AuthorizationService();

    private static ClientHttpRequestFactory requestFactory;

    static {
        try {
            requestFactory = getRequestFactory();
        } catch (KeyStoreException | IOException | UnrecoverableKeyException | NoSuchAlgorithmException | CertificateException | KeyManagementException e) {
            throw new RuntimeException(e);
        }
    }

    public Entity getOrganization(String orgid) {
        return organizationEntities.get(orgid);
    }


    /**
     * returns the organizations that this user is allowed to register dataset on
     *
     * @param ssn
     * @return list of organization numbers
     */
    public List<String> getOrganisations(String ssn) {
        List<String> organizations = new ArrayList<>();
        if (!userEntities.containsKey(ssn)) {
            try {
                cacheEntries(ssn);
            } catch (AuthorizationServiceUnavailable asu) {
                logger.error("Autorization service is unavailable, cannot authorize user", asu);
                return null;
            }
        }
        userEntities.get(ssn).forEach(entity -> {
            if (entity.getOrganizationNumber() != null) {
                organizations.add(entity.getOrganizationNumber());
            }
        });

        return organizations;
    }


    String getReporteesUrl(String ssn) {
        return altinnServiceUrl + String.format(servicePath, ssn, altinnServiceCode, altinnServiceEdition);
    }

    protected void cacheEntries(String ssn) throws AuthorizationServiceUnavailable {
        List<Entity> entries = getAuthorizedEntities(ssn);
        if (entries == null) {
            entries = new ArrayList<>();
        }

        String name = "unknown";
        for (Entity entry : entries) {

            if (entry.getSocialSecurityNumber() != null) {
                name = entry.getName();
            } else {
                organizationEntities.put(entry.getOrganizationNumber(),entry);
                NameEntityService.SINGLETON.setOrganizationName(entry.getOrganizationNumber(), entry.getName());
            }
        }

        NameEntityService.SINGLETON.setUserName(ssn, name);
        userEntities.put(ssn, entries);

    }


    public List<Entity> getAuthorizedEntities(String ssn) throws AuthorizationServiceUnavailable {

        RestTemplate restTemplate = new RestTemplate(requestFactory);

        HttpHeaders headers = new HttpHeaders();
        headers.set("ApiKey", apikey);
        headers.set("Accept", "application/json");

        HttpEntity<String> entity = new HttpEntity<>(headers);
        try {
            logger.info("Authorization request for {}", ssn);

            ResponseEntity<List<Entity>> response = restTemplate.exchange(getReporteesUrl(ssn),
                    HttpMethod.GET, entity, new ParameterizedTypeReference<List<Entity>>() {});

            if (response.getStatusCode() == HttpStatus.OK) {
                return response.getBody();
            }

            throw new AuthorizationServiceUnavailable(response.getStatusCode());

        } catch (HttpClientErrorException e) {
            logger.warn("Authorization request for {} failed: {}", ssn, e.getLocalizedMessage(),e);
        }

        return null;
    }

    /**
     * Configures ClientHttpRequestFactory to accept two way https connections.
     *
     * @return the ClientHttpRequestFactory with configured SSLContext
     * @throws KeyStoreException
     * @throws IOException
     * @throws UnrecoverableKeyException
     * @throws NoSuchAlgorithmException
     * @throws CertificateException
     * @throws KeyManagementException
     */

    static ClientHttpRequestFactory getRequestFactory() throws KeyStoreException, IOException, UnrecoverableKeyException, NoSuchAlgorithmException, CertificateException, KeyManagementException {

        KeyStore keyStore = KeyStore.getInstance("PKCS12");

        keyStore.load(new FileInputStream(new File(keystoreLocation)),
                keystorePassword.toCharArray());

        TrustStrategy acceptingTrustStrategy = (chain, authType) -> true;

        SSLContext sslContext = SSLContexts.custom()
                .loadKeyMaterial(keyStore, keystorePassword.toCharArray())
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
}
