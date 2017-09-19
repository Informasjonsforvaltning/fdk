package no.dcat.controller;

import no.dcat.model.SkosCode;
import no.dcat.service.ReferenceDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import static org.springframework.http.MediaType.APPLICATION_JSON_UTF8_VALUE;
import static org.springframework.web.bind.annotation.RequestMethod.GET;

@Controller
@RequestMapping(value = "referenceData")
public class ReferenceDataController {


    private final ReferenceDataService referenceDataService;

    @Autowired
    public ReferenceDataController(ReferenceDataService referenceDataService) {
        this.referenceDataService = referenceDataService;
    }


    @PreAuthorize("isAuthenticated()")
    @RequestMapping(value = "/subject", method = GET, produces = APPLICATION_JSON_UTF8_VALUE)
    public HttpEntity<SkosCode> getSubject(@Param("uri") String uri) {
        return ResponseEntity.ok(referenceDataService.getSkosCode(uri));

    }


}
