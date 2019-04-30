package no.dcat.shared;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.net.URI;
import java.util.List;
import java.util.Map;

@Data
public class LosTheme {
    static final String RDFS_URI = "http://www.w3.org/2000/01/rdf-schema#";
    static final String NODE_IS_TEMA_OR_SUBTEMA = "http://psi.norge.no/los/ontologi/tema";
    static final String NODE_IS_EMNE = "http://psi.norge.no/los/ontologi/ord";

    @ApiModelProperty("Terms (underkategori or emneord) that are connected to this term")
    public List<URI> children;
    @ApiModelProperty("Terms (hovedkategori or underkategori that are connected to this term")
    public List<URI> parents;
    @ApiModelProperty("True if the node is tema (ie can have children)")
    public boolean isTema;
    @ApiModelProperty("The hierarchy path")
    public List<String> losPaths;
    @ApiModelProperty("Term, en av (Hovedkategori, underkategori, emneord)")
    private Map<String, String> name;
    @ApiModelProperty("The verbose definition of a Term")
    private Map<String, String> definition;
    @ApiModelProperty("The id/description in LOS")
    private String uri;
    @ApiModelProperty("Alternative words for the term")
    private List<String> synonyms;
    @ApiModelProperty("Terms that are related to this term")
    private List<URI> relatedTerms;

}
