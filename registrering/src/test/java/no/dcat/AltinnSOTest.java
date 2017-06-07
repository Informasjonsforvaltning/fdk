package no.dcat;

import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.conn.ssl.TrustSelfSignedStrategy;
import org.apache.http.conn.ssl.TrustStrategy;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.ssl.SSLContextBuilder;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.ClientHttpRequestFactory;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

import javax.net.ssl.SSLContext;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.security.KeyManagementException;
import java.security.KeyStore;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.UnrecoverableKeyException;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;

/**
 * Created by dask on 07.06.2017.
 */
public class AltinnSOTest {
    private static Logger logger = LoggerFactory.getLogger(AltinnSOTest.class);

    private final static String apikey = "7FB6140D-B194-4BF6-B3C8-257094FBF8C4";

    @Test
    public void redirect() throws Throwable {

        RestTemplate restTemplate = new RestTemplate(getRequestFactory1());
        HttpHeaders headers = new HttpHeaders();
        headers.set("ApiKey", apikey);
        headers.set("Accept", "application/hal+json");

        X509Certificate certificate = null;

        ResponseEntity<String> response = restTemplate.getForEntity("https://tt02.altinn.no/api/serviceowner/reportees?subject=01116100572&servicecode=3811&serviceedition=201501",
                String.class, headers);

        logger.info("Response {}", response.getStatusCodeValue());


    }

    ClientHttpRequestFactory getRequestFactory2() {
        try {
            TrustStrategy acceptingTrustStrategy = (X509Certificate[] chain, String authType) -> true;

            SSLContext sslContext = org.apache.http.ssl.SSLContexts.custom()
                    .loadTrustMaterial(null, acceptingTrustStrategy)
                    .build();

            SSLConnectionSocketFactory csf = new SSLConnectionSocketFactory(sslContext);

            CloseableHttpClient httpClient = HttpClients.custom().setSSLSocketFactory(csf).build();

            HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();

            requestFactory.setHttpClient(httpClient);
            return requestFactory;

        } catch (Exception e) {
            logger.error("Exception RF2",e);
        }

     return null;
    }

    ClientHttpRequestFactory getRequestFactory1() {

        try {
            KeyStore keyStore = KeyStore.getInstance(KeyStore.getDefaultType());
            keyStore.load(new FileInputStream(new File("keystore.jks")),
                    "secret".toCharArray());

            SSLConnectionSocketFactory socketFactory = new SSLConnectionSocketFactory(
                    new SSLContextBuilder()
                            .loadTrustMaterial(null, new TrustSelfSignedStrategy())
                            .loadKeyMaterial(keyStore, "password".toCharArray()).build());
            HttpClient httpClient = HttpClients.custom().setSSLSocketFactory(socketFactory).build();
            ClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory(
                    httpClient);
            return requestFactory;
        } catch (Exception e) {
            logger.error("Exception ", e);
        }
        return null;
    }

}
