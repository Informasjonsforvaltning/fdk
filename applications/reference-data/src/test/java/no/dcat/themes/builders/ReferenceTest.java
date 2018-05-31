package no.dcat.themes.builders;

import no.dcat.shared.SkosCode;
import no.dcat.shared.testcategories.UnitTest;
import no.dcat.themes.Controller;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.List;

import static org.junit.Assert.*;
import static org.hamcrest.Matchers.*;

@SpringBootTest
@RunWith(SpringRunner.class)
@Category(UnitTest.class)
public class ReferenceTest {

    @Autowired
    private Controller controller;


    @Test
    public void referenceCodelistExists() throws Throwable {
        List<String> codeTypes = controller.codeTypes();

        assertThat(codeTypes.stream().anyMatch(t -> t.equals("referencetypes")), is(true));
    }

    @Test
    public void getReferenceCodeOK() throws Throwable {
        List<SkosCode> actual = controller.codes("referencetypes");

        assertThat(actual.size(), is(12));

        assertThat(actual.stream().anyMatch(r -> r.getCode().equals("isReferencedBy")),is(true));
    }

    @Test
    public void referenceTypesAreStable() throws Throwable {
        List<SkosCode> actual = controller.codes("referencetypes");

        String expected = "[SkosCode{uri='dct:hasVersion', code='hasVersion', prefLabel={en=Has version, nn=Har versjon, nb=Har versjon}}, SkosCode{uri='dct:isPartOf', code='isPartOf', prefLabel={en=Is Part Of, nn=Er del av, nb=Er en del av}}, SkosCode{uri='dct:isReferencedBy', code='isReferencedBy', prefLabel={en=Is Referenced By, nn=Er referert av, nb=Er referert av}}, SkosCode{uri='dct:isReplacedBy', code='isReplacedBy', prefLabel={en=Is replaced by, nn=Er erstatta av, nb=Er erstattet av}}, SkosCode{uri='dct:isRequiredBy', code='requires', prefLabel={en=Is required by, nn=Er påkravd av, nb=Er påkrevd av}}, SkosCode{uri='dct:isVersionOf', code='isVersionOf', prefLabel={en=Is version of, nn=Er versjon av, nb=Er versjon av}}, SkosCode{uri='dct:references', code='references', prefLabel={en=References, nn=Refererar, nb=Refererer}}, SkosCode{uri='dct:relation', code='relation', prefLabel={en=Has relation to, nn=Er relatert til, nb=Er relatert til}}, SkosCode{uri='dct:replaces', code='replaces', prefLabel={en=Replaces, nn=Erstatter, nb=Erstatter}}, SkosCode{uri='dct:requires', code='requires', prefLabel={en=Requires, nn=Krevjar, nb=Krever}}, SkosCode{uri='dct:source', code='source', prefLabel={en=Source, nn=Er avleda frå, nb=Er avledet fra}}, SkosCode{uri='http://purl.org/dc/terms/reference-types', code='null', prefLabel={nb=Referanse typer}}]";
        assertThat(actual.toString(), is(expected) );

    }
}
