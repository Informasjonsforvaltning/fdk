package no.dcat.themes;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import no.dcat.themes.builders.CodeBuilders;
import no.dcat.themes.builders.DataTheme;
import no.dcat.themes.builders.DataThemeBuilders;
import no.dcat.themes.builders.SkosCode;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.util.FileManager;

import java.util.List;
import java.util.concurrent.Future;

public class Main {

    public static void main(String[] args) {
        Gson gson = new GsonBuilder().setPrettyPrinting().setDateFormat("yyyy-MM-dd'T'HH:mm:ssX").create();


        for (Types types : Types.values()) {
            String sourceUrl = types.getSourceUrl();
            System.out.println(sourceUrl);

            Model model = FileManager.get().loadModel(sourceUrl);
            List<SkosCode> codes = new CodeBuilders(model).build();

            codes.stream().map(gson::toJson).forEach(System.out::println);

        }



        Model model = FileManager.get().loadModel("rdf/data-theme-skos.rdf");

        List<DataTheme> dataThemes = new DataThemeBuilders(model).build();

        dataThemes.stream().map(gson::toJson).forEach(System.out::println);




    }



}


 enum Types {

    PROVENANCESTATEMENT("rdf/provenance.rdf", "provenancestatement"),
    RIGHTSSTATEMENT("rdf/access-right-skos.rdf","rightsstatement"),
    FREQUENCY("http://publications.europa.eu/mdr/resource/authority/frequency/skos/frequencies-skos.rdf","frequency"),
    // To bigfile, contains over 7700 languages, 5 milllion lines og code.
    //LINGUISTICSYSTEM("http://publications.europa.eu/mdr/resource/authority/language/skos/languages-skos.rdf", "linguisticsystem");
    LINGUISTICSYSTEM("rdf/languages-skos.rdf", "linguisticsystem");

    private String sourceUrl;
    private String type;

    Types(String sourceUrl, String type) {
        this.sourceUrl = sourceUrl;
        this.type = type;
    }
    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getSourceUrl() {
        return sourceUrl;
    }

    public void setSourceUrl(String sourceUrl) {
        this.sourceUrl = sourceUrl;
    }
}