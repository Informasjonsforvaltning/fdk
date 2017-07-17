package no.dcat.themes;

import no.dcat.themes.builders.DataTheme;
import no.dcat.themes.builders.DataThemeBuilders;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.util.FileManager;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ThemesService {

    @Cacheable("themes")
    public List<DataTheme> getThemes() {

        Model model = FileManager.get().loadModel("rdf/data-theme-skos.rdf");

        List<DataTheme> dataThemes = new DataThemeBuilders(model).build();

        return dataThemes;

    }


}
