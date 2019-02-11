package no.dcat.htmlclean;

import no.fdk.test.testcategories.UnitTest;
import org.hamcrest.Matchers;
import org.junit.Test;
import org.junit.experimental.categories.Category;

import static org.hamcrest.core.Is.is;
import static org.junit.Assert.assertThat;

@Category(UnitTest.class)
public class HtmlCleanerTest {

    private String description = "<p>Datasettet inneholder tekstlige beskrivelser og klassifisering av over 550 yrker. Yrkene er skrevet av redaksjonen hos <a href=\"https://utdanning.no\">utdanning.no</a> og kvalitetssikres jevnlig av over 200 organisasjoner i arbeidslivet.</p><p><strong>Navngiving</strong>Dersom du benytter yrkesbeskrivelsene ber vi om at endringer og tillegg merkes, og at du henviser til kilden p\u00e5 f\u00f8lgende m\u00e5te: &quot;Yrkesbeskrivelsen er basert p\u00e5 \u00e5pne data fra <a href=\"https://utdanning.no\">utdanning.no</a> og er underlagt Norsk lisens for offentlige data (<a href=\"https://data.norge.no/nlod/no\">NLOD</a>). Teksten vedlikeholdes p\u00e5 <a href=\"https://utdanning.no/interesseoversikt#/yrker/\">yrkessiden</a> p\u00e5 <a href=\"https://utdanning.no\">utdanning.no</a>.&quot;</p><p><strong>Relaterte kodeverk</strong>Yrkene er klassifisert etter standard for yrkesklassifisering (<a href=\"https://www.ssb.no/a/yrke/\">STYRK98</a>), norsk standard for utdanningsgruppering (<a href=\"https://www.ssb.no/utdanning/artikler-og-publikasjoner/nus2000\">NUS2000</a>) og interesser, samt at de inneholder lenker til intervju av yrkesut\u00f8vere.</p><p><strong>Hvordan benytte datasettet?</strong>Datasettet er XML-basert og lister ut alle yrker i Atom-format. Innholdet er s\u00f8kbart slik at det er mulig \u00e5 bare hente ut yrker basert p\u00e5 for eksempel STYRK, NUS, interesser, friteksts\u00f8k eller en kombinasjon av disse. Eksempler p\u00e5 bruk f\u00f8lger.</p><p>Hente ut alle yrker som er klassifisert med NUS-koder som starter med 45 eller 46,&nbsp; &quot;Naturvitenskapelige fag, h\u00e5ndverksfag og tekniske fag&quot;, videreg\u00e5ende avsluttende utdanning eller grunnutdanning:&nbsp;- <a href=\"https://utdanning.no/data/atom/yrke?fq=sm_field_nus_field_nus_code:(45 OR 35)\">https://utdanning.no/data/atom/yrke?fq=sm_field_nus_field_nus_code:(45 OR 35)</a></p><p>Hente ut alle yrker som er merket med interessen helse:&nbsp;- <a href=\"https://utdanning.no/data/atom/yrke?fq=sm_field_interesse_label:helse\">https://utdanning.no/data/atom/yrke?fq=sm_field_interesse_label:helse</a></p><p>Hente ut alle yrker som er merket med yrkesklassifiseringskode 7134116, &quot;L\u00e6rling (r\u00f8rlegger)&quot;:&nbsp;- <a href=\"https://utdanning.no/data/atom/yrke?fq=sm_field_styrk98_field_code_styrk:7134116\">https://utdanning.no/data/atom/yrke?fq=sm_field_styrk98_field_code_styrk:7134116</a></p><p>Friteksts\u00f8k i yrkesbasen:&nbsp;- <a href=\"https://utdanning.no/data/atom/yrke?q=r\u00f8rlegger\">https://utdanning.no/data/atom/yrke?q=r\u00f8rlegger</a></p><p>En kan ogs\u00e5 kombinere og s\u00f8ke etter flere kriterier p\u00e5 en gang:&nbsp;- <a href=\"https://utdanning.no/data/atom/yrke?q=r\u00f8rlegger&amp;fq=sm_field_styrk98_field_code_styrk:7134116&amp;fq=sm_field_nus_field_nus_code:45\">https://utdanning.no/data/atom/yrke?q=r\u00f8rlegger&amp;fq=sm_field_styrk98_field_code_styrk:7134116&amp;fq=sm_field_nus_field_nus_code:45</a>&nbsp;- Friteksts\u00f8k: r\u00f8rlegger&nbsp;- FIltrere p\u00e5 yrker som er tagget med yrkesklassifisering &quot;L\u00e6rling (r\u00f8rlegger)&quot;&nbsp;- Filtrere p\u00e5 yrker som er tagget med utdanningsgruppering &quot;Naturvitenskapelige fag, h\u00e5ndverksfag og tekniske fag&quot; (Videreg\u00e5ende, avsluttende utdanning)</p>";

    @Test
    public void clean_noHtml_sameText() throws Exception {
        String testString = "Test";
        assertThat(HtmlCleaner.clean(testString), is(testString));
    }

    @Test
    public void nullInputResultsInNullReturned() {
        assertThat(HtmlCleaner.clean(null), is(Matchers.nullValue()));
        assertThat(HtmlCleaner.cleanAllHtmlTags(null), is(Matchers.nullValue()));
    }

    @Test
    public void clean_multipleConvertions() throws Exception {
        cleanAndAssert("Test <H1> Text", "Test Text");
        cleanAndAssert("Test <script>evilJavascriptCode('dangerous')</script> Text \n test", "Test Text \n test");
        cleanAndAssert("Test &nbsp;<H1> Text", "Test Text");
        cleanAndAssert("<a href='someurl' onClick='stealCoockies()'>click me</a>", "<a rel=\"nofollow\">click me</a>");
    }

    @Test
    public void cleanAll_multipleConvertions() {
        cleanAllAndAssert("Test <BR /> Text", "Test Text");
        cleanAllAndAssert("Test <BR /> Text \n test", "Test Text \n test");
        cleanAllAndAssert("Test <P /> Text \n test", "Test Text \n test");
        cleanAllAndAssert("Test <P/> Text \n test", "Test Text \n test");
        cleanAllAndAssert("Test <P> Text \n test", "Test Text \n test");
    }

    private void cleanAllAndAssert(String input, String expected) {
        assertThat(HtmlCleaner.cleanAllHtmlTags(input), is(expected));
    }

    private void cleanAndAssert(String input, String expected) {
        assertThat(HtmlCleaner.clean(input), is(expected));
    }

    @Test
    public void cleanDifi() throws Throwable {

        String actual = HtmlCleaner.clean(description);

        assertThat(actual, is("<p>Datasettet inneholder tekstlige beskrivelser og klassifisering av over 550 yrker. Yrkene er skrevet av redaksjonen hos <a href=\"https://utdanning.no\" rel=\"nofollow\">utdanning.no</a> og kvalitetssikres jevnlig av over 200 organisasjoner i arbeidslivet.</p><p><strong>Navngiving</strong>Dersom du benytter yrkesbeskrivelsene ber vi om at endringer og tillegg merkes, og at du henviser til kilden på følgende måte: \"Yrkesbeskrivelsen er basert på åpne data fra <a href=\"https://utdanning.no\" rel=\"nofollow\">utdanning.no</a> og er underlagt Norsk lisens for offentlige data (<a href=\"https://data.norge.no/nlod/no\" rel=\"nofollow\">NLOD</a>). Teksten vedlikeholdes på <a href=\"https://utdanning.no/interesseoversikt#/yrker/\" rel=\"nofollow\">yrkessiden</a> på <a href=\"https://utdanning.no\" rel=\"nofollow\">utdanning.no</a>.\"</p><p><strong>Relaterte kodeverk</strong>Yrkene er klassifisert etter standard for yrkesklassifisering (<a href=\"https://www.ssb.no/a/yrke/\" rel=\"nofollow\">STYRK98</a>), norsk standard for utdanningsgruppering (<a href=\"https://www.ssb.no/utdanning/artikler-og-publikasjoner/nus2000\" rel=\"nofollow\">NUS2000</a>) og interesser, samt at de inneholder lenker til intervju av yrkesutøvere.</p><p><strong>Hvordan benytte datasettet?</strong>Datasettet er XML-basert og lister ut alle yrker i Atom-format. Innholdet er søkbart slik at det er mulig å bare hente ut yrker basert på for eksempel STYRK, NUS, interesser, fritekstsøk eller en kombinasjon av disse. Eksempler på bruk følger.</p><p>Hente ut alle yrker som er klassifisert med NUS-koder som starter med 45 eller 46, \"Naturvitenskapelige fag, håndverksfag og tekniske fag\", videregående avsluttende utdanning eller grunnutdanning: - <a href=\"https://utdanning.no/data/atom/yrke?fq=sm_field_nus_field_nus_code:(45 OR 35)\" rel=\"nofollow\">https://utdanning.no/data/atom/yrke?fq=sm_field_nus_field_nus_code:(45 OR 35)</a></p><p>Hente ut alle yrker som er merket med interessen helse: - <a href=\"https://utdanning.no/data/atom/yrke?fq=sm_field_interesse_label:helse\" rel=\"nofollow\">https://utdanning.no/data/atom/yrke?fq=sm_field_interesse_label:helse</a></p><p>Hente ut alle yrker som er merket med yrkesklassifiseringskode 7134116, \"Lærling (rørlegger)\": - <a href=\"https://utdanning.no/data/atom/yrke?fq=sm_field_styrk98_field_code_styrk:7134116\" rel=\"nofollow\">https://utdanning.no/data/atom/yrke?fq=sm_field_styrk98_field_code_styrk:7134116</a></p><p>Fritekstsøk i yrkesbasen: - <a href=\"https://utdanning.no/data/atom/yrke?q=rørlegger\" rel=\"nofollow\">https://utdanning.no/data/atom/yrke?q=rørlegger</a></p><p>En kan også kombinere og søke etter flere kriterier på en gang: - <a href=\"https://utdanning.no/data/atom/yrke?q=rørlegger&amp;fq=sm_field_styrk98_field_code_styrk:7134116&amp;fq=sm_field_nus_field_nus_code:45\" rel=\"nofollow\">https://utdanning.no/data/atom/yrke?q=rørlegger&amp;fq=sm_field_styrk98_field_code_styrk:7134116&amp;fq=sm_field_nus_field_nus_code:45</a> - Fritekstsøk: rørlegger - FIltrere på yrker som er tagget med yrkesklassifisering \"Lærling (rørlegger)\" - Filtrere på yrker som er tagget med utdanningsgruppering \"Naturvitenskapelige fag, håndverksfag og tekniske fag\" (Videregående, avsluttende utdanning)</p>"));
    }


    @Test
    public void cleanAll() throws Throwable {

        String actual = HtmlCleaner.cleanAllHtmlTags(description);

        assertThat(actual, is("Datasettet inneholder tekstlige beskrivelser og klassifisering av over 550 yrker. Yrkene er skrevet av redaksjonen hos utdanning.no og kvalitetssikres jevnlig av over 200 organisasjoner i arbeidslivet.NavngivingDersom du benytter yrkesbeskrivelsene ber vi om at endringer og tillegg merkes, og at du henviser til kilden på følgende måte: \"Yrkesbeskrivelsen er basert på åpne data fra utdanning.no og er underlagt Norsk lisens for offentlige data (NLOD). Teksten vedlikeholdes på yrkessiden på utdanning.no.\"Relaterte kodeverkYrkene er klassifisert etter standard for yrkesklassifisering (STYRK98), norsk standard for utdanningsgruppering (NUS2000) og interesser, samt at de inneholder lenker til intervju av yrkesutøvere.Hvordan benytte datasettet?Datasettet er XML-basert og lister ut alle yrker i Atom-format. Innholdet er søkbart slik at det er mulig å bare hente ut yrker basert på for eksempel STYRK, NUS, interesser, fritekstsøk eller en kombinasjon av disse. Eksempler på bruk følger.Hente ut alle yrker som er klassifisert med NUS-koder som starter med 45 eller 46, \"Naturvitenskapelige fag, håndverksfag og tekniske fag\", videregående avsluttende utdanning eller grunnutdanning: - https://utdanning.no/data/atom/yrke?fq=sm_field_nus_field_nus_code:(45 OR 35)Hente ut alle yrker som er merket med interessen helse: - https://utdanning.no/data/atom/yrke?fq=sm_field_interesse_label:helseHente ut alle yrker som er merket med yrkesklassifiseringskode 7134116, \"Lærling (rørlegger)\": - https://utdanning.no/data/atom/yrke?fq=sm_field_styrk98_field_code_styrk:7134116Fritekstsøk i yrkesbasen: - https://utdanning.no/data/atom/yrke?q=rørleggerEn kan også kombinere og søke etter flere kriterier på en gang: - https://utdanning.no/data/atom/yrke?q=rørlegger&amp;fq=sm_field_styrk98_field_code_styrk:7134116&amp;fq=sm_field_nus_field_nus_code:45 - Fritekstsøk: rørlegger - FIltrere på yrker som er tagget med yrkesklassifisering \"Lærling (rørlegger)\" - Filtrere på yrker som er tagget med utdanningsgruppering \"Naturvitenskapelige fag, håndverksfag og tekniske fag\" (Videregående, avsluttende utdanning)"));
    }

}
