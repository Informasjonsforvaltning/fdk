package no.dcat.portal.query;


import no.dcat.shared.testcategories.UnitTest;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StreamUtils;

import java.nio.charset.Charset;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.spy;

@Category(UnitTest.class)
public class PublisherServiceTest {
    private static Logger logger = LoggerFactory.getLogger(PublisherServiceTest.class);

    @Test
    public void sortDepartmenetsTest() throws Throwable {

        ClassPathResource resource = new ClassPathResource("publishers2018-01-19.json");
        String publishersRaw = StreamUtils.copyToString(resource.getInputStream(), Charset.forName("utf-8"));
        ResponseEntity<String> response = new ResponseEntity<>(publishersRaw, HttpStatus.OK);

        PublisherQueryService service = new PublisherQueryService();
        PublisherQueryService spyService = spy(service);
        doReturn(response).when(spyService).publishers("");

        ResponseEntity<PublisherQueryService.Hits> actual = spyService.publisherNames();

        assertThat(actual.getStatusCode(), is(HttpStatus.OK));

        PublisherQueryService.Hits hits = actual.getBody();

        PublisherQueryService.PublisherHit staten = hits.getHits().stream().filter(publisher -> publisher.name.equals("STAT")).findFirst().get();

        int firstDepartmentCounter = 0, noDepartmentCounter = 0;
        boolean departmentFirst = true;
        for (PublisherQueryService.PublisherHit publisher : staten.getChildren()) {
            logger.debug(publisher.name);

            boolean containsDep = publisher.name.toLowerCase().contains("departement");

            // only count departments if they are first in list
            if (departmentFirst && containsDep) {
                firstDepartmentCounter++;
            }

            // Count non departments and make sure we no longer count departments
            if (!containsDep) {
                departmentFirst = false;
                noDepartmentCounter++;
            }

        }

        int total = firstDepartmentCounter + noDepartmentCounter;

        assertThat("The total of the firstdepartment counts and the non departmentcounts should match", staten.getChildren().size(), is(total));
        assertThat(firstDepartmentCounter, is(15));
        assertThat(noDepartmentCounter, is(5));

    }
}
