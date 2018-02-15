package no.dcat.harvester.crawler.handlers;

import ch.qos.logback.classic.LoggerContext;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import no.dcat.datastore.domain.harvest.CatalogHarvestRecord;
import no.dcat.datastore.domain.harvest.ChangeInformation;
import no.dcat.harvester.clean.HtmlCleaner;
import no.dcat.harvester.crawler.CrawlerResultHandler;
import no.dcat.datastore.domain.harvest.DatasetHarvestRecord;
import no.dcat.datastore.domain.harvest.DatasetLookup;
import no.dcat.datastore.domain.harvest.ValidationStatus;
import no.dcat.harvester.crawler.notification.EmailNotificationService;
import no.dcat.harvester.crawler.notification.HarvestLogger;
import no.dcat.shared.Catalog;
import no.dcat.shared.Dataset;
import no.dcat.shared.Distribution;
import no.dcat.shared.Subject;
import no.dcat.datastore.Elasticsearch;
import no.dcat.datastore.domain.DcatSource;
import no.dcat.datastore.domain.dcat.builders.DcatReader;
import no.dcat.datastore.domain.dcat.vocabulary.DCAT;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ResIterator;
import org.apache.jena.rdf.model.Resource;
import org.apache.jena.rdf.model.Statement;
import org.apache.jena.rdf.model.StmtIterator;
import org.apache.jena.vocabulary.RDF;
import org.elasticsearch.action.bulk.BulkRequestBuilder;
import org.elasticsearch.action.bulk.BulkResponse;
import org.elasticsearch.action.get.GetResponse;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.Client;
import org.elasticsearch.index.query.ConstantScoreQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.index.query.TermQueryBuilder;
import org.elasticsearch.search.sort.SortOrder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
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
    public static final String DATE_FORMAT = "yyyy-MM-dd'T'HH:mm:ssZ";
    public static final String DEFAULT_EMAIL_SENDER = "fellesdatakatalog@brreg.no";
    public static final String VALIDATION_EMAIL_RECEIVER = "fellesdatakatalog@brreg.no"; //temporary
    public static final String VALIDATION_EMAIL_SUBJECT = "Felles datakatalog harvestlogg";
    public static final String HARVESTLOG_DIRECTORY = "harvestlog/";
    private static final SimpleDateFormat dateFormat = new SimpleDateFormat(DATE_FORMAT);

    private LoggerContext logCtx = (LoggerContext) LoggerFactory.getILoggerFactory();
    private final Logger logger = logCtx.getLogger("main");

    private EmailNotificationService notificationService;

    String hostename;
    int port;
    String clustername;
    private final String themesHostname;
    String httpUsername;
    String httpPassword;
    String notificationEmailSender;


    /**
     * Creates a new elasticsearch code result handler connected to
     * a particular elasticsearch instance.
     *
     * @param hostname host name where elasticsearch cluster is found
     * @param port port for connection to elasticserach cluster. Usually 9300
     * @param clustername Name of elasticsearch cluster
     * @param themesHostname hostname for reference-data service whitch provides themes service
     * @param httpUsername username used for posting data to reference-data service
     * @param httpPassword password used for posting data to reference-data service
     * @param notifactionEmailSender email address used as from: address in emails with validation results
     */
    public ElasticSearchResultHandler(String hostname, int port, String clustername, String themesHostname, String httpUsername, String httpPassword, String notifactionEmailSender, EmailNotificationService emailNotificationService) {
        this.hostename = hostname;
        this.port = port;
        this.clustername = clustername;
        this.themesHostname = themesHostname;
        this.httpUsername = httpUsername;
        this.httpPassword = httpPassword;
        this.notificationEmailSender = notifactionEmailSender;
        this.notificationService = emailNotificationService;

        logger.debug("ES clustername: " + this.clustername);
    }


    public ElasticSearchResultHandler(String hostname, int port, String clustername, String themesHostname, String httpUsername, String httpPassword) {
        this(hostname, port, clustername, themesHostname, httpUsername, httpPassword, DEFAULT_EMAIL_SENDER, null);
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
     * @param validationResults List of strings with result from validation rules execution
     */
    void indexWithElasticsearch(DcatSource dcatSource, Model model, Elasticsearch elasticsearch, List<String> validationResults) {
        //add special logger for the message that will be sent to dcatsource owner;
        String timestamp = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
        String logFileName = HARVESTLOG_DIRECTORY + "harvest-" + dcatSource.getOrgnumber() + "-" + timestamp + ".log";
        HarvestLogger harvestlogger = new HarvestLogger(logFileName);
        Logger harvestLog = harvestlogger.getLogger();

        harvestLog.info("Harvest log for datasource ID: " + dcatSource.getId());

        Gson gson = new GsonBuilder().setPrettyPrinting().setDateFormat(DATE_FORMAT).create();

        createIndexIfNotExists(elasticsearch, DCAT_INDEX);
        createIndexIfNotExists(elasticsearch, HARVEST_INDEX);

        Set<String> datasetsInSource = getSourceDatasetUris(model);

        // todo extract logs form reader and insert into elastic
        DcatReader reader = new DcatReader(model, themesHostname, httpUsername, httpPassword);
        List<Dataset> validDatasets = reader.getDatasets();
        List<Catalog> catalogs = reader.getCatalogs();

        if (validDatasets == null || validDatasets.isEmpty()) {
            throw new RuntimeException(
                    String.format("No valid datasets to index. %d datasets were found at source url %s",
                            datasetsInSource.size(),
                            dcatSource.getUrl()));
        }
        logger.info("Processing {} valid datasets. {} non valid datasets were ignored",
                validDatasets.size(), datasetsInSource.size() - validDatasets.size());
        //also route to harvest log - to be mailed to user
        harvestLog.info("Processing {} valid datasets. {} non valid datasets were ignored",
                validDatasets.size(), datasetsInSource.size() - validDatasets.size());

        logger.debug("Preparing bulkRequest");
        BulkRequestBuilder bulkRequest = elasticsearch.getClient().prepareBulk();
        saveSubjects(dcatSource, gson, bulkRequest, reader);

        Date harvestTime = new Date();
        logger.info("Found {} dataset documents in dcat source {}", validDatasets.size(), dcatSource.getId());
        //also route to harvest log - to be mailed to user
        harvestLog.info("Found {} dataset documents in dcat source {}", validDatasets.size(), dcatSource.getId());

        for (Catalog catalog : catalogs) {
            logger.info("Processing catalog {}", catalog.getUri());
            //also route to harvest log - to be mailed to user
            harvestLog.info("Processing catalog {}", catalog.getUri());

            CatalogHarvestRecord catalogRecord = new CatalogHarvestRecord();
            catalogRecord.setCatalogUri(catalog.getUri());
            catalogRecord.setHarvestUrl(dcatSource.getUrl());
            catalogRecord.setDataSourceId(dcatSource.getId());
            catalogRecord.setDate(harvestTime);
            catalogRecord.setValidDatasetUris(new HashSet<>());
            catalogRecord.setPublisher(catalog.getPublisher());

            ChangeInformation stats = new ChangeInformation();
            logger.debug("stats: " + stats.toString());
            for (Dataset dataset : validDatasets) {
                if (dataset.getCatalog().getUri().equals(catalog.getUri())) {
                    catalogRecord.getValidDatasetUris().add(dataset.getUri());

                    addDisplayFields(dataset);

                    saveDatasetAndHarvestRecord(dcatSource, elasticsearch, validationResults, gson, bulkRequest, harvestTime, dataset, stats);
                }
            }

            catalogRecord.setNonValidDatasetUris(new HashSet<>());
            catalogRecord.getNonValidDatasetUris().addAll(getDatasetsUris(model, catalog.getUri()));
            catalogRecord.getNonValidDatasetUris().removeAll(catalogRecord.getValidDatasetUris());

            deletePreviousDatasetsNotPresentInThisHarvest(elasticsearch, gson, catalogRecord, stats);
            catalogRecord.setChangeInformation(stats);

            saveCatalogHarvestRecord(dcatSource, validationResults, gson, bulkRequest, harvestTime, catalogRecord);

            logger.debug("/harvest/catalog/_indexRequest:\n{}", gson.toJson(catalogRecord));

            //add validation results to log to send to datasource owner
            harvestLog.info("Validation results for catalog {}:", catalog.getId());
            if(validationResults != null) {
                for (String validationResult : validationResults) {
                    harvestLog.info(validationResult);
                }
            } else {
                harvestLog.info("No validation results found for catalog {}", catalog.getId());
            }
        }

        if(notificationService != null) {
            //get contents from harvest log file
            notificationService.sendValidationResultNotification(
                    notificationEmailSender,
                    VALIDATION_EMAIL_RECEIVER, //TODO: replace with email lookop for catalog owners
                    VALIDATION_EMAIL_SUBJECT,
                    harvestlogger.getLogContents());
        } else {
            logger.warn("email notifcation service not set. Could not send email with validation results");
        }

        //delete file appender and log file
        harvestlogger.closeLog();

        BulkResponse bulkResponse = bulkRequest.execute().actionGet();
        if (bulkResponse.hasFailures()) {
            //TODO: process failures by iterating through each bulk response item?
        }

    }

    /**
     * Add extra fields to the dataset to help visualization.
     *
     * <p>Assume that description contains basic htmltags. Swap description and descriptionFormatted and clean description. </p>
     *
     * @param dataset the dataset to enhance.
     */

    private void addDisplayFields(Dataset dataset) {
        if (dataset == null || dataset.getDescription() == null)  {
            return;
        }

        dataset.setDescriptionFormatted(dataset.getDescription());

        final Map<String, String> descriptionCleaned = new HashMap<>();

        // remove formatting on description
        dataset.getDescription().forEach( (key, value) -> {
            descriptionCleaned.put(key, HtmlCleaner.cleanAllHtmlTags(value));
        });

        dataset.setDescription(descriptionCleaned);
    }

    private void deletePreviousDatasetsNotPresentInThisHarvest(Elasticsearch elasticsearch, Gson gson,
                                                               CatalogHarvestRecord thisCatalogRecord, ChangeInformation stats) {

        TermQueryBuilder termQueryBuilder = QueryBuilders.termQuery("catalogUri", thisCatalogRecord.getCatalogUri());
        ConstantScoreQueryBuilder csQueryBuilder = QueryBuilders.constantScoreQuery(termQueryBuilder);

        logger.debug("query: {}", csQueryBuilder.toString());

        SearchResponse lastCatalogRecordResponse = elasticsearch.getClient()
                .prepareSearch(HARVEST_INDEX).setTypes("catalog")
                .setQuery(csQueryBuilder)
                .addSort("date", SortOrder.DESC)
                .setSize(1).get();

        if (lastCatalogRecordResponse.getHits().getTotalHits() > 0) {
            CatalogHarvestRecord lastCatalogRecord =
                    gson.fromJson(lastCatalogRecordResponse.getHits().getAt(0).getSourceAsString(), CatalogHarvestRecord.class);

            if (lastCatalogRecord.getCatalogUri().equals(thisCatalogRecord.getCatalogUri())) {
                logger.info("Last harvest for {} was {}", lastCatalogRecord.getCatalogUri(), dateFormat.format(lastCatalogRecord.getDate()));
                logger.trace("found lastCatalogRecordResponse {}", gson.toJson(lastCatalogRecord));

                Set<String> missingUris = new HashSet<>(lastCatalogRecord.getValidDatasetUris());
                missingUris.removeAll(thisCatalogRecord.getValidDatasetUris());
                if (missingUris.size() > 0) {
                    logger.info("There are {} datasets that were not harvested this time", missingUris.size());

                    for (String uri : missingUris) {
                        DatasetLookup lookup = lookupDataset(elasticsearch.getClient(), uri, gson);
                        if (lookup != null && lookup.getDatasetId() != null) {
                            elasticsearch.deleteDocument(DCAT_INDEX, DATASET_TYPE, lookup.getDatasetId());
                            logger.info("deleted dataset {} with harvest uri {}", lookup.getDatasetId(), lookup.getHarvestUri());
                            stats.setDeletes(stats.getDeletes() + 1);
                        }
                    }
                }
            }
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

    Set<String> getDatasetsUris(Model model, String catalogUri) {
        Set<String> datasetsInCatalog = new HashSet<>();
        Resource catalogResource = model.getResource(catalogUri);
        StmtIterator iterator = catalogResource.listProperties(DCAT.dataset);
        while (iterator.hasNext()) {
            Statement statement = iterator.next();
            datasetsInCatalog.add(statement.getObject().asResource().getURI());
        }
        return datasetsInCatalog;
    }

    DatasetLookup lookupDataset(Client client, String uri, Gson gson) {
        GetResponse response = client.prepareGet(HARVEST_INDEX, "lookup", uri).get();

        if (response.isExists()) {
            DatasetLookup lookup = gson.fromJson(response.getSourceAsString(), DatasetLookup.class);
            return lookup;
        }

        return null;
    }

    private void saveDatasetAndHarvestRecord(DcatSource dcatSource, Elasticsearch elasticsearch,
                                             List<String> validationResults, Gson gson, BulkRequestBuilder bulkRequest,
                                             Date harvestTime, Dataset dataset, ChangeInformation stats) {
        String datasetId = null;
        DatasetLookup lookupEntry = lookupDataset(elasticsearch.getClient(), dataset.getUri(), gson);
        if (lookupEntry != null){
            datasetId = lookupEntry.getDatasetId();
            stats.setUpdates(stats.getUpdates() + 1);
        } else {
            datasetId = UUID.randomUUID().toString();
            stats.setInserts(stats.getInserts() + 1);
            logger.info("new dataset {} with harvestUri {}", datasetId, dataset.getUri());

            lookupEntry = new DatasetLookup();
            lookupEntry.setHarvestUri(dataset.getUri());
            lookupEntry.setDatasetId(datasetId);

            IndexRequest lookupRequest = new IndexRequest(HARVEST_INDEX, "lookup", dataset.getUri());
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

        List<String> messages = getValidationMessages(validationResults, dataset);

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

    List<String> getValidationMessages(List<String> validationResults, Dataset dataset) {
        List<String> messages = null;
        if (validationResults != null) {
            try {
                messages = validationResults.stream().filter(m ->
                        m.contains(dataset.getUri()) && m.contains("className='Dataset'")).collect(Collectors.toList());
                logger.debug("messages: {}", messages.toString());
                if (dataset.getDistribution() != null) {
                    for (Distribution distribution : dataset.getDistribution()) {
                        List<String> distMessages = validationResults.stream()
                                .filter(m -> m.contains(distribution.getUri()) && m.contains("className='Distribution'"))
                                .collect(Collectors.toList());
                        messages.addAll(distMessages);
                    }
                }
            } catch (Throwable t) {
                logger.warn("Unknown error collecting validation messages {}", t.getLocalizedMessage());
            }
        }
        return messages;
    }

    private void saveCatalogHarvestRecord(DcatSource dcatSource, List<String> validationResults, Gson gson, BulkRequestBuilder bulkRequest, Date harvestTime, CatalogHarvestRecord catalogRecord) {
        // get summary from fuseki
        dcatSource.getLastHarvest().ifPresent(harvest -> {
            catalogRecord.setMessage(harvest.getMessage());
            catalogRecord.setStatus(harvest.getStatus().toString());
        });

        List<String> catalogValidationMessages = null;
        if (validationResults != null) {
            catalogValidationMessages = validationResults.stream().filter(m ->
                    m.contains(catalogRecord.getCatalogUri()) && m.contains("className='Catalog'")).collect(Collectors.toList());
        }

        catalogRecord.setValidationMessages(catalogValidationMessages);

        IndexRequest catalogCrawlRequest = new IndexRequest(HARVEST_INDEX, "catalog");
        catalogCrawlRequest.source(gson.toJson(catalogRecord));

        bulkRequest.add(catalogCrawlRequest);
    }

    private void saveSubjects(DcatSource dcatSource, Gson gson, BulkRequestBuilder bulkRequest, DcatReader reader) {
        List<Subject> subjects = reader.getSubjects();
        List<Subject> filteredSubjects = subjects.stream().filter(s ->
                s.getPrefLabel() != null && s.getDefinition() != null && !s.getPrefLabel().isEmpty() && !s.getDefinition().isEmpty())
                .collect(Collectors.toList());

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
            logger.info("Creating index: " + indexName);
            elasticsearch.createIndex(indexName);
        }else{
            logger.debug("Index exists: " + indexName);
        }
    }

}
