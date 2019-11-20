package no.dcat.service;

import no.dcat.model.Organization;
import no.fdk.webutils.exceptions.FDKException;
import no.fdk.webutils.exceptions.InternalServerErrorException;
import no.fdk.webutils.exceptions.NotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import static java.lang.String.format;
import static java.util.Collections.singletonList;

@Service
public class OrganizationService {
    private static Logger logger = LoggerFactory.getLogger(OrganizationService.class);

    @Value("${application.organizationCatalogueUrl}")
    private String organizationCatalogueUrl;

    private HttpHeaders defaultHeaders;
    private RestTemplate restTemplate;

    public OrganizationService() {
        restTemplate = new RestTemplate();
        defaultHeaders = new HttpHeaders();
        defaultHeaders.setAccept(singletonList(MediaType.APPLICATION_JSON));
    }

    boolean hasDelegationPermission(String organizationNumber) throws FDKException {
        logger.info("Checking whether organization with ID {} has delegation permission", organizationNumber);
        Boolean allowDelegatedRegistration = getOrganization(organizationNumber).getAllowDelegatedRegistration();
        return allowDelegatedRegistration != null && allowDelegatedRegistration;
    }

    private Organization getOrganization(String organizationNumber) throws FDKException {
        logger.info("Fetching organization by ID {}", organizationNumber);
        try {
            return restTemplate.exchange(
                format("%s/organizations/%s", organizationCatalogueUrl, organizationNumber),
                HttpMethod.GET,
                new HttpEntity(defaultHeaders),
                Organization.class).getBody();
        } catch (HttpClientErrorException exception) {
            if (exception.getStatusCode() == HttpStatus.NOT_FOUND) {
                throw new NotFoundException(format("Organization with ID %s not found", organizationNumber), exception);
            }
            throw new InternalServerErrorException("An unexpected client error occurred", exception);
        } catch (ResourceAccessException exception) {
            throw new InternalServerErrorException("Downstream service not available", exception);
        } catch (RestClientException exception) {
            throw new InternalServerErrorException("An unexpected server error occurred", exception);
        }
    }
}
