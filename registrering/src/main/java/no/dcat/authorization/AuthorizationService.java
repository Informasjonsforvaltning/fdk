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
import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.ClientHttpRequestFactory;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
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
import java.util.List;

/**
 * Created by dask on 16.06.2017.
 */

@Configurable
public class AuthorizationService {
    private static final Logger logger = LoggerFactory.getLogger(AuthorizationService.class);

    private static final String apikey = "7FB6140D-B194-4BF6-B3C8-257094FBF8C4"; // test key from Erlend
    private static final String apikey2 = "99A0EC51-095B-4ADC-9795-342FFB5B1564"; // WEB nøkkel??
    public static final String keystoreLocation = "D://altinn/Buypass ID-REGISTERENHETEN I BRØNNØYSUND-serienummer4659019343921797777264492-2014-06-06.p12";
    private static final String keystorePassword = "xEPtHApswvpiNHTp";

    private static final String GET_REQUEST_FDK = "https://tt02.altinn.no/api/serviceowner/reportees?ForceEIAuthentication&subject=02084902333&servicecode=4814&serviceedition=3";

    @Value("${application.altinnServiceUrl}")
    String altinnServiceUrl;

    @Value("${application.altinnServiceCode}")
    String altinnServiceCode ;

    @Value("${application.altinnServiceEdition}")
    String altinnServiceEdition;


    final String servicePath = "api/serviceowner/reportees?ForceEIAuthentication&subject=%s&servicecode=%s&serviceedition=%s";

    private static ClientHttpRequestFactory requestFactory;
    static {
        try {
            requestFactory = getRequestFactory();
        } catch (KeyStoreException | IOException | UnrecoverableKeyException | NoSuchAlgorithmException | CertificateException | KeyManagementException e) {
            throw new RuntimeException(e);
        }
    }

    String getReporteesUrl(String ssn) {
        return altinnServiceUrl + String.format(servicePath, ssn, altinnServiceCode, altinnServiceEdition);
    }

    public static String getName(String ssn) {
        return "Frode Datakatalog";
    }


    public List<Entity> getAuthorizedEntities(String ssn) throws AuthorizationServiceUnavailable {

        RestTemplate restTemplate = new RestTemplate(requestFactory);

        HttpHeaders headers = new HttpHeaders();
        headers.set("ApiKey", apikey);
        headers.set("Accept", "application/json");

        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<List<Entity>> response = restTemplate.exchange(getReporteesUrl(ssn),
                HttpMethod.GET, entity, new ParameterizedTypeReference<List<Entity>>() {
                });

        if (response.getStatusCode() == HttpStatus.OK) {
            return response.getBody();
        }

        throw new AuthorizationServiceUnavailable(response.getStatusCode());
    }


    static ClientHttpRequestFactory getRequestFactory() throws KeyStoreException, IOException, UnrecoverableKeyException, NoSuchAlgorithmException, CertificateException, KeyManagementException {

        KeyStore keyStore = KeyStore.getInstance("PKCS12");

        keyStore.load(new FileInputStream(new File(keystoreLocation)),
                keystorePassword.toCharArray());

        TrustStrategy acceptingTrustStrategy = (chain, authType) -> true;

        SSLContext sslContext = SSLContexts.custom()
                .loadKeyMaterial(keyStore, keystorePassword.toCharArray())
                .loadTrustMaterial(null, acceptingTrustStrategy)
                .build();

        SSLConnectionSocketFactory f = new SSLConnectionSocketFactory(
                sslContext,
                new String[]{"TLSv1", "TLSv1.1" /*, "TLSv1.2"*/}, // Comment in TLSv1.2 to fail
                null, new DefaultHostnameVerifier());

        HttpClient httpClient = HttpClients.custom()
                .setSSLSocketFactory(f)
                .build();

        HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
        requestFactory.setHttpClient(httpClient);

        return requestFactory;
    }
}
