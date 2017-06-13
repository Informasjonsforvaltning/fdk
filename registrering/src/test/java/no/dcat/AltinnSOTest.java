package no.dcat;

import org.apache.http.HttpHost;
import org.apache.http.client.AuthCache;
import org.apache.http.client.HttpClient;
import org.apache.http.conn.ssl.NoopHostnameVerifier;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.conn.ssl.TrustStrategy;
import org.apache.http.impl.auth.DigestScheme;
import org.apache.http.impl.client.BasicAuthCache;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.ssl.SSLContexts;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.ClientHttpRequestFactory;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

import javax.crypto.SecretKey;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.KeyManagerFactory;
import javax.net.ssl.SSLContext;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URL;
import java.nio.charset.Charset;
import java.security.KeyStore;
import java.security.SecureRandom;
import java.security.cert.X509Certificate;

/**
 * Created by dask on 07.06.2017.
 */

// -Djavax.net.ssl.keyStore=D:/altinn/brreg.jks -Djavax.net.ssl.keyStorePassword=keystore

public class AltinnSOTest {
    private static final String ksPassword = "xEPtHApswvpiNHTp";
    private static final String apikey = "7FB6140D-B194-4BF6-B3C8-257094FBF8C4";

    private static Logger logger = LoggerFactory.getLogger(AltinnSOTest.class);


    @Test
    public void redirect() throws Throwable {


        RestTemplate restTemplate = new RestTemplate(getRequestFactory3());
        HttpHeaders headers = new HttpHeaders();
        headers.set("ApiKey", apikey);
        headers.set("Accept", "application/hal+json");

        ResponseEntity<String> response = restTemplate.exchange("https://tt02.altinn.no/api/serviceowner/reportees?subject=01116100572&servicecode=3811&serviceedition=201501",
                HttpMethod.GET, null,
                String.class, headers);

        logger.info("Response {}", response.getStatusCodeValue());

    }

    ClientHttpRequestFactory getRequestFactory3() {
        try {
            KeyStore keyStore = KeyStore.getInstance("PKCS12");

            keyStore.load(new FileInputStream(new File("D://altinn/Buypass ID-REGISTERENHETEN I BRØNNØYSUND-serienummer4659019343921797777264492-2014-06-06.p12")),
                    ksPassword.toCharArray());


            KeyStore.Entry entry = keyStore.getEntry("registerenheten i brønnøysund", new KeyStore.PasswordProtection(ksPassword.toCharArray()));

            logger.info("Entry: {}", entry.getAttributes());

            AuthCache authCache = new BasicAuthCache();
            DigestScheme digestAuth = new DigestScheme();
            authCache.put(new HttpHost("localhost", 8099, "https"), digestAuth);

            
            TrustStrategy acceptingTrustStrategy = ( chain, authType) -> true;

            SSLContext sslContext = SSLContexts.custom()
                    .loadKeyMaterial(keyStore, ksPassword.toCharArray())
                    .loadTrustMaterial(null, acceptingTrustStrategy)

                    .build();

            HttpClient httpClient = HttpClients.custom()
                    .setSslcontext(sslContext)
                    .build();

            HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();

            requestFactory.setHttpClient(httpClient);
            return requestFactory;
        } catch (Exception e) {
            logger.error("Error",e);
        }
        return null;
    }

    ClientHttpRequestFactory getRequestFactory2() {
        try {
            TrustStrategy acceptingTrustStrategy = ( chain, authType) -> true;

            SSLContext sslContext = org.apache.http.ssl.SSLContexts.custom()
                    .loadTrustMaterial(null, acceptingTrustStrategy)
                    .build();

            SSLConnectionSocketFactory csf = new SSLConnectionSocketFactory(sslContext);

            CloseableHttpClient httpClient = HttpClients.custom().setSSLSocketFactory(csf).build();

            HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();

            requestFactory.setHttpClient(httpClient);
            return requestFactory;

        } catch (Exception e) {
            logger.error("Exception RF2", e);
        }

        return null;
    }

    ClientHttpRequestFactory getRequestFactory1() {

        try {
            KeyStore keyStore = KeyStore.getInstance("PKCS12"); //KeyStore.getDefaultType());
            keyStore.load(new FileInputStream(new File("D://altinn/Buypass ID-REGISTERENHETEN I BRØNNØYSUND-serienummer4659019343921797777264492-2014-06-06.p12")),
                    ksPassword.toCharArray());

            SSLContext sslcontext = SSLContexts.custom()
                    .loadKeyMaterial(keyStore, ksPassword.toCharArray())
                    .build();

            /*
            SSLConnectionSocketFactory socketFactory = new SSLConnectionSocketFactory(
                    new SSLContextBuilder()
                            //.loadTrustMaterial(null, new TrustSelfSignedStrategy())
                            .loadKeyMaterial(keyStore, "xEPtHApswvpiNHTp".toCharArray()).build());

            HttpClient httpClient = HttpClients.custom().setSSLSocketFactory(socketFactory).build();
            ClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory(
                    httpClient);*/
            SSLConnectionSocketFactory sslsf = new SSLConnectionSocketFactory(sslcontext);

            CloseableHttpClient httpclient = HttpClients.custom()
                    .setSSLSocketFactory(sslsf).build();

            ClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory(
                    httpclient);

            return requestFactory;
        } catch (Exception e) {
            logger.error("Exception ", e);
        }
        return null;
    }

    // source: http://vafer.org/blog/20061010073725/
    ClientHttpRequestFactory getRequestFactory4() {
        String pKeyPassword = ksPassword;
        try {
            KeyManagerFactory keyManagerFactory = KeyManagerFactory.getInstance("SunX509");
            KeyStore keyStore = KeyStore.getInstance("PKCS12");

            keyStore.load(new FileInputStream(new File("D://altinn/Buypass ID-REGISTERENHETEN I BRØNNØYSUND-serienummer4659019343921797777264492-2014-06-06.p12")),
                    pKeyPassword.toCharArray());

            keyManagerFactory.init(keyStore, pKeyPassword.toCharArray());

            SSLContext context = SSLContext.getInstance("TLS");
            context.init(keyManagerFactory.getKeyManagers(), null, new SecureRandom());
            /*
            URL url = new URL("https://tt02.altinn.no/api/serviceowner/reportees?subject=01116100572&servicecode=3811&serviceedition=201501");
            HttpsURLConnection con = (HttpsURLConnection) url.openConnection();
            con.setSSLSocketFactory(context.getSocketFactory());

            String result = readStream(con.getInputStream());
            logger.info(result);
*/

            SSLConnectionSocketFactory sslsf = new SSLConnectionSocketFactory(context);

            CloseableHttpClient httpclient = HttpClients.custom()
                    .setSSLSocketFactory(sslsf).build();

            ClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory(
                    httpclient);

            return requestFactory;

        } catch (Exception e) {
            logger.error("RF4",e);
        }
        return null;
    }

    private static String readStream(InputStream is) throws IOException {
        final BufferedReader reader = new BufferedReader(new InputStreamReader(is, Charset.forName("UTF-8")));
        StringBuilder total = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            total.append(line);
        }
        if (reader != null) {
            reader.close();
        }
        return total.toString();
    }

}
