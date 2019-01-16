package no.fdk.acat.converters.apispecificationparser;

import no.fdk.acat.common.model.apispecification.ApiSpecification;

public interface Parser {

    boolean canParse(String spec);

    ApiSpecification parse(String spec) throws ParseException;
}
