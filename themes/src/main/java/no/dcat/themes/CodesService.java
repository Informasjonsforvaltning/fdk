package no.dcat.themes;

import no.dcat.themes.builders.CodeBuilders;
import no.dcat.themes.builders.SkosCode;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.util.FileManager;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CodesService {

    public List<String> listCodes(){
        return Arrays
                .stream(Types.values())
                .map(v -> v.getType())
                .collect(Collectors.toList());

    }


    @Cacheable("codes")
    public List<SkosCode> getCodes(Types type) {

        Model model = FileManager.get().loadModel(type.getSourceUrl());
        List<SkosCode> codes = new CodeBuilders(model).build();

        return codes;

    }

}
