package no.dcat.themes.builders;

import no.dcat.shared.SkosCode;
import no.dcat.themes.Controller;
import no.dcat.themes.service.CodesService;
import org.hamcrest.core.Is;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.List;

import static org.junit.Assert.*;
import static org.hamcrest.Matchers.*;

@SpringBootTest
@RunWith(SpringRunner.class)
public class ReferenceTest {

    @Autowired
    private Controller controller;


    @Test
    public void referenceCodelistExists() throws Throwable {
        List<String> codeTypes = controller.codeTypes();
        System.out.println(codeTypes);
        assertThat(codeTypes.stream().anyMatch(t -> t.equals("referencetypes")), is(true));
    }

    @Test
    public void getReferenceCodeOK() throws Throwable {
        List<SkosCode> actual = controller.codes("referencetypes");

        assertThat(actual.size(), is(12));

        assertThat(actual.stream().anyMatch(r -> r.getAuthorityCode().equals("isReferencedBy")),is(true));
    }

    @Test
    public void referenceTypesAreStable() throws Throwable {
        List<SkosCode> actual = controller.codes("referencetypes");

        String expected = "[SkosCode{uri='http://www.w3.org/2002/07/hasVersion', authorityCode='hasVersion', prefLabel={en=Has version, nn=Har versjon, nb=Har versjon}}, SkosCode{uri='http://www.w3.org/2002/07/isPartOf', authorityCode='isPartOf', prefLabel={en=Is Part Of, nn=Er del av, nb=Er en del av}}, SkosCode{uri='http://www.w3.org/2002/07/isReferencedBy', authorityCode='isReferencedBy', prefLabel={en=Is Referenced By, nn=Er referert av, nb=Er referert av}}, SkosCode{uri='http://www.w3.org/2002/07/isReplacedBy', authorityCode='isReplacedBy', prefLabel={en=Is replaced by, nn=Er erstatta av, nb=Er erstattet av}}, SkosCode{uri='http://www.w3.org/2002/07/isRequiredBy', authorityCode='requires', prefLabel={en=Is required by, nn=Er påkravd av, nb=Er påkrevd av}}, SkosCode{uri='http://www.w3.org/2002/07/isVersionOf', authorityCode='isVersionOf', prefLabel={en=Is version of, nn=Er versjon av, nb=Er versjon av}}, SkosCode{uri='http://www.w3.org/2002/07/reference-types', authorityCode='null', prefLabel={nb=Referanse typer}}, SkosCode{uri='http://www.w3.org/2002/07/references', authorityCode='dct:references', prefLabel={en=References, nn=Refererar, nb=Refererer}}, SkosCode{uri='http://www.w3.org/2002/07/relation', authorityCode='relation', prefLabel={en=Has relation to, nn=Er relatert til, nb=Er relatert til}}, SkosCode{uri='http://www.w3.org/2002/07/replaces', authorityCode='replaces', prefLabel={en=Replaces, nn=Erstatter, nb=Erstatter}}, SkosCode{uri='http://www.w3.org/2002/07/requires', authorityCode='requires', prefLabel={en=Requires, nn=Krevjar, nb=Krever}}, SkosCode{uri='http://www.w3.org/2002/07/source', authorityCode='source', prefLabel={en=Source, nn=Er avleda frå, nb=Er avledet fra}}]";
        assertThat(actual.toString(), is(expected) );

    }
}
