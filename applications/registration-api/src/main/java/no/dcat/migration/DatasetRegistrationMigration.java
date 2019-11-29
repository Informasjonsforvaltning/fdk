package no.dcat.migration;

import lombok.RequiredArgsConstructor;
import no.dcat.model.Dataset;
import no.dcat.repository.DatasetRepository;
import no.dcat.shared.DataTheme;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;

@Configuration
@RequiredArgsConstructor
public class DatasetRegistrationMigration {
    private final DatasetRepository datasetRepository;
    private final Map<String, String> uriConversionMap = Stream.of(new String[][]{
        //remove also empty uris, it is unknown where they came from
        {"", "0"},
        //fix potential earlier migration error
        {"http://psi.norge.no/los/3/ord/arbeidsavtale", "http://psi.norge.no/los/ord/arbeidsavtale"},
        {"http://psi.norge.no/los/3/tema/dodsfall-og-gravferd", "http://psi.norge.no/los/tema/dodsfall-og-gravferd"},
        {"http://psi.norge.no/los/3/ord/omsorgsavlastning", "http://psi.norge.no/los/ord/omsorgsavlastning"},
        {"http://psi.norge.no/los/3/ord/vann-og-avlop", "http://psi.norge.no/los/ord/vann-og-avlop"},
        {"http://psi.norge.no/los/3/ord/avlosertilskudd", "http://psi.norge.no/los/ord/avlosertilskudd"},
        {"http://psi.norge.no/los/3/ord/balbrenning", "http://psi.norge.no/los/ord/balbrenning"},
        {"http://psi.norge.no/los/3/ord/batforerbevis", "http://psi.norge.no/los/ord/batforerbevis"},
        {"http://psi.norge.no/los/3/ord/batplass", "http://psi.norge.no/los/ord/batplass"},
        {"http://psi.norge.no/los/3/ord/fritidsskippersertifikat", "http://psi.norge.no/los/ord/fritidsskippersertifikat"},
        {"http://psi.norge.no/los/3/tema/barnehage", "http://psi.norge.no/los/tema/barnehage"},
        {"http://psi.norge.no/los/3/ord/reguleringsplan", "http://psi.norge.no/los/ord/reguleringsplan"},
        {"http://psi.norge.no/los/3/ord/starte-eller-avslutte-bedrift", "http://psi.norge.no/los/ord/starte-eller-avslutte-bedrift"},
        {"http://psi.norge.no/los/3/ord/bominformasjon", "http://psi.norge.no/los/ord/bominformasjon"},
        {"http://psi.norge.no/los/3/ord/bostotte", "http://psi.norge.no/los/ord/bostotte"},
        {"http://psi.norge.no/los/3/tema/brann", "http://psi.norge.no/los/tema/brann"},
        // migrate from v2 to v3
        {"http://psi.norge.no/los/ord/alkoholsalg", "0"},
        {"http://psi.norge.no/los/ord/angrerett", "0"},
        {"http://psi.norge.no/los/ord/arbeidsmiljoe", "http://psi.norge.no/los/ord/arbeidsmiljo"},
        {"http://psi.norge.no/los/ord/arbeidssoeking", "http://psi.norge.no/los/tema/arbeidssoking"},
        {"http://psi.norge.no/los/ord/arbeidstid", "http://psi.norge.no/los/ord/arbeidsavtale"},
        {"http://psi.norge.no/los/ord/arv-og-gaver", "http://psi.norge.no/los/tema/dodsfall-og-gravferd"},
        {"http://psi.norge.no/los/ord/avlastningsbolig", "http://psi.norge.no/los/ord/omsorgsavlastning"},
        {"http://psi.norge.no/los/ord/avlastningshjem", "http://psi.norge.no/los/ord/omsorgsavlastning"},
        {"http://psi.norge.no/los/ord/avloepshaandtering", "http://psi.norge.no/los/ord/vann-og-avlop"},
        {"http://psi.norge.no/los/ord/avloesertilskudd", "http://psi.norge.no/los/ord/avlosertilskudd"},
        {"http://psi.norge.no/los/ord/baalbrenning", "http://psi.norge.no/los/ord/balbrenning"},
        {"http://psi.norge.no/los/ord/baatfoererbevis", "http://psi.norge.no/los/ord/batforerbevis"},
        {"http://psi.norge.no/los/ord/baatplass", "http://psi.norge.no/los/ord/batplass"},
        {"http://psi.norge.no/los/ord/baatsertifikat", "http://psi.norge.no/los/ord/fritidsskippersertifikat"},
        {"http://psi.norge.no/los/ord/barnepark", "http://psi.norge.no/los/tema/barnehage"},
        {"http://psi.norge.no/los/ord/bebyggelsesplan", "http://psi.norge.no/los/ord/reguleringsplan"},
        {"http://psi.norge.no/los/ord/bedriftsetablering", "http://psi.norge.no/los/ord/starte-eller-avslutte-bedrift"},
        {"http://psi.norge.no/los/ord/besoekshjem", "http://psi.norge.no/los/ord/besokshjem"},
        {"http://psi.norge.no/los/ord/bompenger", "http://psi.norge.no/los/ord/bominformasjon"},
        {"http://psi.norge.no/los/ord/bostoette", "http://psi.norge.no/los/ord/bostotte"},
        {"http://psi.norge.no/los/ord/brannvern-og-eksplosjonsvern", "http://psi.norge.no/los/tema/brann"},
        {"http://psi.norge.no/los/ord/bransjekrav", "0"},
        {"http://psi.norge.no/los/ord/broeyting", "http://psi.norge.no/los/ord/broyting"},
        {"http://psi.norge.no/los/ord/byggekostnad", "http://psi.norge.no/los/ord/boligfinansiering"},
        {"http://psi.norge.no/los/ord/daap", "0"},
        {"http://psi.norge.no/los/ord/dans", "http://psi.norge.no/los/ord/kulturtilbud"},
        {"http://psi.norge.no/los/ord/designbeskyttelse", "http://psi.norge.no/los/ord/patent-design-og-varemerke"},
        {"http://psi.norge.no/los/ord/doedsattest", "http://psi.norge.no/los/ord/dodsattest"},
        {"http://psi.norge.no/los/ord/doedsmelding", "http://psi.norge.no/los/ord/dodsattest"},
        {"http://psi.norge.no/los/ord/doevetolk", "http://psi.norge.no/los/ord/tolketjeneste"},
        {"http://psi.norge.no/los/ord/ektefellepensjon", "http://psi.norge.no/los/ord/gjenlevendepensjon"},
        {"http://psi.norge.no/los/ord/ekteskap", "http://psi.norge.no/los/tema/ekteskap"},
        {"http://psi.norge.no/los/ord/eldresenter", "http://psi.norge.no/los/ord/seniortilbud"},
        {"http://psi.norge.no/los/ord/engangsstoenad", "http://psi.norge.no/los/ord/ytelser-til-foreldre-og-foresatte"},
        {"http://psi.norge.no/los/ord/ernaering", "http://psi.norge.no/los/ord/ernaring"},
        {"http://psi.norge.no/los/ord/etablering-av-barnehage", "http://psi.norge.no/los/ord/starte-eller-avslutte-bedrift"},
        {"http://psi.norge.no/los/ord/etisk-forbruk", "0"},
        {"http://psi.norge.no/los/ord/fagopplaering", "http://psi.norge.no/los/ord/fag--og-yrkesopplaring"},
        {"http://psi.norge.no/los/ord/familievern", "http://psi.norge.no/los/ord/stotte-til-familier"},
        {"http://psi.norge.no/los/ord/farskap", "http://psi.norge.no/los/ord/farskapserklaring"},
        {"http://psi.norge.no/los/ord/fastlege", "http://psi.norge.no/los/ord/legehjelp"},
        {"http://psi.norge.no/los/ord/ferdigattest", "http://psi.norge.no/los/ord/byggesak"},
        {"http://psi.norge.no/los/ord/ferie", "http://psi.norge.no/los/ord/ferie-og-fridager"},
        {"http://psi.norge.no/los/ord/film-og-videokonsesjon", "0"},
        {"http://psi.norge.no/los/ord/fiskeriforvaltning", "0"},
        {"http://psi.norge.no/los/ord/flagg", "0"},
        {"http://psi.norge.no/los/ord/foedselsattest", "http://psi.norge.no/los/ord/fodselsattest"},
        {"http://psi.norge.no/los/ord/foedselsnummer", "http://psi.norge.no/los/ord/fodselsnummer"},
        {"http://psi.norge.no/los/ord/foererkort", "http://psi.norge.no/los/ord/forerkort"},
        {"http://psi.norge.no/los/ord/folkehoegskole", "http://psi.norge.no/los/tema/skole-og-utdanning"},
        {"http://psi.norge.no/los/ord/forbrukerklage", "0"},
        {"http://psi.norge.no/los/ord/forbrukertest", "0"},
        {"http://psi.norge.no/los/ord/forbruksutgifter", "0"},
        {"http://psi.norge.no/los/ord/foreldrepenger", "http://psi.norge.no/los/ord/ytelser-til-foreldre-og-foresatte"},
        {"http://psi.norge.no/los/ord/foretaksregistrering", "http://psi.norge.no/los/ord/starte-eller-avslutte-bedrift"},
        {"http://psi.norge.no/los/ord/forsoergingstillegg", "http://psi.norge.no/los/ord/stonad-til-enslig-forsorger"},
        {"http://psi.norge.no/los/ord/fortjenstmedaljer-og-ordener", "0"},
        {"http://psi.norge.no/los/ord/friomraade", "http://psi.norge.no/los/ord/friomrade"},
        {"http://psi.norge.no/los/ord/frisoer-hudpleie-tatoverings-og-hulltakingsvirksomhet", "http://psi.norge.no/los/ord/bevilling-og-tillatelser"},
        {"http://psi.norge.no/los/ord/garanti", "0"},
        {"http://psi.norge.no/los/ord/gjeldsraadgivning", "http://psi.norge.no/los/ord/okonomisk-radgiving"},
        {"http://psi.norge.no/los/ord/gravsted", "http://psi.norge.no/los/ord/gravplass"},
        {"http://psi.norge.no/los/ord/grunnskoleopplaering-for-voksne", "http://psi.norge.no/los/ord/grunnskole-for-voksne"},
        {"http://psi.norge.no/los/ord/habilitering-og-rehabilitering", "http://psi.norge.no/los/ord/rehabilitering"},
        {"http://psi.norge.no/los/ord/hjelpemidler", "http://psi.norge.no/los/tema/hjelpemidler"},
        {"http://psi.norge.no/los/ord/hoegskole-og-universitet", "http://psi.norge.no/los/ord/hogskole-og-universitet"},
        {"http://psi.norge.no/los/ord/hovedavtalen", "0"},
        {"http://psi.norge.no/los/ord/husdyrhold", "http://psi.norge.no/los/ord/dyrehold"},
        {"http://psi.norge.no/los/ord/import", "0"},
        {"http://psi.norge.no/los/ord/individuell-plan", "http://psi.norge.no/los/ord/langvarige-helsetjenester"},
        {"http://psi.norge.no/los/ord/inkludering", "0"},
        {"http://psi.norge.no/los/ord/innbyggerinitiativ", "http://psi.norge.no/los/tema/medvirkning"},
        {"http://psi.norge.no/los/ord/innemiljoe", "http://psi.norge.no/los/ord/innemiljo"},
        {"http://psi.norge.no/los/ord/inntekts-og-formuesskatt", "http://psi.norge.no/los/tema/skatt"},
        {"http://psi.norge.no/los/ord/internett", "0"},
        {"http://psi.norge.no/los/ord/kameratkjoering", "0"},
        {"http://psi.norge.no/los/ord/karakterer", "http://psi.norge.no/los/ord/karakterer-og-evaluering"},
        {"http://psi.norge.no/los/ord/kjaeledyr-og-sportsdyr", "http://psi.norge.no/los/ord/dyrehold"},
        {"http://psi.norge.no/los/ord/kjoereseddel", "http://psi.norge.no/los/ord/kjoreseddel"},
        {"http://psi.norge.no/los/ord/kjoeretoeykontroll", "http://psi.norge.no/los/ord/kjoretoykontroll"},
        {"http://psi.norge.no/los/ord/kommunale-avgifter-og-gebyrer", "http://psi.norge.no/los/ord/kommunale-avgifter-og-gebyr"},
        {"http://psi.norge.no/los/ord/konfirmasjon", "0"},
        {"http://psi.norge.no/los/ord/konkurs", "http://psi.norge.no/los/ord/starte-eller-avslutte-bedrift"},
        {"http://psi.norge.no/los/ord/kontantstoette", "http://psi.norge.no/los/ord/kontantstotte"},
        {"http://psi.norge.no/los/ord/kontrakt", "0"},
        {"http://psi.norge.no/los/ord/kontrollmerke", "0"},
        {"http://psi.norge.no/los/ord/kraftpris", "0"},
        {"http://psi.norge.no/los/ord/kringkasting", "0"},
        {"http://psi.norge.no/los/ord/kringkastingsavgift", "0"},
        {"http://psi.norge.no/los/ord/krisehaandtering", "http://psi.norge.no/los/tema/akutt-hjelp"},
        {"http://psi.norge.no/los/ord/kulturminnevern", "http://psi.norge.no/los/ord/kulturminner"},
        {"http://psi.norge.no/los/ord/ledsager", "http://psi.norge.no/los/ord/ledsagerbevis"},
        {"http://psi.norge.no/los/ord/leirskole", "0"},
        {"http://psi.norge.no/los/ord/loenn", "http://psi.norge.no/los/ord/lonn"},
        {"http://psi.norge.no/los/ord/lokalhistorie", "0"},
        {"http://psi.norge.no/los/ord/matombringing", "http://psi.norge.no/los/ord/matlevering"},
        {"http://psi.norge.no/los/ord/midlertidig-brukstillatelse", "0"},
        {"http://psi.norge.no/los/ord/miljoesertifisering", "http://psi.norge.no/los/ord/miljosertifisering"},
        {"http://psi.norge.no/los/ord/minid", "0"},
        {"http://psi.norge.no/los/ord/minstepensjon", "http://psi.norge.no/los/ord/alderspensjon"},
        {"http://psi.norge.no/los/ord/mobbing", "http://psi.norge.no/los/ord/mobbing-i-skolen"},
        {"http://psi.norge.no/los/ord/musikk", "0"},
        {"http://psi.norge.no/los/ord/naeringsareal", "http://psi.norge.no/los/ord/naringsareal"},
        {"http://psi.norge.no/los/ord/naeringsfond", "http://psi.norge.no/los/tema/tilskuddsordninger-for-naring"},
        {"http://psi.norge.no/los/ord/naeringsskatt", "http://psi.norge.no/los/ord/betaling-av-skatt"},
        {"http://psi.norge.no/los/ord/naermiljoetilskudd", "http://psi.norge.no/los/ord/narmiljotilskudd"},
        {"http://psi.norge.no/los/ord/nasjonale-proever", "http://psi.norge.no/los/ord/karakterer-og-evaluering"},
        {"http://psi.norge.no/los/ord/naturskade", "http://psi.norge.no/los/ord/naturskadeerstatning"},
        {"http://psi.norge.no/los/ord/norsk-spraak", "0"},
        {"http://psi.norge.no/los/ord/norskopplaering", "http://psi.norge.no/los/ord/norskopplaring"},
        {"http://psi.norge.no/los/ord/offentlig-innkjoep", "http://psi.norge.no/los/ord/offentlig-innkjop"},
        {"http://psi.norge.no/los/ord/omsorgsloenn", "http://psi.norge.no/los/ord/omsorgsstonad"},
        {"http://psi.norge.no/los/ord/omsorgspenger", "http://psi.norge.no/los/ord/ytelser-ved-sykdom-i-familien"},
        {"http://psi.norge.no/los/ord/opphavsrett", "0"},
        {"http://psi.norge.no/los/ord/oppmaaling", "http://psi.norge.no/los/ord/oppmaling"},
        {"http://psi.norge.no/los/ord/overgrep", "http://psi.norge.no/los/ord/hjelp-ved-overgrep"},
        {"http://psi.norge.no/los/ord/paataleunnlatelse", "http://psi.norge.no/los/ord/pataleunnlatelse"},
        {"http://psi.norge.no/los/ord/parkering", "http://psi.norge.no/los/ord/parkering-og-hvileplasser"},
        {"http://psi.norge.no/los/ord/pass", "http://psi.norge.no/los/ord/pass-og-visum"},
        {"http://psi.norge.no/los/ord/patent", "http://psi.norge.no/los/ord/patent-design-og-varemerke"},
        {"http://psi.norge.no/los/ord/post", "0"},
        {"http://psi.norge.no/los/ord/postordresalg", "0"},
        {"http://psi.norge.no/los/ord/psykisk-helsevern", "http://psi.norge.no/los/ord/psykisk-helse"},
        {"http://psi.norge.no/los/ord/realkompetanse", "0"},
        {"http://psi.norge.no/los/ord/redningstjeneste", "0"},
        {"http://psi.norge.no/los/ord/registrering-av-kjoeretoey", "http://psi.norge.no/los/ord/registrering-av-kjoretoy"},
        {"http://psi.norge.no/los/ord/reiseinformasjon", "0"},
        {"http://psi.norge.no/los/ord/reiseregning", "http://psi.norge.no/los/ord/reiseutgifter"},
        {"http://psi.norge.no/los/ord/reklame-og-telefonsalg", "0"},
        {"http://psi.norge.no/los/ord/rekruttering", "0"},
        {"http://psi.norge.no/los/ord/rustiltak", "http://psi.norge.no/los/ord/hjelp-ved-rusavhengighet"},
        {"http://psi.norge.no/los/ord/ruteopplysning", "http://psi.norge.no/los/ord/ruteinformasjon"},
        {"http://psi.norge.no/los/ord/saerskilt-norskopplaering", "http://psi.norge.no/los/ord/norskopplaring"},
        {"http://psi.norge.no/los/ord/samisk-spraak", "0"},
        {"http://psi.norge.no/los/ord/selvangivelse", "http://psi.norge.no/los/ord/skattemelding-for-formue-og-inntektsskatt"},
        {"http://psi.norge.no/los/ord/servering", "0"},
        {"http://psi.norge.no/los/ord/sjoefart", "http://psi.norge.no/los/ord/sjofart"},
        {"http://psi.norge.no/los/ord/sjoesikkerhet", "http://psi.norge.no/los/ord/sjosikkerhet"},
        {"http://psi.norge.no/los/ord/skifte", "http://psi.norge.no/los/ord/skifte-ved-dodsfall"},
        {"http://psi.norge.no/los/ord/skolemaaltid", "0"},
        {"http://psi.norge.no/los/ord/skolerute", "0"},
        {"http://psi.norge.no/los/ord/spraakkurs-og-spraaktest", "0"},
        {"http://psi.norge.no/los/ord/standardisering", "0"},
        {"http://psi.norge.no/los/ord/statskirke", "0"},
        {"http://psi.norge.no/los/ord/stoenad-til-enslig-forsoerger", "http://psi.norge.no/los/ord/stonad-til-enslig-forsorger"},
        {"http://psi.norge.no/los/ord/stoenad-ved-arbeidsmarkedstiltak", "http://psi.norge.no/los/ord/stonad-ved-arbeidsmarkedstiltak"},
        {"http://psi.norge.no/los/ord/stoettekontakt", "http://psi.norge.no/los/ord/stottekontakt"},
        {"http://psi.norge.no/los/ord/stoey", "http://psi.norge.no/los/ord/stoy"},
        {"http://psi.norge.no/los/ord/straalevern", "http://psi.norge.no/los/ord/stralevern"},
        {"http://psi.norge.no/los/ord/studiefinansiering", "http://psi.norge.no/los/tema/studiefinansiering"},
        {"http://psi.norge.no/los/ord/sykefravaer", "http://psi.norge.no/los/ord/sykefravar"},
        {"http://psi.norge.no/los/ord/teater", "http://psi.norge.no/los/ord/kulturtilbud"},
        {"http://psi.norge.no/los/ord/telepris", "0"},
        {"http://psi.norge.no/los/ord/torgsalg", "http://psi.norge.no/los/ord/bevilling-og-tillatelser"},
        {"http://psi.norge.no/los/ord/trafikkinformasjon", "http://psi.norge.no/los/tema/trafikkinformasjon"},
        {"http://psi.norge.no/los/ord/tros-og-livssynssamfunn", "http://psi.norge.no/los/ord/tilskudd-til-tro-og-livssyn"},
        {"http://psi.norge.no/los/ord/truckfoererbevis", "http://psi.norge.no/los/ord/truckforerbevis"},
        {"http://psi.norge.no/los/ord/trygghetsalarm", "http://psi.norge.no/los/ord/trygghet-i-hjemmet"},
        {"http://psi.norge.no/los/ord/turisme", "0"},
        {"http://psi.norge.no/los/ord/turistkontor", "0"},
        {"http://psi.norge.no/los/ord/ufoerepensjon", "http://psi.norge.no/los/ord/uforetrygd"},
        {"http://psi.norge.no/los/ord/ufrivillig-barnloeshet", "http://psi.norge.no/los/ord/ufrivillig-barnloshet"},
        {"http://psi.norge.no/los/ord/universell-utforming", "0"},
        {"http://psi.norge.no/los/ord/uteomraade", "0"},
        {"http://psi.norge.no/los/ord/vaapentillatelse", "http://psi.norge.no/los/ord/vapentillatelse"},
        {"http://psi.norge.no/los/ord/vaervarsel", "http://psi.norge.no/los/ord/varvarsel"},
        {"http://psi.norge.no/los/ord/vannforsyning", "0"},
        {"http://psi.norge.no/los/ord/varemerke", "http://psi.norge.no/los/ord/patent-design-og-varemerke"},
        {"http://psi.norge.no/los/ord/venteloenn", "http://psi.norge.no/los/ord/ventelonn"},
        {"http://psi.norge.no/los/ord/ventestoenad", "0"},
        {"http://psi.norge.no/los/ord/vergemaal", "http://psi.norge.no/los/ord/vergemal"},
        {"http://psi.norge.no/los/ord/videregaaende-skole", "http://psi.norge.no/los/tema/videregaende-skole"},
        {"http://psi.norge.no/los/ord/vikarfomidling", "0"},
        {"http://psi.norge.no/los/ord/visuell-kunst", "0"},
        {"http://psi.norge.no/los/ord/visum", "http://psi.norge.no/los/ord/pass-og-visum"},
        {"http://psi.norge.no/los/ord/yrkesrettet-attfoering", "0"},
        {"http://psi.norge.no/los/ord/yrkesskade", "http://psi.norge.no/los/ord/yrkesskadedekning"},
        {"http://psi.norge.no/los/tema/arbeidssoeking-og-rekruttering", "http://psi.norge.no/los/tema/arbeidsliv"},
        {"http://psi.norge.no/los/tema/avfallshaandtering", "http://psi.norge.no/los/tema/avfallshandtering"},
        {"http://psi.norge.no/los/tema/avlastning-og-stoette", "http://psi.norge.no/los/tema/avlastning-og-stotte"},
        {"http://psi.norge.no/los/tema/baattrafikk", "http://psi.norge.no/los/tema/bat-havn-og-kyst"},
        {"http://psi.norge.no/los/tema/barn-og-familie", "http://psi.norge.no/los/tema/familie-og-barn"},
        {"http://psi.norge.no/los/tema/barn-og-foreldre", "http://psi.norge.no/los/tema/foreldre-og-foresatte"},
        {"http://psi.norge.no/los/tema/barnevern-og-familievern", "http://psi.norge.no/los/tema/barnevern-og-foreldrestotte"},
        {"http://psi.norge.no/los/tema/beredskap-og-sikkerhet", "http://psi.norge.no/los/tema/samfunnssikkerhet-og-beredskap"},
        {"http://psi.norge.no/los/tema/bolig-og-eiendom", "http://psi.norge.no/los/tema/bygg-og-eiendom"},
        {"http://psi.norge.no/los/tema/doedsfall", "http://psi.norge.no/los/tema/dodsfall-og-gravferd"},
        {"http://psi.norge.no/los/tema/fiske-fangst-og-akvakultur", "http://psi.norge.no/los/ord/akvakultur"},
        {"http://psi.norge.no/los/tema/flagg-og-ordener", "0"},
        {"http://psi.norge.no/los/tema/foererkort-og-sertifikat", "http://psi.norge.no/los/tema/forerkort-og-sertifikat"},
        {"http://psi.norge.no/los/tema/folkehoegskole", "0"},
        {"http://psi.norge.no/los/tema/forbrukerspoersmaal", "0"},
        {"http://psi.norge.no/los/tema/forurensning-og-straaling", "http://psi.norge.no/los/tema/forurensning-og-straling"},
        {"http://psi.norge.no/los/tema/grunnskoleopplaering", "http://psi.norge.no/los/tema/grunnskole"},
        {"http://psi.norge.no/los/tema/helse", "http://psi.norge.no/los/tema/helse-og-omsorg"},
        {"http://psi.norge.no/los/tema/hoeyere-utdanning", "http://psi.norge.no/los/tema/hoyere-utdanning"},
        {"http://psi.norge.no/los/tema/individ-og-samfunn", "0"},
        {"http://psi.norge.no/los/tema/innvandring-og-innreise", "0"},
        {"http://psi.norge.no/los/tema/karakterer-og-evaluering", "http://psi.norge.no/los/ord/karakterer-og-evaluering"},
        {"http://psi.norge.no/los/tema/kjoep-og-salg", "http://psi.norge.no/los/tema/kjop-og-salg"},
        {"http://psi.norge.no/los/tema/kjoeretoey", "http://psi.norge.no/los/tema/kjoretoy"},
        {"http://psi.norge.no/los/tema/kollektivtransport", "http://psi.norge.no/los/tema/mobilitetstilbud"},
        {"http://psi.norge.no/los/tema/kommunal-planlegging", "0"},
        {"http://psi.norge.no/los/tema/media-og-kommunikasjon", "0"},
        {"http://psi.norge.no/los/tema/naering", "http://psi.norge.no/los/tema/naring"},
        {"http://psi.norge.no/los/tema/naeringsutvikling", "http://psi.norge.no/los/tema/naringsutvikling"},
        {"http://psi.norge.no/los/tema/natur-og-miljoe", "http://psi.norge.no/los/tema/natur-klima-og-miljo"},
        {"http://psi.norge.no/los/tema/oekonomiske-ytelser", "http://psi.norge.no/los/tema/okonomiske-ytelser-og-radgivning"},
        {"http://psi.norge.no/los/tema/offentlige-avgifter", "http://psi.norge.no/los/tema/avgift"},
        {"http://psi.norge.no/los/tema/omsorg-trygd-og-sosiale-tjenester", "http://psi.norge.no/los/tema/helse-og-omsorg"},
        {"http://psi.norge.no/los/tema/opphavsrett", "0"},
        {"http://psi.norge.no/los/tema/pensjon", "http://psi.norge.no/los/tema/inntektssikring"},
        {"http://psi.norge.no/los/tema/privatoekonomi", "0"},
        {"http://psi.norge.no/los/tema/psykisk-helse", "http://psi.norge.no/los/ord/psykisk-helse"},
        {"http://psi.norge.no/los/tema/reiselivsnaering", "0"},
        {"http://psi.norge.no/los/tema/religion-og-livssyn", "0"},
        {"http://psi.norge.no/los/tema/rettslige-spoersmaal", "http://psi.norge.no/los/tema/lov-og-rett"},
        {"http://psi.norge.no/los/tema/samfunnsplanlegging", "0"},
        {"http://psi.norge.no/los/tema/skatt-og-likning", "http://psi.norge.no/los/tema/skatt"},
        {"http://psi.norge.no/los/tema/skatter-og-avgifter", "http://psi.norge.no/los/tema/skatt-og-avgift"},
        {"http://psi.norge.no/los/tema/skolemiljoe", "http://psi.norge.no/los/ord/skolemiljo"},
        {"http://psi.norge.no/los/tema/spraak", "0"},
        {"http://psi.norge.no/los/tema/svangerskap-og-foedsel", "http://psi.norge.no/los/tema/svangerskap"},
        {"http://psi.norge.no/los/tema/tekniske-tjenester", "0"},
        {"http://psi.norge.no/los/tema/tilskuddsordninger", "http://psi.norge.no/los/tema/tilskudd-til-kultur-idrett-og-fritid"},
        {"http://psi.norge.no/los/tema/trafikk-reiser-og-samferdsel", "http://psi.norge.no/los/tema/trafikk-og-transport"},
        {"http://psi.norge.no/los/tema/transporttjenester", "http://psi.norge.no/los/tema/mobilitetstilbud"},
        {"http://psi.norge.no/los/tema/utenlandsreiser", "0"},
        {"http://psi.norge.no/los/tema/vaer-og-klima", "http://psi.norge.no/los/tema/var-og-klima"},
        {"http://psi.norge.no/los/tema/varer-og-tjenester", "0"},
        {"http://psi.norge.no/los/tema/veg-og-vegtrafikk", "http://psi.norge.no/los/tema/veg-og-vegregulering"},
        {"http://psi.norge.no/los/tema/videregaaende-opplaering", "http://psi.norge.no/los/tema/videregaende-skole"},
        {"http://psi.norge.no/los/tema/voksenopplaering", "http://psi.norge.no/los/tema/voksenopplaring"},
        {"http://psi.norge.no/los/ord/ambulerende-vaktmester", "0"},
        {"http://psi.norge.no/los/ord/oppgaveplikt", "0"}
    }).collect(Collectors.toMap(data -> data[0], data -> data[1]));
    private final Set<String> removedUris = uriConversionMap.entrySet().stream().filter(e -> "0".equals(e.getValue())).map(Map.Entry::getKey).collect(Collectors.toSet());
    private final Set<String> mappedUris = uriConversionMap.entrySet().stream().filter(e -> !"0".equals(e.getValue())).map(Map.Entry::getKey).collect(Collectors.toSet());
    private final Set<String> changedUris = uriConversionMap.keySet();
    private Logger logger = LoggerFactory.getLogger(DatasetRegistrationMigration.class);

    private static DataTheme createTheme(String uri) {
        DataTheme t = new DataTheme();
        t.setUri(uri);
        return t;
    }

    @PostConstruct
    public void migrate() {
        Iterable<Dataset> datasetRegistrations = datasetRepository.findAll();

        long migratedDatasetCount = StreamSupport.stream(datasetRegistrations.spliterator(), false)
            // filter datasets that have some of the theme uris changed.
            .filter(d -> d.getTheme() != null && d.getTheme().stream().anyMatch(t -> changedUris.contains(t.getUri())))
            .peek(d -> {
                List<DataTheme> newThemes = d.getTheme().stream()
                    //filter removed removed themes
                    .filter(t -> !removedUris.contains(t.getUri()))
                    //replace the changed uris
                    .map(t -> mappedUris.contains(t.getUri()) ? createTheme(uriConversionMap.get(t.getUri())) : t)
                    .collect(Collectors.toList());

                // report items that are old list that are not presenet in new
                Set<String> newUris = newThemes.stream().map(DataTheme::getUri).collect(Collectors.toSet());
                Set<String> fixedUris = d.getTheme().stream().filter(t -> !newUris.contains(t.getUri())).map(DataTheme::getUri).collect(Collectors.toSet());
                logger.info("Migrated dataset {}, fixed {} themes: {} ", d.getId(), fixedUris.size(), fixedUris);

                d.setTheme(newThemes);

                datasetRepository.save(d);
            })
            .count();

        logger.info("Total datasets migrated {}", migratedDatasetCount);
    }
}
