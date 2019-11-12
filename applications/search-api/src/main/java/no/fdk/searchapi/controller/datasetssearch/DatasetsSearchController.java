package no.fdk.searchapi.controller.datasetssearch;

import com.rometools.rome.feed.atom.Content;
import com.rometools.rome.feed.atom.Entry;
import com.rometools.rome.feed.atom.Feed;
import com.rometools.rome.feed.atom.Person;
import com.rometools.rome.feed.rss.Channel;
import com.rometools.rome.feed.rss.Guid;
import com.rometools.rome.feed.rss.Item;
import com.rometools.rome.feed.synd.SyndPerson;
import no.dcat.client.referencedata.ReferenceDataClient;
import no.fdk.searchapi.service.ElasticsearchService;
import org.elasticsearch.action.search.SearchRequestBuilder;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.sort.SortBuilder;
import org.elasticsearch.search.sort.SortBuilders;
import org.elasticsearch.search.sort.SortOrder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.annotation.PostConstruct;
import java.util.*;
import java.util.stream.Collectors;

import static org.apache.commons.lang3.StringUtils.isNotEmpty;


/**
 * A simple search service. Receives a query and forwards the query to Elasticsearch, return results.
 * <p>
 * Created by nodavsko on 29.09.2016.
 */
@RestController
public class DatasetsSearchController {
    private static Logger logger = LoggerFactory.getLogger(DatasetsSearchController.class);
    ReferenceDataClient referenceDataClient;
    private ElasticsearchService elasticsearch;

    @Value("${application.referenceDataUrl}")
    private String referenceDataUrl;

    @Autowired
    public DatasetsSearchController(ElasticsearchService elasticsearchService) {
        this.elasticsearch = elasticsearchService;
    }

    private static boolean hasLOSFilter(Map<String, String> params) {
        return params.containsKey("losTheme");
    }

    @PostConstruct
    public void initialize() {
        this.referenceDataClient = new ReferenceDataClient(referenceDataUrl);
    }

    /**
     * Compose and execute an elasticsearch query on dcat based on the input parameters.
     * <p>
     *
     * @return List of  elasticsearch records.
     */
    @RequestMapping(value = "/datasets", method = RequestMethod.GET, produces = "application/json")
    public ResponseEntity<String> search(
        @RequestParam Map<String, String> params,

        @RequestParam(value = "lang", defaultValue = "nb", required = false)
            String lang,

        @RequestParam(value = "sortfield", defaultValue = "", required = false)
            String sortfield,

        @RequestParam(value = "sortdirection", defaultValue = "desc", required = false)
            String sortdirection,

        @RequestParam(value = "aggregations", defaultValue = "", required = false)
            String aggregations,

        @PageableDefault()
            Pageable pageable
    ) {
        logger.debug("GET /datasets?{}", params);

        int from = checkAndAdjustFrom((int) pageable.getOffset());
        int size = checkAndAdjustSize(pageable.getPageSize());

        SearchResponse response = performElasticSearchSearch(params, lang, sortfield, sortdirection, aggregations, from, size);

        return new ResponseEntity<>(response.toString(), HttpStatus.OK);
    }

    private SearchResponse performElasticSearchSearch(final Map<String, String> params, final String lang,
                                                      final String sortfield, final String sortdirection,
                                                      final String aggregations,
                                                      final int from, final int size) {
        if (hasLOSFilter(params)) {
            //Since the builder is static, it can not request expanded LOS expressions
            //from reference-data, so we do it here instead.
            String losFilters = params.get("losTheme");
            if (losFilters != null && !losFilters.isEmpty()) {
                List<String> mainTermsWithTheirExpansions = new ArrayList<>();
                String[] themes = losFilters.split(",");

                for (String theme : themes) {
                    List<String> expanded = referenceDataClient.expandLOSTemaByLOSPath(theme);
                    mainTermsWithTheirExpansions.add(expanded.stream().collect(Collectors.joining(",")));
                }
                params.put("losTheme", mainTermsWithTheirExpansions.stream().collect(Collectors.joining("|")));
            }
        }

        QueryBuilder searchQuery = new DatasetsSearchQueryBuilder()
            .lang(lang)
            .boostNationalComponents()
            .boostTitle(params.get("q"))  //If the term the user searches for is a direct hit for the title of the dataset, that result should come first
            .addFilters(params)
            .build();

        // set up search query with aggregations
        SearchRequestBuilder searchBuilder = elasticsearch.getClient().prepareSearch("dcat")
            .setTypes("dataset")
            .setQuery(searchQuery)
            .setFrom(from)
            .setSize(size);

        if (isNotEmpty(aggregations)) {
            Set<String> selectedAggregationFields = new HashSet<>(Arrays.asList(aggregations.split(",")));
            DatasetsAggregations.buildAggregations(selectedAggregationFields).stream()
                .forEach(aggregation -> searchBuilder.addAggregation(aggregation));
        }

        String returnFields = params.entrySet().stream().filter((entry) -> entry.getKey().equalsIgnoreCase("returnfields")).findFirst().map(entry -> entry.getValue()).orElse("");

        if (isNotEmpty(returnFields)) {
            searchBuilder.setFetchSource(returnFields.split(","), null);
        }

        if ("modified".equals(sortfield)) {
            SortOrder sortOrder = "asc".equals(sortdirection.toLowerCase()) ? SortOrder.ASC : SortOrder.DESC;

            SortBuilder sortBuilder = SortBuilders.fieldSort("harvest.firstHarvested")
                .order(sortOrder)
                .missing("_last");

            logger.debug("sort: {}", sortBuilder.toString());
            searchBuilder.addSort(sortBuilder);
        }

        // Execute search
        logger.debug("Executing query: {}", searchBuilder.toString());
        SearchResponse response = searchBuilder.execute().actionGet();
        logger.trace("Search response: {}", response.toString());
        return response;
    }

    @RequestMapping(value = "/datasets/search", method = RequestMethod.POST, produces = "application/json")
    public ResponseEntity<String> searchPostHandler(
        @RequestParam Map<String, String> params,

        @RequestBody Map<String, Object> body,

        @RequestParam(value = "lang", defaultValue = "nb", required = false)
            String lang,

        @RequestParam(value = "sortfield", defaultValue = "", required = false)
            String sortfield,

        @RequestParam(value = "sortdirection", defaultValue = "desc", required = false)
            String sortdirection,


        @RequestParam(value = "aggregations", defaultValue = "", required = false)
            String aggregations,

        @PageableDefault()
            Pageable pageable
    ) {
        logger.debug("POST /datasets/search{} {}", params, body);

        //merge param sets from body and query section
        Map<String, String> mergedParams = new HashMap<>(params);
        body.forEach((key, value) -> mergedParams.put(key, value.toString()));

        return search(mergedParams, lang, sortfield, sortdirection, aggregations, pageable);
    }

    /**
     * RSS
     *
     * @return The most recent datasets as RSS
     */
    @RequestMapping(value = "/datasets", method = RequestMethod.GET, produces = "application/rss+xml")
    public Channel rss(@RequestParam Map<String, String> params) {
        logger.debug("RSS GET /datasets?{}", params);

        Channel channel = new Channel();
        channel.setFeedType("rss_2.0");

        int from = 0;
        int size = 50;

        SearchResponse response = performElasticSearchSearch(params, null, "modified", "desc", null, from, size);

        List<Item> items = new ArrayList<>();
        Iterator<SearchHit> iter = response.getHits().iterator();
        while (iter.hasNext()) {
            SearchHit searchHit = iter.next();

            Item item = new Item();
            item.setUri("https://www.fellesdatakatalog.brreg.no/datasets/"+searchHit.getId());

            Guid guid = new Guid();
            guid.setValue(searchHit.getId());
            guid.setPermaLink(true);
            item.setGuid(guid);

            item.setPubDate(searchHit.getField("harvest.firstHarvested").getValue());

            item.setTitle(searchHit.getField("title.nb").getValue());

            item.setDescription(searchHit.getField("description.nb").getValue());

            item.setAuthor(searchHit.getField("publisher.name").getValue());

            items.add(item);
        }
        channel.setItems(items);

        return channel;
    }

    /**
     * Atom
     *
     * @return The most recent datasets as Atom
     */
    @RequestMapping(value = "/datasets", method = RequestMethod.GET, produces = "application/atom+xml")
    public Feed atom(@RequestParam Map<String, String> params) {
        logger.debug("ATOM GET /datasets?{}", params);

        Feed feed = new Feed();
        feed.setFeedType("atom_1.0");

        int from = 0;
        int size = 50;

        SearchResponse response = performElasticSearchSearch(params, null, "modified", "desc", null, from, size);

        List<Entry> entries = new ArrayList<>();
        Iterator<SearchHit> iter = response.getHits().iterator();
        while (iter.hasNext()) {
            SearchHit searchHit = iter.next();

            Entry entry = new Entry();

            entry.setId(searchHit.getId());

            entry.setPublished(searchHit.getField("harvest.firstHarvested").getValue());

            entry.setTitle(searchHit.getField("title.nb").getValue());

            Content content = new Content();
            content.setValue(searchHit.getField("description.nb").getValue());
            entry.setSummary(content);

            SyndPerson author = new Person();
            author.setName(searchHit.getField("publisher.name").getValue());
            entry.setAuthors(Collections.singletonList(author));

            entries.add(entry);
        }
        feed.setEntries(entries);

        return feed;
    }

    private int checkAndAdjustFrom(int from) {
        if (from < 0) {
            return 0;
        } else {
            return from;
        }
    }

    private int checkAndAdjustSize(int size) {
        if (size > 100) {
            return 100;
        }

        if (size < 0) {
            return 0;
        }

        return size;
    }


}
