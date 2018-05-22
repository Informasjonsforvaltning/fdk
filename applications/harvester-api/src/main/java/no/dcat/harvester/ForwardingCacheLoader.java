package no.dcat.harvester;

import com.google.common.cache.CacheLoader;
import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLDecoder;

public class ForwardingCacheLoader extends CacheLoader<URL, String> {
    private static Logger logger = LoggerFactory.getLogger(ForwardingCacheLoader.class);

    @Override
    public String load(URL url) throws Exception {

        logger.debug("load url: {}", url);

        HttpURLConnection connection = (HttpURLConnection) url.openConnection();

        int response = connection.getResponseCode();

        // follow redirect http -> https
        if (response == HttpURLConnection.HTTP_MOVED_TEMP ||
                response == HttpURLConnection.HTTP_MOVED_PERM ||
                response == 307) {

            String location = connection.getHeaderField("Location");
            location = URLDecoder.decode(location, "UTF-8");
            connection.disconnect();

            logger.info("forward url: {} ::: {} -> {}", response, url.toString(), location);

            url = new URL(location);
        }

        InputStream inputStream = url.openStream();
        String result = IOUtils.toString(inputStream);
        inputStream.close();

        return result;
    }

}
