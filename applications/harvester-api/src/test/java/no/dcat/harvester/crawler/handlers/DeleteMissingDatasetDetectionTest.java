package no.dcat.harvester.crawler.handlers;

import org.junit.Test;

import java.util.HashSet;
import java.util.Set;
import static org.junit.Assert.*;
import static org.hamcrest.Matchers.*;

public class DeleteMissingDatasetDetectionTest {

    @Test
    public void delete() throws Throwable {

        Set<String> valid = new HashSet<>();
        valid.add("http://data.brreg.no/datakatalog/dataset/971040823/28");
        valid.add("http://data.brreg.no/datakatalog/dataset/971040823/27");

        assertThat(valid.contains("http://data.brreg.no/datakatalog/dataset/971040823/28"), is(true));

        valid.remove("http://data.brreg.no/datakatalog/dataset/971040823/27");

        assertThat(valid.size(), is(1));
    }
}
