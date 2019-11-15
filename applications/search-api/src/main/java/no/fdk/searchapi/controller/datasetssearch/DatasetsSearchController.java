package no.fdk.searchapi.controller.datasetssearch;

import com.rometools.rome.feed.atom.*;
import com.rometools.rome.feed.rss.Channel;
import com.rometools.rome.feed.rss.Description;
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
import javax.servlet.http.HttpServletRequest;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
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

    @Value("${application.searchApiHostname}")
    private String searchApiHostname;

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
    public Channel rss(HttpServletRequest httpServletRequest, @RequestParam Map<String, String> params) {
        logger.debug("RSS GET /datasets?{}", params);

        final String requestUrl = getRequestUrl(httpServletRequest);

        SimpleDateFormat outputDateFormatter = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssZ");
        DateTimeFormatter inputDateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ssZ");
        LocalDateTime now = LocalDateTime.now();

        Channel channel = new Channel();
        channel.setFeedType("rss_2.0");
        channel.setTitle("Datasett");
        channel.setDescription("Felles Datakatalog - Datasett");
        channel.setLink(requestUrl);

        List<Item> items = new ArrayList<>();

        int from = 0;
        int size = 50;

        boolean more = true;
        while (more) {
            SearchResponse response = performElasticSearchSearch(params, null, "modified", "desc", null, from, size);

            Iterator<SearchHit> iter = response.getHits().iterator();
            more &= iter.hasNext();

            while (iter.hasNext()) {
                try {
                    SearchHit searchHit = iter.next();
                    Map<String, Object> sourceMap = searchHit.getSourceAsMap();

                    Item item = new Item();
                    item.setUri(getDatasetsUrl() + "/" + searchHit.getId());

                    Guid guid = new Guid();
                    guid.setValue(searchHit.getId());
                    guid.setPermaLink(true);
                    item.setGuid(guid);

                    final String firstHarvested = (String) ((HashMap) sourceMap.get("harvest")).get("firstHarvested");
                    item.setPubDate(outputDateFormatter.parse(firstHarvested));

                    item.setTitle((String) ((HashMap) sourceMap.get("title")).get("nb"));

                    Description description = new Description();
                    description.setValue((String) ((HashMap) sourceMap.get("description")).get("nb"));
                    item.setDescription(description);

                    item.setAuthor((String) ((HashMap) sourceMap.get("publisher")).get("name"));

                    items.add(item);

                    if (more) {
                        LocalDateTime itemTime = LocalDateTime.parse(firstHarvested, inputDateFormatter);
                        if (now.minusHours(24).isAfter(itemTime)) {
                            more = false;
                        }
                    }
                } catch (Exception e) {
                }
            }

            from += size;
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
    public Feed atom(HttpServletRequest httpServletRequest, @RequestParam Map<String, String> params) {
        logger.debug("ATOM GET /datasets?{}", params);

        final String requestUrl = getRequestUrl(httpServletRequest);

        SimpleDateFormat outputDateFormatter = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssZ");
        DateTimeFormatter inputDateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ssZ");
        LocalDateTime now = LocalDateTime.now();

        Feed feed = new Feed();
        feed.setFeedType("atom_1.0");
        feed.setTitle("Datasett");
        feed.setId(requestUrl);

        List<Entry> entries = new ArrayList<>();

        int from = 0;
        int size = 50;

        boolean more = true;
        while (more) {
            SearchResponse response = performElasticSearchSearch(params, null, "modified", "desc", null, from, size);

            Iterator<SearchHit> iter = response.getHits().iterator();
            more &= iter.hasNext();

            while (iter.hasNext()) {
                try {
                    SearchHit searchHit = iter.next();
                    Map<String, Object> sourceMap = searchHit.getSourceAsMap();

                    Entry entry = new Entry();

                    entry.setId(searchHit.getId());

                    final String firstHarvested = (String) ((HashMap) sourceMap.get("harvest")).get("firstHarvested");
                    entry.setPublished(outputDateFormatter.parse(firstHarvested));

                    final String title = (String) ((HashMap) sourceMap.get("title")).get("nb");
                    entry.setTitle(title);

                    Content content = new Content();
                    content.setValue((String) ((HashMap) sourceMap.get("description")).get("nb"));
                    entry.setSummary(content);

                    Link datasetLink = new Link();
                    datasetLink.setHref(getDatasetsUrl() + "/" + searchHit.getId());
                    datasetLink.setTitle(title);
                    entry.setOtherLinks(Collections.singletonList(datasetLink));

                    SyndPerson author = new Person();
                    author.setName((String) ((HashMap) sourceMap.get("publisher")).get("name"));
                    entry.setAuthors(Collections.singletonList(author));

                    entries.add(entry);

                    if (more) {
                        LocalDateTime itemTime = LocalDateTime.parse(firstHarvested, inputDateFormatter);
                        if (now.minusHours(24).isAfter(itemTime)) {
                            more = false;
                        }
                    }
                } catch (Exception e) {
                }
            }

            from += size;
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

    private String getDatasetsUrl() {
        StringBuilder sb = new StringBuilder();
        if (isNotEmpty(this.searchApiHostname)) {
            sb.append(this.searchApiHostname);
            if (!this.searchApiHostname.endsWith("/")) {
                sb.append('/');
            }
        } else {
            sb.append("https://www.fellesdatakatalog.brreg.no/");
        }

        sb.append("datasets");
        return sb.toString();
    }

    private String getRequestUrl(final HttpServletRequest httpServletRequest) {
        StringBuilder sb = new StringBuilder();
        sb.append(getDatasetsUrl());
        String queryString = httpServletRequest.getQueryString();
        if (isNotEmpty(queryString)) {
            sb.append('?');
            try {
                sb.append(URLDecoder.decode(queryString, StandardCharsets.UTF_8.name()));
            } catch (UnsupportedEncodingException e) {
            }
        }
        return sb.toString();
    }

}
