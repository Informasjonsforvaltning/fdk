package no.fdk.imcat.service;

import no.fdk.imcat.model.InformationModel;
import no.fdk.imcat.model.InformationModelForOutput;
import org.springframework.beans.BeanUtils;

public class InformationModelForOutputFactory {

    public static InformationModelForOutput getInformationModelForOutput(InformationModel model) {

        InformationModelForOutput modelForOutput = new InformationModelForOutput();
        BeanUtils.copyProperties(model, modelForOutput);

        return modelForOutput;
    }
}
