package no.dcat.harvester.service;

import no.dcat.shared.Subject;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import static org.junit.Assert.assertThat;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.hamcrest.Matchers.nullValue;

@ActiveProfiles(value = "unit-integration")
@RunWith(SpringRunner.class)
@SpringBootTest
public class ReferenceServiceIT {

    @Autowired
    ReferenceDataSubjectService referenceDataSubjectService;

    @Test
    public void okSubject() throws Throwable {
        Subject actualSubject= referenceDataSubjectService.getSubject("https://data-david.github.io/Begrep/begrep/Enhet");

        assertThat(actualSubject, is(notNullValue()));
    }

    @Test
    public void unableToLookupSubject() throws Throwable {
        Subject actualSubject = referenceDataSubjectService.getSubject("https://this.should.not.work.no/subject/s");

        assertThat(actualSubject, is(nullValue()));
    }
}
