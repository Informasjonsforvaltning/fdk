package no.dcat;

import org.apache.http.client.HttpClient;
import org.apache.http.conn.ssl.TrustStrategy;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.ssl.SSLContexts;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.ClientHttpRequestFactory;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;

import org.springframework.web.client.RestTemplate;

import javax.net.ssl.SSLContext;
import java.io.File;
import java.io.FileInputStream;
import java.security.KeyStore;
import java.util.UUID;

/**
 * Created by dask on 07.06.2017.
 */

// -Djavax.net.ssl.keyStore=D:/altinn/brreg.jks -Djavax.net.ssl.keyStorePassword=keystore

public class AltinnSOTest {
    private static final String apikey = "7FB6140D-B194-4BF6-B3C8-257094FBF8C4";
    public static final String keystoreLocation = "D://altinn/Buypass ID-REGISTERENHETEN I BRØNNØYSUND-serienummer4659019343921797777264492-2014-06-06.p12";
    private static final String keystorePassword = "xEPtHApswvpiNHTp";

    private static final String GET_REQUEST_ALTINN = "https://tt02.altinn.no/api/serviceowner/reportees?ForceEIAuthentication&subject=01116100572&servicecode=3811&serviceedition=201501";
    private static final String GET_REQUEST_FDK = "https://tt02.altinn.no/api/serviceowner/reportees?ForceEIAuthentication&subject=02084902333&servicecode=4814&serviceedition=3"; //&temp="+ UUID.randomUUID().toString(); //https://tt02.altinn.no/api/serviceowner/reportees?ForceEIAuthentication&subject=02084902333&servicecode=4814&serviceedition=3";
    private static final String cert_alias = "registerenheten i brønnøysund";

    private static Logger logger = LoggerFactory.getLogger(AltinnSOTest.class);

    @Test
    public void redirect() throws Throwable {


        RestTemplate restTemplate = new RestTemplate(getRequestFactory3());
        HttpHeaders headers = new HttpHeaders();
        headers.set("ApiKey", apikey);
        headers.set("Accept", "application/hal+json");
        //headers.set("Cookie", "BIGipServer~autoprov~aiport.ai-tt02-port.ai-test.osl.basefarm.net-85=rd1o00000000000000000000ffff0a2b991eo851; path=/");



        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<String> response2 = restTemplate.exchange(GET_REQUEST_FDK,
                HttpMethod.GET, entity, String.class);

        logger.info("Response2 {}", response2.getStatusCodeValue());
        logger.info("Response body {}", response2.getBody());

    }


    ClientHttpRequestFactory getRequestFactory3() {
        try {

            KeyStore keyStore = KeyStore.getInstance("PKCS12");

            keyStore.load(new FileInputStream(new File(keystoreLocation)),
                    keystorePassword.toCharArray());

            TrustStrategy acceptingTrustStrategy = (chain, authType) -> true;

            SSLContext sslContext = SSLContexts.custom()
                    .loadKeyMaterial(keyStore, keystorePassword.toCharArray())
                    .loadTrustMaterial(null, acceptingTrustStrategy)
                    .build();

            HttpClient httpClient = HttpClients.custom()
                    .setSslcontext(sslContext)

                    .build();

            HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
            requestFactory.setHttpClient(httpClient);

            return requestFactory;

        } catch (Exception e) {
            logger.error("Error", e);
        }
        return null;
    }


}
