package no.dcat.harvester.crawler.converters;

import com.google.common.cache.LoadingCache;
import no.dcat.harvester.ForwardingCacheLoader;
import no.dcat.harvester.HarvesterApplication;
import org.apache.commons.io.IOUtils;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.powermock.api.mockito.PowerMockito;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;

import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;

import static org.mockito.Matchers.anyString;
import static org.hamcrest.Matchers.*;


@RunWith(PowerMockRunner.class)
@PrepareForTest({ URL.class, URLConnection.class, LoadingCache.class, ForwardingCacheLoader.class} )
public class ForwardingCacheLoaderTest {

    @InjectMocks
    ForwardingCacheLoader app;

    @Mock
    URL url, url1;

    @Test
    public void testForwardRequests() throws Exception {

        String urlString = "http://data.brreg.no/enhetsregisteret/enhet/123344555";
        String locationString = "https://data.brreg.no/enhetsregisteret/enhet/123344555";

        HttpURLConnection connection = PowerMockito.mock(HttpURLConnection.class);
        InputStream inputStream = PowerMockito.mock(InputStream.class);

        PowerMockito.when(url.openConnection()).thenReturn(connection);
        PowerMockito.when(url.openStream()).thenReturn(inputStream);

        PowerMockito.when(connection.getResponseCode()).thenReturn(302);
        PowerMockito.when(connection.getHeaderField(anyString())).thenReturn(locationString);

        PowerMockito.whenNew(URL.class).withArguments(locationString).thenReturn(url1);

        PowerMockito.when(url1.openStream()).thenReturn(IOUtils.toInputStream("TEST"));

        String actual = app.load(url);

        Assert.assertThat("openStream returns TEST", actual, is("TEST") );

        PowerMockito.when(connection.getResponseCode()).thenReturn(301);

        actual = app.load(url);

        PowerMockito.when(connection.getResponseCode()).thenReturn(307);

        actual = app.load(url);


    }
}
