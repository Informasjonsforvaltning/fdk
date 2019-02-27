package no.fdk.imcat.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import no.dcat.shared.Publisher;
import no.fdk.imcat.model.InformationModel;
import no.fdk.imcat.model.InformationModelFactory;
import no.fdk.imcat.model.InformationModelHarvestSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.zip.GZIPInputStream;

/**
 * Harvest Altinns APIS
 */

@Service
public class AltinnHarvest {
    private static final Logger logger = LoggerFactory.getLogger(AltinnHarvest.class);

    private InformationModelFactory informationModelFactory;

    private HashMap<String, InformationModel> everyAltinnInformationModel = new HashMap<>();


    public AltinnHarvest(InformationModelFactory factory) {
        this.informationModelFactory = factory;
    }

    private static InformationModel parseInformationModel(AltInnService service) {
        InformationModel model = new InformationModel();

        Publisher p = new Publisher(service.OrganizationNumber);
        model.setPublisher(p);
        model.setTitle(service.ServiceName);
        model.setId(service.ServiceCode + "_" + service.ServiceEditionCode);
        logger.debug("Service " + service.ServiceName + " has {} forms", service.Forms.size());

        byte[] gzippedJson = Base64.getDecoder().decode(service.Forms.get(0).JsonSchema);
        byte[] rawJson = null;

        try (ByteArrayInputStream bin = new ByteArrayInputStream(gzippedJson);
             GZIPInputStream gzipper = new GZIPInputStream(bin)) {
            ByteArrayOutputStream myBucket = new ByteArrayOutputStream();
            boolean done = false;
            byte[] buffer = new byte[1000]; //much bigger later
            while (!done) {
                int length = gzipper.read(buffer, 0, buffer.length);
                if (length > 0) {
                    myBucket.write(buffer, 0, length);
                }
                done = (length == -1);
            }

            gzipper.close();


            String str = new String(myBucket.toByteArray(), StandardCharsets.UTF_8);

            //parse the json ?
            logger.debug("The stringS!" + str);

            //make a model from this ? or a fragment ?
            // first approx, just grab the first form
            model.setSchema(str);
        } catch (IOException ie) {
            logger.debug("Failed to gunzip JSON", ie);
        }

        return model;

    }

    public InformationModel getByServiceCodeAndEdition(String serviceCode, String serviceEditionCode) {
        return everyAltinnInformationModel.get(serviceCode + "_" + serviceEditionCode);
    }

    public List<InformationModelHarvestSource> getHarvestSources() {
        logger.debug("Getting harvest sources from AltInn");
        List<InformationModelHarvestSource> sourceList = new ArrayList<>();

        //loadAllInformationModelsFromCompositeFile("C:\\tmp\\altinn-service-schemas.json");
        loadAllInformationModelsFromOutAltInnAdapter();

        for (String key : everyAltinnInformationModel.keySet()) {

            InformationModel model = everyAltinnInformationModel.get(key);

            int underscoreIndex = key.indexOf("_");
            String altInnServiceCode = key.substring(0, underscoreIndex);
            String altInnServiceEditionCode = key.substring(underscoreIndex + 1);

            InformationModelHarvestSource source = new InformationModelHarvestSource();
            source.harvestSourceUri = model.getHarvestSourceUri();
            source.sourceType = InformationmodelHarvester.ALTINN_TYPE;

            source.serviceCode = altInnServiceCode;
            source.serviceEditionCode = altInnServiceEditionCode;
            sourceList.add(source);

        }

        return sourceList;
    }

    private void loadAllInformationModelsFromOutAltInnAdapter() {
        try {
            URL altinn = new URL("https://fdk-dev-altinn.appspot.com/api/v1/schemas");
            logger.debug("Retrieving all schemas from altinn.  url: {} expected load time approx 5 minutes", altinn);
            String JSonSchemaFromFile = new Scanner(altinn.openStream(), "UTF-8").useDelimiter("\\A").next();
            logger.debug("schemas retrieved. url {} ", altinn);

            ObjectMapper objectMapper = new ObjectMapper();
            logger.debug("Preparing to parse altinn schemas");
            List<AltInnService> servicesInAltInn = objectMapper.readValue(JSonSchemaFromFile, new TypeReference<List<AltInnService>>() {
            });
            logger.debug("Altinn schemas parsed");

            //Now extract the subforms from base64 gzipped json
            for (AltInnService service : servicesInAltInn) {
                InformationModel model = parseInformationModel(service);
                everyAltinnInformationModel.put(model.getId(), model);
                //TODO: Get all the model subforms
            }

        } catch (Throwable e) {
            logger.debug("Failed while reading information models from  ", e);
        }

    }

    private static class AltInnService {

        public String ServiceOwnerCode;
        public String ServiceOwnerName;
        public String OrganizationNumber;
        public String ServiceName;
        public String ServiceCode;
        public String ServiceEditionCode;
        public String ValidFrom;
        public String ValidTo;
        public String ServiceType;
        public String EnterpriseUserEnabled;
        public List<AltinnForm> Forms;
        AltInnService() {
        }
    }

    private static class AltinnForm {
        public String FormID;
        public String FormName;
        public String FormType;
        public String DataFormatID;
        public String DataFormatVersion;
        public String XsdSchemaUrl;
        public String JsonSchema;
    }

}
