package no.dcat.portal.webapp;

import org.apache.jena.rdf.model.Model;
import org.apache.jena.riot.RDFDataMgr;

import java.io.ByteArrayOutputStream;

import static no.dcat.portal.webapp.SupportedFormat.RDF_XML;
import static no.dcat.portal.webapp.SupportedFormat.getFormat;

/**
 * Created by mgs on 25.01.2017.
 */
public class ModelFormatter {

    private Model model;
    private static final SupportedFormat DEFAULT_FORMAT = RDF_XML;

    public ModelFormatter(Model model) {
        this.model = model;
    }

    /**
     * Format model
     * @param format output format
     * @return model converted into format
     */
    public String format(SupportedFormat format) {
        ByteArrayOutputStream stream = new ByteArrayOutputStream();
        RDFDataMgr.write(stream, model, format.getResponseFormat());
        return stream.toString();
    }

    /**
     * Identify which format to use based on accept header
     * @param accept output format
     * @return model converted into accepted format
     */
    public String format(String accept) {
        return format(getFormat(accept).orElse(DEFAULT_FORMAT));
    }


}
