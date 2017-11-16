package no.dcat.harvester.crawler.handlers;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import no.dcat.harvester.crawler.CatalogHarvestRecord;
import no.dcat.harvester.crawler.ChangeInformation;
import no.dcat.harvester.crawler.CrawlerResultHandler;
import no.dcat.harvester.crawler.DatasetHarvestRecord;
import no.dcat.harvester.crawler.DatasetLookup;
import no.dcat.harvester.crawler.ValidationStatus;
import no.dcat.shared.Dataset;
import no.dcat.shared.Distribution;
import no.dcat.shared.Subject;
import no.difi.dcat.datastore.Elasticsearch;
import no.difi.dcat.datastore.domain.DcatSource;
import no.difi.dcat.datastore.domain.dcat.builders.DcatReader;
import no.difi.dcat.datastore.domain.dcat.vocabulary.DCAT;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ResIterator;
import org.apache.jena.rdf.model.Resource;
import org.apache.jena.vocabulary.RDF;
import org.elasticsearch.action.bulk.BulkRequestBuilder;
import org.elasticsearch.action.bulk.BulkResponse;
import org.elasticsearch.action.delete.DeleteRequest;
import org.elasticsearch.action.delete.DeleteResponse;
import org.elasticsearch.action.get.GetResponse;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.Client;
import org.elasticsearch.index.query.MatchQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.sort.SortOrder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;


/**
 * Handles harvesting of dcat data sources, and saving them into elasticsearch
 */
public class ElasticSearchResultHandler implements CrawlerResultHandler {

    public static final String DCAT_INDEX = "dcat";
    public static final String SUBJECT_TYPE = "subject";
    public static final String DATASET_TYPE = "dataset";
    public static final String HARVEST_INDEX = "harvest";
    private final Logger logger = LoggerFactory.getLogger(ElasticSearchResultHandler.class);

    String hostename;
    int port;
    String clustername;
    private final String themesHostname;
    String httpUsername;
    String httpPassword;


    /**
     * Creates a new elasticsearch code result handler connected to
     * a particular elasticsearch instance.
     *
     * @param hostname host name where elasticsearch cluster is found
     * @param port port for connection to elasticserach cluster. Usually 9300
     * @param clustername Name of elasticsearch cluster
     */
    public ElasticSearchResultHandler(String hostname, int port, String clustername, String themesHostname, String httpUsername, String httpPassword) {
        this.hostename = hostname;
        this.port = port;
        this.clustername = clustername;
        this.themesHostname = themesHostname;
        this.httpUsername = httpUsername;
        this.httpPassword = httpPassword;

        logger.debug("ES clustername: " + this.clustername);
    }


    /**
     * Process a data catalog, represented as an RDF model
     *
     * @param dcatSource information about the source/provider of the data catalog
     * @param model RDF model containing the data catalog
     */
    @Override
    public void process(DcatSource dcatSource, Model model, List<String> validationResults) {
        logger.debug("Processing results Elasticsearch: " + this.hostename +":" + this.port + " cluster: "+ this.clustername);

        try (Elasticsearch elasticsearch = new Elasticsearch(hostename, port, clustername)) {
            logger.trace("Start indexing");
            indexWithElasticsearch(dcatSource, model, elasticsearch, validationResults);
        } catch (Exception e) {
            logger.error("Exception: " + e.getMessage(), e);
            throw e;
        }
        logger.trace("finished");
    }

    /**
     * Index data catalog with Elasticsearch
     * @param dcatSource information about the source/provider of the data catalog
     * @param model RDF model containing the data catalog
     * @param elasticsearch The Elasticsearch instance where the data catalog should be stored
     */
    void indexWithElasticsearch(DcatSource dcatSource, Model model, Elasticsearch elasticsearch, List<String> validationResults) {
        Gson gson = new GsonBuilder().setPrettyPrinting().setDateFormat("yyyy-MM-dd'T'HH:mm:ssX").create();

        createIndexIfNotExists(elasticsearch, DCAT_INDEX);
        createIndexIfNotExists(elasticsearch, HARVEST_INDEX);

        logger.debug("Preparing bulkRequest");
        BulkRequestBuilder bulkRequest = elasticsearch.getClient().prepareBulk();

        Set<String> datasetsInSource = getSourceDatasetUris(model);

        // todo extract logs form reader and insert into elastic
        DcatReader reader = new DcatReader(model, themesHostname, httpUsername, httpPassword);
        List<Dataset> validDatasets = reader.getDatasets();

        if (validDatasets == null || validDatasets.isEmpty()) {
            throw new RuntimeException(String.format("No valid datasets to index. %d datasets were found at source url %s", datasetsInSource.size(), dcatSource.getUrl()));
        }
        logger.info("Processing {} valid datasets. {} non valid datasets were ignored", validDatasets.size(), datasetsInSource.size() - validDatasets.size());

        saveSubjects(dcatSource, gson, bulkRequest, reader);

        Date harvestTime = new Date();

        CatalogHarvestRecord catalogRecord = new CatalogHarvestRecord();
        catalogRecord.setHarvestUrl(dcatSource.getUrl());
        catalogRecord.setDataSourceId(dcatSource.getId());
        catalogRecord.setDate(harvestTime);
        catalogRecord.setValidDatasetUris(new HashSet<>());
        catalogRecord.setNonValidDatasetUris(new HashSet<>());
        catalogRecord.getNonValidDatasetUris().addAll(datasetsInSource);

        logger.info("Number of dataset documents {} for dcat source {}", validDatasets.size(), dcatSource.getId());

        ChangeInformation stats = new ChangeInformation();
        for (Dataset dataset : validDatasets) {
            catalogRecord.getValidDatasetUris().add(dataset.getUri());
            saveDatasetAndHarvestRecord(dcatSource, elasticsearch, validationResults, gson, bulkRequest, harvestTime, dataset, stats);
        }

        // TODO : delete datasets no longer harvested
        //deleteDatasetsNotHarvested(dcatSource, elasticsearch, validDatasets, harvestTime, stats);
        MatchQueryBuilder mathcQuery = QueryBuilders.matchQuery("harvestUrl", catalogRecord.getHarvestUrl());

        SearchResponse lastCatalogRecordResponse = elasticsearch.getClient()
                .prepareSearch(HARVEST_INDEX).setTypes("catalog")
                .setQuery(mathcQuery)
                .addSort("date", SortOrder.DESC)
                .setSize(1).get();

        if (lastCatalogRecordResponse.getHits().getTotalHits() == 1) {
            CatalogHarvestRecord lastCatalogRecord = gson.fromJson(lastCatalogRecordResponse.getHits().getAt(0).getSourceAsString(), CatalogHarvestRecord.class);
            Set<String> missingUris = lastCatalogRecord.getValidDatasetUris();
            missingUris.removeAll(catalogRecord.getValidDatasetUris());

            for (String uri : missingUris) {
                DatasetLookup lookup = lookupDataset(elasticsearch.getClient(), uri, gson);
                if (lookup != null && lookup.getDatasetId() != null) {
                    elasticsearch.deleteDocument(DCAT_INDEX, DATASET_TYPE, lookup.getDatasetId());
                    logger.info("deleted dataset {} with harvest uri {}", lookup.getDatasetId(), lookup.getHarvestUri());
                    stats.setDeletes(stats.getDeletes() + 1);
                }
            }

        }

        catalogRecord.getNonValidDatasetUris().removeAll(catalogRecord.getValidDatasetUris());
        catalogRecord.setChangeInformation(stats);

        saveCatalogHarvestRecord(dcatSource, validationResults, gson, bulkRequest, harvestTime, catalogRecord);

        logger.info("/harvest/catalog/_indexRequest:\n{}", gson.toJson(catalogRecord));

        BulkResponse bulkResponse = bulkRequest.execute().actionGet();
        if (bulkResponse.hasFailures()) {
            //TODO: process failures by iterating through each bulk response item?
        }

    }

    private Set<String> getSourceDatasetUris(Model model) {
        Set<String> datasetsInSource = new HashSet<>();
        ResIterator datasetResourceIterator = model.listResourcesWithProperty(RDF.type, DCAT.Dataset);
        while (datasetResourceIterator.hasNext()) {
            Resource r = datasetResourceIterator.nextResource();
            datasetsInSource.add(r.getURI());
        }
        return datasetsInSource;
    }

    DatasetLookup lookupDataset(Client client, String uri, Gson gson) {
        GetResponse response = client.prepareGet(HARVEST_INDEX, "lookup", uri).get();

        if (response.isExists()) {
            DatasetLookup lookup = gson.fromJson(response.getSourceAsString(), DatasetLookup.class);
            return lookup;
        }

        return null;
    }

    private void saveDatasetAndHarvestRecord(DcatSource dcatSource, Elasticsearch elasticsearch, List<String> validationResults, Gson gson, BulkRequestBuilder bulkRequest, Date harvestTime, Dataset dataset, ChangeInformation stats) {
        String datasetId = null;
        DatasetLookup lookupEntry = lookupDataset(elasticsearch.getClient(), dataset.getUri(), gson);
        if (lookupEntry != null){
            datasetId = lookupEntry.getDatasetId();
            stats.setUpdates(stats.getUpdates() + 1);
        } else {
            IndexRequest lookupRequest = new IndexRequest(HARVEST_INDEX, "lookup", dataset.getId());
            datasetId = UUID.randomUUID().toString();
            stats.setInserts(stats.getInserts() + 1);
            logger.info("new dataset {} with harvestUri {}", datasetId, dataset.getUri());

            lookupEntry = new DatasetLookup();
            lookupEntry.setHarvestUri(dataset.getUri());
            lookupEntry.setDatasetId(datasetId);
            lookupRequest.source(gson.toJson(lookupEntry));

            bulkRequest.add(lookupRequest);
        }
        if (datasetId != null) {
            dataset.setId(datasetId);
        }

        DatasetHarvestRecord record = new DatasetHarvestRecord();
        record.setDatasetId(dataset.getId());
        record.setDatasetUri(dataset.getUri());
        record.setDcatSourceId(dcatSource.getId());
        record.setDataset(dataset);
        record.setDate(harvestTime);

        List<String> messages = null;
        if (validationResults != null) {
            messages = validationResults.stream().filter(m ->
                    m.contains(dataset.getUri()) && m.contains("classname='Dataset'")).collect(Collectors.toList());
            logger.debug("messages: {}", messages.toString());
            if (dataset.getDistribution() != null) {
                for (Distribution distribution : dataset.getDistribution()) {
                    List<String> distMessages = validationResults.stream().filter(m ->
                            m.contains(distribution.getUri()) && m.contains("classname='Distribution'")).collect(Collectors.toList());
                    messages.addAll(distMessages);
                }
            }
        }

        if (messages != null && !messages.isEmpty()) {
            ValidationStatus vs = new ValidationStatus();
            vs.setWarnings((int) messages.stream().filter(m -> m.contains("validation_warning")).count());
            vs.setErrors((int) messages.stream().filter(m -> m.contains("validation_error")).count());
            vs.setValidationMessages(messages);
            record.setValidationStatus(vs);
        }

        IndexRequest indexHarvestRequest = new IndexRequest(HARVEST_INDEX, "dataset");
        indexHarvestRequest.source(gson.toJson(record));
        bulkRequest.add(indexHarvestRequest);
        logger.trace("harvest/dataset/_indexRequest:\n{}", gson.toJson(record));

        logger.debug("Add dataset document {} to bulk request", dataset.getId());
        IndexRequest indexRequest = new IndexRequest(DCAT_INDEX, DATASET_TYPE, dataset.getId());
        indexRequest.source(gson.toJson(dataset));

        bulkRequest.add(indexRequest);

    }

    private void saveCatalogHarvestRecord(DcatSource dcatSource, List<String> validationResults, Gson gson, BulkRequestBuilder bulkRequest, Date harvestTime, CatalogHarvestRecord catalogRecord) {
        IndexRequest catalogCrawlRequest = new IndexRequest(HARVEST_INDEX, "catalog");
        dcatSource.getLastHarvest().ifPresent(harvest -> {
            catalogRecord.setMessage(harvest.getMessage());
            catalogRecord.setStatus(harvest.getStatus().toString());
        });
        List<String> catalogValidationMessages = null;
        if (validationResults != null) {
            catalogValidationMessages = validationResults.stream().filter(m ->
                    m.contains("classname='Catalog'")).collect(Collectors.toList());
        }

        catalogRecord.setValidationMessages(catalogValidationMessages);

        catalogCrawlRequest.source(gson.toJson(catalogRecord));
        bulkRequest.add(catalogCrawlRequest);
    }

    private void saveSubjects(DcatSource dcatSource, Gson gson, BulkRequestBuilder bulkRequest, DcatReader reader) {
        List<Subject> subjects = reader.getSubjects();
        List<Subject> filteredSubjects = subjects.stream().filter(s ->
                s.getPrefLabel() != null && s.getDefinition() != null && !s.getPrefLabel().isEmpty() && !s.getDefinition().isEmpty())
                .collect(Collectors.toList());
        ;

        logger.info("Total number of unique subject uris {} in dcat source {}.", subjects.size(), dcatSource.getId());
        logger.info("Adding {} subjects with prefLabel and definition to elastic", filteredSubjects.size());

        for (Subject subject : filteredSubjects) {

            IndexRequest indexRequest = new IndexRequest(DCAT_INDEX, SUBJECT_TYPE, subject.getUri());
            indexRequest.source(gson.toJson(subject));

            logger.debug("Add subject document {} to bulk request", subject.getUri());
            bulkRequest.add(indexRequest);
        }
    }

    private void createIndexIfNotExists(Elasticsearch elasticsearch, String indexName) {
        if (!elasticsearch.indexExists(indexName)) {
            logger.warn("Creating index: " + indexName);
            elasticsearch.createIndex(indexName);
        }else{
            logger.debug("Index exists: " + indexName);
        }
    }

}
