package no.dcat.configuration;

import javax.servlet.http.HttpServletRequest;
import java.net.MalformedURLException;
import java.net.URL;

public class Referer {

    public static String getReferer(HttpServletRequest request) throws MalformedURLException {
        String referer = request.getHeaders("referer").nextElement();
        URL url1 = new URL(referer);
        String port = url1.getPort() != -1 ? ":" + url1.getPort() : "";
        referer = url1.getProtocol() + "://" + url1.getHost() + port + "/";

        return referer;
    }
}
