package no.dcat.harvester.crawler.handlers;

import ch.qos.logback.classic.LoggerContext;
import ch.qos.logback.classic.encoder.PatternLayoutEncoder;
import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.FileAppender;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonParseException;
import no.dcat.client.elasticsearch5.Elasticsearch5Client;
import no.dcat.datastore.DcatIndexUtils;
import no.dcat.datastore.domain.DcatSource;
import no.dcat.datastore.domain.dcat.builders.AbstractBuilder;
import no.dcat.datastore.domain.dcat.builders.DcatReader;
import no.dcat.datastore.domain.dcat.vocabulary.DCAT;
import no.dcat.datastore.domain.harvest.*;
import no.dcat.harvester.crawler.CrawlerResultHandler;
import no.dcat.harvester.crawler.model.DatasetWithLOS;
import no.dcat.harvester.crawler.notification.EmailNotificationService;
import no.dcat.htmlclean.HtmlCleaner;
import no.dcat.shared.*;
import org.apache.jena.rdf.model.*;
import org.apache.jena.vocabulary.RDF;
import org.elasticsearch.action.ActionListener;
import org.elasticsearch.action.bulk.BulkRequestBuilder;
import org.elasticsearch.action.bulk.BulkResponse;
import org.elasticsearch.action.get.GetRequest;
import org.elasticsearch.action.get.GetResponse;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.Client;
import org.elasticsearch.index.query.*;
import org.elasticsearch.index.reindex.BulkByScrollResponse;
import org.elasticsearch.index.reindex.DeleteByQueryAction;
import org.elasticsearch.index.reindex.DeleteByQueryRequestBuilder;
import org.elasticsearch.search.sort.SortOrder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import no.dcat.client.referencedata.ReferenceDataClient;

import java.nio.file.Files;
import java.nio.file.Path;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;


/**
 * Handles harvesting of dcat data sources, and saving them into elasticsearch
 */
public class ElasticSearchResultHandler implements CrawlerResultHandler {

    public static final String DCAT_INDEX = "dcat";
    public static final String SUBJECT_TYPE = "subject";
    public static final String DATASET_TYPE = "dataset";
    public static final String HARVEST_INDEX = "harvest";
    public static final String SUBJECT_INDEX = "scat";
    public static final String DATE_FORMAT = "yyyy-MM-dd'T'HH:mm:ssZ";
    public static final String DEFAULT_EMAIL_SENDER = "fellesdatakatalog@brreg.no";
    public static final String VALIDATION_EMAIL_RECEIVER = "joe@brreg.no"; //temporary
    public static final String VALIDATION_EMAIL_SUBJECT = "Felles datakatalog harvestlogg";
    public static final int DEFAULT_HARVESTRECORD_RETENTION_DAYS = 1000; //set  to something large if value is not specified, so records are not deleted inadvertently

    private static final Logger logger = LoggerFactory.getLogger(ElasticSearchResultHandler.class);
    private static final SimpleDateFormat dateFormat = new SimpleDateFormat(DATE_FORMAT);
    Elasticsearch5Client elasticClient;
    ReferenceDataClient referenceDataClient;
    DcatIndexUtils dcatIndexUtils;
    String clusterNodes;
    String clusterName;
    String referenceDataUrl;
    String httpUsername;
    String httpPassword;
    String notificationEmailSender;
    int harvestRecordRetentionDays;
    ch.qos.logback.classic.Logger rootLogger;
    FileAppender<ILoggingEvent> fileAppender;
    Path temporarylogFile;
    private EmailNotificationService notificationService;
    private boolean enableHarvestLog = true;
    private boolean enableChangeHandling = true;

    /**
     * Creates a new elasticsearch code result handler connected to
     * a particular elasticsearch instance.
     *
     * @param clusterNodes           Comma-separated list og <IP address or hostname>:port (usually 9300) where cluster can be reached
     * @param clusterName            Name of elasticsearch cluster
     * @param referenceDataUrl       hostname for reference-data service whitch provides themes service
     * @param httpUsername           username used for posting data to reference-data service
     * @param httpPassword           password used for posting data to reference-data service
     * @param notifactionEmailSender email address used as from: address in emails with validation results
     * @param harvestRecordRetentionDays number of days harvest records should be kept in database before they are deleted
     */
    public ElasticSearchResultHandler(String clusterNodes, String clusterName, String referenceDataUrl, String httpUsername, String httpPassword,
                                      String notifactionEmailSender, EmailNotificationService emailNotificationService, int harvestRecordRetentionDays) {
        this.clusterNodes = clusterNodes;
        this.clusterName = clusterName;
        this.referenceDataUrl = referenceDataUrl;
        this.httpUsername = httpUsername;
        this.httpPassword = httpPassword;
        this.notificationEmailSender = notifactionEmailSender;
        this.notificationService = emailNotificationService;
        this.harvestRecordRetentionDays = harvestRecordRetentionDays;

        logger.debug("ES clusterName: " + this.clusterName);

        this.elasticClient = createElasticsearch();
        this.dcatIndexUtils = new DcatIndexUtils(elasticClient);
        this.referenceDataClient = new ReferenceDataClient(referenceDataUrl);

    }

    public ElasticSearchResultHandler(String clusterNodes, String clusterName, String referenceDataUrl, String httpUsername, String httpPassword) {
        this(clusterNodes, clusterName, referenceDataUrl, httpUsername, httpPassword, DEFAULT_EMAIL_SENDER, null, DEFAULT_HARVESTRECORD_RETENTION_DAYS);
    }

    // for unit test purposes
    ElasticSearchResultHandler() {

    }

    Elasticsearch5Client createElasticsearch() {
        logger.debug("Connect to Elasticsearch: " + this.clusterNodes + " cluster: " + this.clusterName);

        return new Elasticsearch5Client(clusterNodes, clusterName);
    }

    /**
     * Process a data catalog, represented as an RDF model
     *
     * @param dcatSource information about the source/provider of the data catalog
     * @param model      RDF model containing the data catalog
     */
    @Override
    public void process(DcatSource dcatSource, Model model, List<String> validationResults) {
        try {

            logger.info("Start indexing ...");
            long startTime = System.currentTimeMillis();

            indexWithElasticsearch(dcatSource, model, elasticClient, validationResults);

            long took = (System.currentTimeMillis() - startTime) / 1000;
            logger.info("Finished indexing in {} seconds", took);
        } catch (Exception e) {
            logger.error("Exception: " + e.getMessage(), e);
            throw e;
        }

    }

    void waitForIndexing(Elasticsearch5Client elasticsearch) {
        logger.debug("Checking elasticsearch status...");
        long startTime = System.currentTimeMillis();

        elasticsearch.getClient().admin().cluster().prepareHealth()
            .setWaitForYellowStatus()
            .execute().actionGet();

        long waitTime = (System.currentTimeMillis() - startTime) / 1000;

        logger.debug("Elasticsearch is ready after {}s busy indexing", waitTime);
    }

    DcatReader getReader(Model model) {
        return new DcatReader(model, referenceDataUrl, httpUsername, httpPassword);
    }


    /**
     * Index data catalog with Elasticsearch
     *
     * @param dcatSource        information about the source/provider of the data catalog
     * @param model             RDF model containing the data catalog
     * @param elasticsearch     The Elasticsearch instance where the data catalog should be stored
     * @param validationResults List of strings with result from validation rules execution
     */
    void indexWithElasticsearch(DcatSource dcatSource, Model model, Elasticsearch5Client elasticsearch, List<String> validationResults) {

        startHarvestLog();

        DcatReader dcatReader = getReader(model);

        List<Dataset> datasets = dcatReader.getDatasets();
        List<Catalog> catalogs = dcatReader.getCatalogs();

        Set<String> datasetsInSource = getSourceDatasetUris(model);

        if (datasets == null || datasets.isEmpty()) {

            logger.error("No datasets to index. Found {} non valid datasets at url {}",
                datasetsInSource.size(),
                dcatSource.getUrl());
        } else {
            logger.info("Processing {} datasets", datasets.size());

            Gson gson = getGson();

            updateDatasets(dcatSource, model, elasticsearch, validationResults, gson, datasets, catalogs);
            updateSubjects(datasets, elasticsearch, gson);
        }

        deleteOldHarvestRecords(elasticsearch);

        stopHarvestLogAndReport(dcatSource, validationResults);
    }

    private Gson getGson() {
        // enable gson to read subtype of publisher
        RuntimeTypeAdapterFactory<Publisher> typeFactory = RuntimeTypeAdapterFactory
            .of(Publisher.class, "type")
            .registerSubtype(no.dcat.datastore.domain.dcat.Publisher.class, no.dcat.datastore.domain.dcat.Publisher.class.getName());

        return new GsonBuilder()
            .setPrettyPrinting()
            .setDateFormat(DATE_FORMAT)
            .registerTypeAdapterFactory(typeFactory)
            .create();
    }

    void startHarvestLog() {

        if (enableHarvestLog) {
            rootLogger = (ch.qos.logback.classic.Logger) LoggerFactory.getLogger("no.dcat");
            fileAppender = new FileAppender<>();

            try {
                temporarylogFile = Files.createTempFile("harvest", ".log");
                logger.info("logfile={}", temporarylogFile);

                LoggerContext lc = (LoggerContext) LoggerFactory.getILoggerFactory();

                PatternLayoutEncoder ple = new PatternLayoutEncoder();
                ple.setPattern("%level - %msg%n");
                ple.setContext(lc);
                ple.start();

                fileAppender.setFile(temporarylogFile.toString());
                fileAppender.setEncoder(ple);
                fileAppender.setContext(lc);
                fileAppender.start();

                rootLogger.addAppender(fileAppender);

            } catch (Exception e) {
                logger.error("Unable to create logging facade {}", e.getMessage());
            }
        }
    }

    String removeDuplicatedLines(String input) {
        Map<String, Integer> countThemAll = new HashMap<>();

        List<String> result = new ArrayList<>();
        String[] lines = input.split("\r\n|\r|\n");
        Set<String> uniqueLines = new HashSet<>();

        Arrays.stream(lines).forEach((String line) -> {
            if (countThemAll.containsKey(line)) {
                Integer counter = countThemAll.get(line);
                countThemAll.put(line, ++counter);
            } else {
                countThemAll.put(line, 0);
            }
            if (!uniqueLines.contains(line)) {

                result.add(line);
                uniqueLines.add(line);
            }
        });

        logger.info("Original {} lines, {} unique lines, removed {} duplicated lines", lines.length, uniqueLines.size(), lines.length - uniqueLines.size());

        return result.stream().map(line -> {
            Integer counter = countThemAll.get(line);
            if (counter > 1) {
                return line + " (Occurs " + counter + " times)";
            } else {
                return line;
            }
        }).collect(Collectors.joining("\n"));
    }

    void stopHarvestLogAndReport(DcatSource dcatSource, List<String> validationResults) {
        if (enableHarvestLog) {
            try {

                // stop logging to harvest log file
                rootLogger.detachAppender(fileAppender);
                fileAppender.stop();

                logger.info("stopped harvesterlogging");

                String dcatSyntaxValidation = validationResults != null ? validationResults.stream().map(Object::toString).collect(Collectors.joining("\n")) : "";
                //get contents from harvest log file
                String semanticValidation = removeDuplicatedLines(new String(Files.readAllBytes(temporarylogFile)));

                Files.delete(temporarylogFile);

                if (notificationService != null && (!dcatSyntaxValidation.isEmpty() || !semanticValidation.isEmpty())) {
                    //add special logger for the message that will be sent to dcatsource owner;
                    String timestamp = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());

                    String message = "HARVEST REPORT: " + dcatSource.getUrl() + "\n" +
                        "DATE: " + timestamp + "\n\n" +
                        "SYNTAX CHECKS\n" +
                        "--------------------\n\n" +
                        dcatSyntaxValidation + "\n\n" +
                        "SEMANTIC CHECKS\n" +
                        "--------------------\n\n" +
                        semanticValidation + "\n\n" +
                        "----- the end ------\n";

                    logger.debug("EMAIL-MESSAGE: {}", message);

                    notificationService.sendValidationResultNotification(
                        notificationEmailSender,
                        VALIDATION_EMAIL_RECEIVER, //TODO: replace with email lookop for catalog owners
                        VALIDATION_EMAIL_SUBJECT,
                        message);
                } else {
                    logger.warn("email notifcation service not set. Could not send email with validation results");
                }

            } catch (Exception e) {
                logger.warn("unable to read logContent {}", e.getMessage(), e);
            }
        }
    }

    private void updateDatasets(DcatSource dcatSource, Model model, Elasticsearch5Client elasticsearch,
                                List<String> validationResults, Gson gson,
                                List<Dataset> datasetsToImport, List<Catalog> catalogs) {

        logger.debug("Preparing bulkRequest");
        BulkRequestBuilder bulkRequest = elasticsearch.getClient().prepareBulk();

        Date harvestTime = new Date();
        logger.info("Found {} catalogs in dcat source {}", catalogs.size(), dcatSource.getId());
        logger.info("Found {} datasets that can be imported into the data catalog", datasetsToImport.size());

        for (Catalog catalog : catalogs) {

            String catalogTitle = catalog.getTitle().get(catalog.getTitle().keySet().stream().findFirst().get());

            logger.debug("Processing catalog {} - {}", catalogTitle, catalog.getUri());

            CatalogHarvestRecord catalogRecord = new CatalogHarvestRecord();
            catalogRecord.setCatalogUri(catalog.getUri());
            catalogRecord.setHarvestUrl(dcatSource.getUrl());
            catalogRecord.setDataSourceId(dcatSource.getId());
            catalogRecord.setDate(harvestTime);
            catalogRecord.setValidDatasetUris(new HashSet<>());
            catalogRecord.setPublisher(catalog.getPublisher());

            ChangeInformation stats = new ChangeInformation();
            logger.debug("stats: " + stats.toString());
            for (Dataset dataset : datasetsToImport.stream().filter(d -> d.getCatalog().getUri().equals(catalog.getUri())).collect(Collectors.toList())) {

                catalogRecord.getValidDatasetUris().add(dataset.getUri());

                addDisplayFields(dataset);

                saveDatasetAndHarvestRecord(dcatSource, elasticsearch, validationResults, gson, bulkRequest, harvestTime, dataset, stats);

            }

            catalogRecord.setNonValidDatasetUris(new HashSet<>());
            catalogRecord.getNonValidDatasetUris().addAll(getDatasetsUris(model, catalog.getUri()));
            catalogRecord.getNonValidDatasetUris().removeAll(catalogRecord.getValidDatasetUris());

            deletePreviousDatasetsNotPresentInThisHarvest(elasticsearch, gson, catalogRecord, stats);
            catalogRecord.setChangeInformation(stats);

            saveCatalogHarvestRecord(dcatSource, validationResults, gson, bulkRequest, harvestTime, catalogRecord);

            logger.trace("/harvest/catalog/_indexRequest:\n{}", gson.toJson(catalogRecord));

        }

        logger.debug("Processing {} bulkRequests ...", bulkRequest.numberOfActions());
        BulkResponse response = bulkRequest.execute().actionGet();
        if (response.hasFailures()) {
            //TODO: process failures by iterating through each bulk response item?
            logger.error("Cannot store bulk requests: {}", response.buildFailureMessage());
        }

        waitForIndexing(elasticsearch);

    }

    /**
     * Add extra fields to the dataset to help visualization.
     * <p>Assume that description contains basic htmltags. Swap description and descriptionFormatted and clean description. </p>
     *
     * @param dataset the dataset to enhance.
     */
    private void addDisplayFields(Dataset dataset) {
        if (dataset == null || dataset.getDescription() == null) {
            return;
        }

        dataset.setDescriptionFormatted(dataset.getDescription());

        final Map<String, String> descriptionCleaned = new HashMap<>();

        // remove formatting on description
        dataset.getDescription().forEach((key, value) -> {
            descriptionCleaned.put(key, HtmlCleaner.cleanAllHtmlTags(value));
        });

        dataset.setDescription(descriptionCleaned);
    }

    DatasetHarvestRecord findLastDatasetHarvestRecordWithContent(Dataset dataset, Elasticsearch5Client elasticsearch, Gson gson) {
        TermQueryBuilder hasDatasetId = QueryBuilders.termQuery("datasetId", dataset.getId());
        ExistsQueryBuilder hasDatasetValue = QueryBuilders.existsQuery("dataset");

        BoolQueryBuilder datasetWithValueQuery = QueryBuilders.boolQuery();
        datasetWithValueQuery.must(hasDatasetId).must(hasDatasetValue);

        logger.debug("query: {}", datasetWithValueQuery.toString());

        SearchResponse lastDatasetRecordResponse = elasticsearch.getClient()
            .prepareSearch(HARVEST_INDEX).setTypes("dataset")
            .setQuery(datasetWithValueQuery)
            .addSort("date", SortOrder.DESC)
            .setSize(1).get();

        if (lastDatasetRecordResponse.getHits().getTotalHits() > 0) {

            DatasetHarvestRecord lastHarvestRecord =
                gson.fromJson(lastDatasetRecordResponse.getHits().getAt(0).getSourceAsString(), DatasetHarvestRecord.class);
            if (lastHarvestRecord != null && lastHarvestRecord.getDatasetId().equals(dataset.getId())) {
                logger.debug("Found {} harvested at {}", lastHarvestRecord.getDatasetId(), dateFormat.format(lastHarvestRecord.getDate()));

                return lastHarvestRecord;
            } else {
                logger.info("Dataset {} has no harvest metadata and is never been harvested before", dataset.getUri());
            }

        }

        return null;
    }

    DatasetHarvestRecord findFirstDatasetHarvestRecord(Dataset dataset, Elasticsearch5Client elasticsearch, Gson gson) {

        TermQueryBuilder hasDatasetId = QueryBuilders.termQuery("datasetId", dataset.getId());
        logger.trace("findFirstDataset: {}", hasDatasetId.toString());

        SearchResponse firstDatasetRecordResponse = elasticsearch.getClient()
            .prepareSearch(HARVEST_INDEX).setTypes("dataset")
            .setQuery(hasDatasetId)
            .addSort("date", SortOrder.ASC)
            .setSize(1).get();

        logger.trace("find first dataset harvest record query: {}", firstDatasetRecordResponse.getHits().toString());

        if (firstDatasetRecordResponse.getHits().getTotalHits() > 0) {
            DatasetHarvestRecord firstHarvestRecord =
                gson.fromJson(firstDatasetRecordResponse.getHits().getAt(0).getSourceAsString(), DatasetHarvestRecord.class);

            logger.debug("Dataset {} was first harvested {}", firstHarvestRecord.getDatasetUri(), dateFormat.format(firstHarvestRecord.getDate()));

            return firstHarvestRecord;
        }


        return null;
    }


    void deletePreviousDatasetsNotPresentInThisHarvest(Elasticsearch5Client elasticsearch, Gson gson,
                                                       CatalogHarvestRecord thisCatalogRecord, ChangeInformation stats) {

        TermQueryBuilder termQueryBuilder = QueryBuilders.termQuery("catalogUri", thisCatalogRecord.getCatalogUri());
        ConstantScoreQueryBuilder csQueryBuilder = QueryBuilders.constantScoreQuery(termQueryBuilder);

        logger.trace("query: {}", csQueryBuilder.toString());

        SearchResponse lastCatalogRecordResponse = elasticsearch.getClient()
            .prepareSearch(HARVEST_INDEX).setTypes("catalog")
            .setQuery(csQueryBuilder)
            .addSort("date", SortOrder.DESC)
            .setSize(1).get();

        if (lastCatalogRecordResponse.getHits().getTotalHits() > 0) {
            try {
                CatalogHarvestRecord lastCatalogRecord =
                    gson.fromJson(lastCatalogRecordResponse.getHits().getAt(0).getSourceAsString(), CatalogHarvestRecord.class);

                if (lastCatalogRecord.getCatalogUri().equals(thisCatalogRecord.getCatalogUri())) {
                    logger.debug("Last harvest for {} was {}", lastCatalogRecord.getCatalogUri(), dateFormat.format(lastCatalogRecord.getDate()));
                    logger.trace("found lastCatalogRecordResponse {}", gson.toJson(lastCatalogRecord));

                    Set<String> missingUris = new HashSet<>(lastCatalogRecord.getValidDatasetUris());
                    missingUris.removeAll(thisCatalogRecord.getValidDatasetUris());
                    if (missingUris.size() > 0) {
                        logger.info("There are {} datasets that were not harvested this time", missingUris.size());

                        for (String uri : missingUris) {
                            DatasetLookup lookup = findLookupDataset(elasticsearch.getClient(), uri, gson);
                            if (lookup != null && lookup.getDatasetId() != null) {
                                DcatIndexUtils dcatIndexUtils = new DcatIndexUtils(elasticsearch);
                                dcatIndexUtils.deleteDocument(DCAT_INDEX, DATASET_TYPE, lookup.getDatasetId());
                                logger.info("deleted dataset {} with harvest uri {}", lookup.getDatasetId(), lookup.getHarvestUri());
                                stats.setDeletes(stats.getDeletes() + 1);
                            }
                        }
                    }
                }
            } catch (JsonParseException e) {
                logger.error("Unable to parse catalogHarvestRecord: {} ", lastCatalogRecordResponse.getHits().getAt(0).getSourceAsString());
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

    DatasetLookup findLookupDataset(Client client, String uri, Gson gson) {
        GetResponse response = client.prepareGet(HARVEST_INDEX, "lookup", uri).get();

        if (response.isExists()) {
            return gson.fromJson(response.getSourceAsString(), DatasetLookup.class);
        }

        return null;
    }

    private HarvestMetadata createHarvestMetadata() {
        HarvestMetadata result = new HarvestMetadata();
        result.setChanged(new ArrayList<>());

        return result;
    }

    private DatasetLookup createDatasetLookup() {
        DatasetLookup result = new DatasetLookup();
        result.setHarvest(createHarvestMetadata());

        return result;
    }

    DatasetLookup findOrCreateDatasetLookupAndUpdateDatasetId(Dataset dataset, Elasticsearch5Client elasticsearch, Gson gson, ChangeInformation stats, Date harvestTime) {
        String datasetId = null;

        // get dataset lookup entry
        DatasetLookup lookupEntry = findLookupDataset(elasticsearch.getClient(), dataset.getUri(), gson);

        if (lookupEntry == null) {

            datasetId = UUID.randomUUID().toString();
            logger.debug("new dataset {} with harvestUri {} identified", datasetId, dataset.getUri());

            lookupEntry = createDatasetLookup();
            lookupEntry.setHarvestUri(dataset.getUri());
            lookupEntry.setDatasetId(datasetId);
            lookupEntry.getHarvest().setFirstHarvested(harvestTime);
            lookupEntry.setIdentifier(dataset.getIdentifier());

            stats.setInserts(stats.getInserts() + 1);

        } else {
            datasetId = lookupEntry.getDatasetId();
            logger.debug("existing dataset {} with harvestUri {} identified", datasetId, dataset.getUri());

            if (lookupEntry.getHarvest() == null) {
                lookupEntry.setHarvest(createHarvestMetadata());
            }

            stats.setUpdates(stats.getUpdates() + 1);
        }

        dataset.setId(lookupEntry.getDatasetId());

        lookupEntry.getHarvest().setLastHarvested(harvestTime);

        return lookupEntry;
    }

    Date getFirstHarvestedDate(Dataset dataset, Elasticsearch5Client elasticsearch, Gson gson) {
        DatasetHarvestRecord firstHarvestRecord = findFirstDatasetHarvestRecord(dataset, elasticsearch, gson);
        if (firstHarvestRecord != null) {
            return firstHarvestRecord.getDate();
        }

        return null;
    }

    // TODO remove after run in production
    DatasetHarvestRecord updateDatasetHarvestRecordsAndReturnLastChanged(Dataset dataset, Elasticsearch5Client elasticsearch, Gson gson, BulkRequestBuilder bulkRequest, DatasetLookup lookupEntry) {

        logger.info("update dataset harvest records for dataset {} - {}", dataset.getId(), dataset.getUri());
        TermQueryBuilder hasDatasetId = QueryBuilders.termQuery("datasetId", dataset.getId());
        logger.debug("findAllDatasetHarvestRecords and nullify not changed datasets QUERY: {}", hasDatasetId.toString());
        boolean runner = true;
        List<DatasetHarvestRecord> allRecords = new ArrayList<>();
        Map<DatasetHarvestRecord, String> recordIdMap = new HashMap<>();
        int from = 0;
        int size = 20;

        while (runner) {
            SearchResponse harvestRecordResponse = elasticsearch.getClient()
                .prepareSearch(HARVEST_INDEX).setTypes("dataset")
                .setQuery(hasDatasetId)
                .addSort("date", SortOrder.ASC)
                .setFrom(from)
                .setSize(size).get();

            int numberOfHits = harvestRecordResponse.getHits().hits().length;
            if (numberOfHits > 0) {
                for (int i = 0; i < numberOfHits; i++) {
                    DatasetHarvestRecord harvestRecord =
                        gson.fromJson(harvestRecordResponse.getHits().getAt(i).getSourceAsString(), DatasetHarvestRecord.class);

                    if (harvestRecord.getDatasetId().equals(dataset.getId())) {
                        String recordId = harvestRecordResponse.getHits().getAt(i).getId();
                        recordIdMap.put(harvestRecord, recordId);
                        allRecords.add(harvestRecord);
                    }
                }

                from += size;
            } else {
                runner = false;
            }

        }
        DatasetHarvestRecord previousRecord = null;
        DatasetHarvestRecord lastChangedRecord = null;
        List<DatasetHarvestRecord> recordsWithNoChange = new ArrayList<>();
        for (DatasetHarvestRecord record : allRecords) {

            if (previousRecord != null) {
                if (isChanged(previousRecord, record.getDataset(), gson)) {
                    lookupEntry.getHarvest().getChanged().add(record.getDate());
                    lastChangedRecord = record;
                    lookupEntry.getHarvest().setLastChanged(record.getDate());
                } else {
                    recordsWithNoChange.add(record);
                }
            }

            previousRecord = record;
        }

        if (recordsWithNoChange.size() > 0) {
            logger.info("Dataset has been imported {} times, and has been changed {} times ", allRecords.size(), (allRecords.size()) - recordsWithNoChange.size());

            recordsWithNoChange.forEach(record -> {
                if (record.getDataset() != null) {
                    String recordId = recordIdMap.get(record);
                    logger.debug("nullify: {} harvested at {}", recordId, dateFormat.format(record.getDate()));
                    record.setDataset(null);
                    record.setValidationStatus(null);
                    bulkRequest.add(createBulkRequest(HARVEST_INDEX, "dataset", recordId, record, gson));
                }
            });
        }

        return lastChangedRecord;

    }


    void saveDatasetAndHarvestRecord(DcatSource dcatSource, Elasticsearch5Client elasticsearch,
                                     List<String> catalogValidationResults, Gson gson, BulkRequestBuilder bulkRequest,
                                     Date harvestTime, Dataset dataset, ChangeInformation stats) {

        try {
            DatasetLookup lookupEntry = findOrCreateDatasetLookupAndUpdateDatasetId(dataset, elasticsearch, gson, stats, harvestTime);

            if (!lookupEntry.getDatasetId().equals(dataset.getId())) {
                throw new Exception(String.format("LookupEntry %s does not match datasetid %s", lookupEntry.getDatasetId(), dataset.getId()));
            }

            if (enableChangeHandling) {
                DatasetHarvestRecord lastHarvestRecordWithContent;

                // compensate if we do not have first harvest date (handles old way) harvest records.
                if (lookupEntry.getHarvest().getFirstHarvested() == null) {
                    // this should be removed - TODO
                    logger.info("Dataset {} has no harvest record", dataset.getUri());
                    lookupEntry.getHarvest().setFirstHarvested(getFirstHarvestedDate(dataset, elasticsearch, gson));
                    lastHarvestRecordWithContent = updateDatasetHarvestRecordsAndReturnLastChanged(dataset, elasticsearch, gson, bulkRequest, lookupEntry);
                } else {
                    // this should remain
                    lastHarvestRecordWithContent = findLastDatasetHarvestRecordWithContent(dataset, elasticsearch, gson);
                }

                //BJG:HER forutsetter at datasett er enhdret, inntil det modsatte er bevist. Blir det riktig
                boolean isChanged = true;

                if (lastHarvestRecordWithContent != null) {
                    if (!lastHarvestRecordWithContent.getDatasetId().equals(dataset.getId())) {
                        throw new Exception(String.format("LastHarvestRecordWithChange %s does not match datasetid %s", lastHarvestRecordWithContent.getDatasetId(), dataset.getId()));
                    }
                    // detect changes
                    isChanged = isChanged(lastHarvestRecordWithContent, dataset, gson);
                }

                if (isChanged) {
                    lookupEntry.getHarvest().getChanged().add(harvestTime);
                    lookupEntry.getHarvest().setLastChanged(harvestTime);
                }

                // create a new dataset harvest record
                DatasetHarvestRecord record = createDatasetHarvestRecord(dataset, dcatSource, isChanged, harvestTime, catalogValidationResults);
                // save dataset harvest record
                bulkRequest.add(createBulkRequest(HARVEST_INDEX, "dataset", null, record, gson));

            }

            // add harvest metadata to dataset
            dataset.setHarvest(lookupEntry.getHarvest());

            // save lookup entry
            bulkRequest.add(createBulkRequest(HARVEST_INDEX, "lookup", dataset.getUri(), lookupEntry, gson));

            logger.debug("Add dataset document {} to bulk request", dataset.getId());
            // save dataset
            dataset = expandLOSTema(dataset);
            bulkRequest.add(createBulkRequest(DCAT_INDEX, DATASET_TYPE, dataset.getId(), dataset, gson));

        } catch (Exception e) {
            logger.error("Unable to index {}. Reason: {}", dataset.getUri(), e.getMessage(), e);
        }

    }

    private Dataset expandLOSTema( Dataset dataset) {
        if (referenceDataClient.hasLosCodes(dataset.getTheme())) {

            DatasetWithLOS datasetWithLOS = new DatasetWithLOS();
            BeanUtils.copyProperties(dataset, datasetWithLOS);
            datasetWithLOS.setExpandedLosTema( referenceDataClient.expandLOSTema(dataset.getTheme()));
            datasetWithLOS.setLosTheme(new ArrayList<>());
            for (DataTheme theme : dataset.getTheme()) {
                LosTheme losTheme = referenceDataClient.getLosCodeByURI(theme.getId());
                if (losTheme != null) {
                    datasetWithLOS.getLosTheme().add(losTheme);
                }
            }
            logger.debug("Expanded, the los keywords were " + datasetWithLOS.getExpandedLosTema());
            return datasetWithLOS;
        }
        return dataset;
    }

    DatasetHarvestRecord createDatasetHarvestRecord(Dataset dataset, DcatSource dcatSource, boolean isChanged, Date harvestTime, List<String> catalogValidationResults) {
        DatasetHarvestRecord record = new DatasetHarvestRecord();

        record.setDatasetId(dataset.getId());
        record.setDatasetUri(dataset.getUri());
        record.setDcatSourceId(dcatSource.getId());

        record.setDate(harvestTime);

        if (isChanged) {
            record.setDataset(dataset);
            record.setValidationStatus(extractValidationStatus(filterValidationMessagesForDataset(catalogValidationResults, dataset)));
        }

        return record;
    }

    IndexRequest createBulkRequest(String index, String type, String id, Object data, Gson gson) {
        IndexRequest request = id == null ?
            new IndexRequest(index, type) : new IndexRequest(index, type, id);
        request.source(gson.toJson(data));

        return request;
    }

    boolean isChanged(DatasetHarvestRecord lastDatasetHarvestRecord, Dataset currentDataset, Gson gson) {

        if (lastDatasetHarvestRecord == null || currentDataset == null) {
            return false;
        }

        Dataset lastSavedDataset = lastDatasetHarvestRecord.getDataset();

        if (lastSavedDataset == null) {
            return false;
        }

        boolean isEqual = isJsonEqual(currentDataset, lastSavedDataset, gson);

        if (!isEqual && (hasWrongOrgpath(currentDataset) || hasWrongOrgpath(lastSavedDataset))) {
            // TODO HACK to fix earlier handling ov annet without orgnummer
            correctOrgpath(currentDataset);
            correctOrgpath(lastSavedDataset);

            isEqual = isJsonEqual(currentDataset, lastSavedDataset, gson);
        }

        if (!isEqual && currentDataset.getContactPoint() != null && lastSavedDataset.getContactPoint() != null) { // TODO HACK to fix random generated contact point uris

            List<Contact> contacts1 = currentDataset.getContactPoint();
            List<Contact> contacts2 = lastSavedDataset.getContactPoint();

            try {
                currentDataset.setContactPoint(null);
                lastSavedDataset.setContactPoint(null);

                boolean isEqualExceptContacts = isJsonEqual(currentDataset, lastSavedDataset, gson);

                if (isEqualExceptContacts) {
                    // only compare the first? TODO fix this?
                    Contact contact1 = contacts1.get(0);
                    Contact contact2 = contacts2.get(0);

                    if (contact1 != null && contact2 != null) {
                        // ignore null uri and previously generated uris
                        if ((AbstractBuilder.hasGeneratedContactPrefix(contact1) || contact1.getUri() == null) && (AbstractBuilder.hasGeneratedContactPrefix(contact2) || contact2.getUri() == null)) {

                            isEqual = stringCompare(contact1.getEmail(), contact2.getEmail()) &&
                                stringCompare(contact1.getFullname(), contact2.getFullname()) &&
                                stringCompare(contact1.getHasTelephone(), contact2.getHasTelephone()) &&
                                stringCompare(contact1.getHasURL(), contact2.getHasURL()) &&
                                stringCompare(contact1.getOrganizationName(), contact2.getOrganizationName()) &&
                                stringCompare(contact1.getOrganizationUnit(), contact2.getOrganizationUnit());
                        }
                    }
                }
            } catch (Exception e) {
                // If this occurs the contacts are not comparable.
            } finally {
                currentDataset.setContactPoint(contacts1);
                lastSavedDataset.setContactPoint(contacts2);
            }
        }

        return !isEqual;
    }

    boolean hasWrongOrgpath(Dataset dataset) {
        if (dataset != null && dataset.getPublisher() != null && dataset.getPublisher().getOrgPath() != null) {
            return dataset.getPublisher().getOrgPath().startsWith("/ANNET/http");
        }

        return false;
    }

    void correctOrgpath(Dataset dataset) {
        if (hasWrongOrgpath(dataset)) {
            dataset.getPublisher().setOrgPath("/ANNET/" + dataset.getPublisher().getName());
            if (dataset.getCatalog() != null && dataset.getCatalog().getPublisher() != null) {
                dataset.getCatalog().getPublisher().setOrgPath("/ANNET/" + dataset.getCatalog().getPublisher().getName());
            }
        }
    }

    boolean isJsonEqual(Dataset d1, Dataset d2, Gson gson) {
        // compare json to check if the dataset objects are alike
        String c1 = gson.toJson(d1);
        String c2 = gson.toJson(d2);

        return c1.equals(c2);
    }

    boolean stringCompare(String string1, String string2) {
        if (string1 == null) {
            if (string2 == null) {
                return true;
            }
            return false;
        } else {
            if (string2 == null) {
                return false;
            }
            return string1.equals(string2);
        }
    }

    ValidationStatus extractValidationStatus(List<String> messages) {
        if (messages != null && !messages.isEmpty()) {
            ValidationStatus vs = new ValidationStatus();
            vs.setWarnings((int) messages.stream().filter(m -> m.contains("validation_warning")).count());
            vs.setErrors((int) messages.stream().filter(m -> m.contains("validation_error")).count());
            List<String> croppedMessages = messages.size() < 10 ? messages : messages.subList(0, 10);
            vs.setValidationMessages(croppedMessages); // only 10 messages stored TODO PARAMETERIZE

            return vs;
        }

        return null;
    }


    List<String> filterValidationMessagesForDataset(List<String> catalogValidationResults, Dataset dataset) {
        List<String> messages = null;
        if (catalogValidationResults != null) {
            try {
                messages = catalogValidationResults.stream().filter(m ->
                    m.contains(dataset.getUri()) && m.contains("className='Dataset'")).collect(Collectors.toList());
                logger.trace("messages: {}", messages.toString());
                if (dataset.getDistribution() != null) {
                    for (Distribution distribution : dataset.getDistribution()) {
                        List<String> distMessages = catalogValidationResults.stream()
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

    void saveCatalogHarvestRecord(DcatSource dcatSource, List<String> validationResults, Gson gson, BulkRequestBuilder bulkRequest, Date harvestTime, CatalogHarvestRecord catalogRecord) {
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




    void deleteOldHarvestRecords(Elasticsearch5Client elasticsearch) {
        Calendar deleteFromDateTime = Calendar.getInstance();
        deleteFromDateTime.add(Calendar.DATE, -harvestRecordRetentionDays);
        Date beforeDate = deleteFromDateTime.getTime();
        String beforeDateFilterStr = "now/d-" + harvestRecordRetentionDays + "d";
        logger.info("Deleting dataset harvest records created before {} using Elasticsearch filter expression: {}", beforeDate, beforeDateFilterStr);

        DeleteByQueryAction.INSTANCE.newRequestBuilder(elasticsearch.getClient())
            .filter(QueryBuilders.rangeQuery("date")
                .lte(beforeDateFilterStr))
            .source(HARVEST_INDEX)
            .execute(new ActionListener<BulkByScrollResponse>() {
                @Override
                public void onResponse(BulkByScrollResponse response) {
                    long deleted = response.getDeleted();
                    logger.info("Number of dataset harvest records deleted: {}", deleted);
                }
                @Override
                public void onFailure(Exception e) {
                    logger.error("Deleting harvest records failed. Exception: {}", e);
                }
            });
    }


    void updateSubjects(List<Dataset> datasets, Elasticsearch5Client elasticsearch, Gson gson) {

        try {

            Map<String, Subject> uniqueSubjectsToIndex = new HashMap<>();

            // find the datasets unique subjects
            datasets.forEach(dataset -> {
                if (dataset.getSubject() != null) {
                    dataset.getSubject().forEach(subject -> {

                        // only handle subjects with prefLabel
                        if (subject != null && subject.getUri() != null && subject.getPrefLabel() != null && !subject.getPrefLabel().isEmpty()) {

                            Subject uniqueSubject = uniqueSubjectsToIndex.get(subject.getUri());
                            if (uniqueSubject == null) {
                                uniqueSubjectsToIndex.put(subject.getUri(), subject);
                                uniqueSubject = subject;
                            }

                            if (uniqueSubject.getDatasets() == null) {
                                uniqueSubject.setDatasets(new ArrayList<>());
                            }

                            uniqueSubject.getDatasets().add(snuff(dataset));
                        }

                    });
                }
            });

            if (uniqueSubjectsToIndex.size() == 0) {
                return;
            }

            // find subjects already stored
            Map<String, Subject> subjectsStored = new HashMap<>();
            uniqueSubjectsToIndex.forEach((key, value) -> {

                GetResponse response = elasticsearch.getClient().get(new GetRequest(SUBJECT_INDEX, SUBJECT_TYPE, key)).actionGet();
                Subject subject = gson.fromJson(response.getSourceAsString(), Subject.class);

                if (subject != null) {
                    subjectsStored.put(key, subject);
                }
            });

            // update subjects saved
            BulkRequestBuilder bulkSubjectBuilder = elasticsearch.getClient().prepareBulk();
            uniqueSubjectsToIndex.forEach((key, uniqueSubject) -> {

                Subject storedSubject = subjectsStored.get(key);

                if (storedSubject != null) {
                    List<Dataset> storedDatasets = storedSubject.getDatasets();
                    Map<String, Dataset> datasetMap = new HashMap<>();

                    BeanUtils.copyProperties(uniqueSubject, storedSubject);

                    uniqueSubject.getDatasets().forEach(dataset -> {
                        datasetMap.put(dataset.getUri(), dataset);
                    });

                    // merge any extra dataset harvested earlier
                    storedDatasets.forEach(dataset -> {
                        if (!datasetMap.containsKey(dataset.getUri())) {
                            datasetMap.put(dataset.getUri(), snuff(dataset));
                        }
                    });

                    uniqueSubject.setDatasets(new ArrayList<>(datasetMap.values()));
                }

                IndexRequest indexRequest = new IndexRequest(SUBJECT_INDEX, SUBJECT_TYPE, uniqueSubject.getUri());
                indexRequest.source(gson.toJson(uniqueSubject));

                logger.debug("Add subject document {} to bulk request", uniqueSubject.getUri());
                bulkSubjectBuilder.add(indexRequest);

            });

            BulkResponse response = bulkSubjectBuilder.execute().actionGet();
            if (response.hasFailures()) {
                //TODO: process failures by iterating through each bulk response item?
                logger.error("Cannot store bulk requests: {}", response.buildFailureMessage());
            }

            waitForIndexing(elasticsearch);

        } catch (Exception e) {
            logger.error("Unable to index subjects: {}", e.getMessage());
        }

    }

    private Dataset snuff(Dataset d) {
        Dataset s = new Dataset();
        s.setId(d.getId());
        s.setUri(d.getUri());
        s.setTitle(d.getTitle());
        s.setDescription(d.getDescription());

        return s;
    }

}
