package no.fdk.imcat.service;

import no.fdk.imcat.model.InformationModel;
import no.fdk.imcat.model.InformationModelFactory;
import no.fdk.imcat.model.InformationModelHarvestSource;
import org.apache.commons.io.input.ReaderInputStream;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.StringReader;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Harvest Altinns APIS
 */
@Service
public class AltinnHarvest {
    private static final Logger logger = LoggerFactory.getLogger(AltinnHarvest.class);

    private InformationModelFactory informationModelFactory;


    public AltinnHarvest(InformationModelFactory factory) {
        this.informationModelFactory = factory;
    }


    public List<InformationModelHarvestSource> getHarvestSources() {
        List<InformationModelHarvestSource> sourceList = new ArrayList<>();

        //Get the entire form list
        try {
            RestTemplate rest = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.add("Accept", "application/xml");//For some reason the XML contains the urls we want, the JSON of the SAME resources does not.
            HttpEntity<String> requestEntity = new HttpEntity<>("", headers);
            ResponseEntity<String> responseEntity = rest.exchange("https://www.altinn.no/api/metadata", HttpMethod.GET, requestEntity, String.class);
            String theXMLAll = responseEntity.getBody();

            theXMLAll = theXMLAll.substring(3); //Skip UTF8-Bytemarker
            StringReader srr = new StringReader(theXMLAll);

            ReaderInputStream ris = new ReaderInputStream(srr);

            DocumentBuilder builder = DocumentBuilderFactory.newInstance().newDocumentBuilder();
            Document doc = builder.parse(ris);
            doc.getDocumentElement().normalize();

            //We ignore all of the file, but the target urls
            NodeList resources = doc.getElementsByTagName("resource");
            for (int i = 1; i < resources.getLength() - 1; i++) {//We start at 1 to exclude the self-reference
                Node n = resources.item(i);
                if (n.getAttributes().getNamedItem("href") == null) {
                    continue;//This node has no href, so we skip it
                }
                String formURL = n.getAttributes().getNamedItem("href").getNodeValue();

                NodeList children = n.getChildNodes();
                String altInnServiceCode = getNamedElementsValue(children, "ServiceCode");
                String altInnServiceEditionCode = getNamedElementsValue(children, "ServiceEditionCode");

                InformationModelHarvestSource source = new InformationModelHarvestSource();
                source.harvestSourceUri = formURL;
                source.title = getNamedElementsValue(children, "ServiceName");
                source.sourceType = InformationmodelHarvester.ALTINN_TYPE;
                source.serviceCode = altInnServiceCode;
                source.serviceEditionCode = altInnServiceEditionCode;
                sourceList.add(source);
                logger.debug(formURL);
            }
        } catch (Exception e) {
            logger.debug("Failed to parse", e);
        }

        return sourceList;
    }

    public String getNamedElementsValue(NodeList listToSearch, String nodename) {
        for (int i = 0; i < listToSearch.getLength() - 1; i++) {
            Node n = listToSearch.item(i);
            if (nodename.equalsIgnoreCase(n.getNodeName())) {
                if (n.getNodeValue() == null) {
                    return n.getTextContent();
                } else {
                    return n.getNodeValue();
                }
            }
        }
        return "";
    }

    InformationModel getInformationModel(InformationModelHarvestSource source) {
        RestTemplate rest = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.add("Accept", "application/xml");//For some reason the XML contains the urls we want, the JSON of the SAME resources does not.
        HttpEntity<String> requestEntity = new HttpEntity<>("", headers);
        logger.debug("Retrieving form details: " + source.harvestSourceUri);
        String theXMLAll = "";
        try {
            ResponseEntity<String> responseEntity = rest.exchange(source.harvestSourceUri, HttpMethod.GET, requestEntity, String.class);
            theXMLAll = responseEntity.getBody();

        } catch (Exception e) {
            logger.debug("Failed to read service details for url " + source.harvestSourceUri + ". Ignoring and continuing");
            return null;
        }

        theXMLAll = theXMLAll.substring(3); //Skip UTF8-Bytemarker
        StringReader srr = new StringReader(theXMLAll);

        ReaderInputStream ris = new ReaderInputStream(srr);

        //resource :
        //https://www.altinn.no/api/metadata/formtask/3906/141205
        //has link https://www.altinn.no/api/metadata/formtask/3906/141205/forms/3940/20161021/xsd
        //corresponding file:
        //./schema_3906_141205_forms_3940_20161021.schema

        try {
            DocumentBuilder builder = DocumentBuilderFactory.newInstance().newDocumentBuilder();
            Document doc = builder.parse(ris);
            doc.getDocumentElement().normalize();

            NodeList formMetaDataList = doc.getElementsByTagName("FormMetaData");
            logger.debug("For this file we got " + formMetaDataList.getLength() + " metadatas");

            if (formMetaDataList.getLength() == 0) {
                //This service does not have the required Metadata. Ignore
                logger.debug("Service " + source.harvestSourceUri + " did not contain the required metadata to generate Information Model. Ignoring and moving on");
                return null;
            }
            Node n = formMetaDataList.item(0);
            NodeList children = n.getChildNodes();
            String dataFormatId = getNamedElementsValue(children, "DataFormatID");
            String dataFormatVersion = getNamedElementsValue(children, "DataFormatVersion");

            String JSonSchemaFromFile = new String(Files.readAllBytes(Paths.get("C:\\tmp\\tt\\schema_" + source.serviceCode + "_" + source.serviceEditionCode + "_forms_" + dataFormatId + "_" + dataFormatVersion + ".schema.json")));
            source.schema = JSonSchemaFromFile;
            InformationModel im = informationModelFactory.createInformationModel(source, new Date());
            return im;

        } catch (Exception e) {
            logger.debug("Failed to parse", e);
        }
        return null;
    }
}
