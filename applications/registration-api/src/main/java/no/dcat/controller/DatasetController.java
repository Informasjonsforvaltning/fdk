package no.dcat.controller;

import lombok.RequiredArgsConstructor;
import no.dcat.model.Dataset;
import no.dcat.service.DatasetService;
import no.fdk.webutils.exceptions.FDKException;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.PagedResources;
import org.springframework.hateoas.Resource;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import static org.springframework.http.MediaType.APPLICATION_JSON_UTF8_VALUE;

@RequiredArgsConstructor
@RestController
@RequestMapping("/catalogs/{catalogId}/datasets")
public class DatasetController {
    private final DatasetService datasetService;

    @PreAuthorize("hasPermission(#catalogId, 'organization', 'read')")
    @GetMapping(produces = APPLICATION_JSON_UTF8_VALUE)
    public PagedResources<Resource<Dataset>> listDatasets(@PathVariable("catalogId") String catalogId, Pageable pageable, PagedResourcesAssembler<Dataset> assembler) {
        return assembler.toResource(datasetService.listDatasets(catalogId, pageable));
    }

    @PreAuthorize("hasPermission(#catalogId, 'organization', 'read')")
    @GetMapping(value = "/{datasetId}", produces = APPLICATION_JSON_UTF8_VALUE)
    public Dataset getDataset(@PathVariable("catalogId") String catalogId, @PathVariable("datasetId") String datasetId) throws FDKException {
        return datasetService.getDataset(catalogId, datasetId);
    }

    @PreAuthorize("hasPermission(#catalogId, 'organization', 'write')")
    @PostMapping(consumes = APPLICATION_JSON_UTF8_VALUE, produces = APPLICATION_JSON_UTF8_VALUE)
    public Dataset createDataset(@PathVariable("catalogId") String catalogId, @RequestBody Dataset data) throws FDKException {
        return datasetService.createDataset(catalogId, data);
    }

    @PreAuthorize("hasPermission(#catalogId, 'organization', 'write')")
    @PatchMapping(value = "/{datasetId}", consumes = APPLICATION_JSON_UTF8_VALUE, produces = APPLICATION_JSON_UTF8_VALUE)
    public Dataset updateDataset(@PathVariable("catalogId") String catalogId, @PathVariable("datasetId") String datasetId, @RequestBody Dataset patch) throws FDKException {
        return datasetService.updateDataset(datasetService.getDataset(catalogId, datasetId), patch);
    }

    @PreAuthorize("hasPermission(#catalogId, 'organization', 'write')")
    @DeleteMapping(value = "/{datasetId}")
    public void removeDataset(@PathVariable("catalogId") String catalogId, @PathVariable("datasetId") String datasetId) {
        datasetService.removeDataset(catalogId, datasetId);
    }
}
