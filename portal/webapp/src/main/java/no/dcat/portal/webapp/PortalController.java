package no.dcat.portal.webapp;

import no.dcat.portal.webapp.comparator.PublisherOrganisasjonsformComparator;
import no.dcat.portal.webapp.comparator.ThemeTitleComparator;
import no.dcat.portal.webapp.utility.DataitemQuery;
import no.dcat.portal.webapp.utility.ResponseManipulation;
import no.dcat.portal.webapp.utility.TransformModel;
import no.difi.dcat.datastore.domain.dcat.DataTheme;
import no.difi.dcat.datastore.domain.dcat.Dataset;
import no.difi.dcat.datastore.domain.dcat.Publisher;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.StatusLine;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.utils.HttpClientUtils;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.util.EntityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.math.BigInteger;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;


/**
 * Delivers html pages to support the DCAT Portal application.
 * <p>
 * Created by nodavsko on 12.10.2016.
 */
@Controller
public class PortalController {
    public static final String MODEL_THEME = "theme";
    public static final String MODEL_PUBLISHER = "publisher";
    public static final String MODEL_RESULT = "result";

    private static Logger logger = LoggerFactory.getLogger(PortalController.class);

    private final PortalConfiguration buildMetadata;
    private static String codeLists = null;

    @Autowired
    public PortalController(final PortalConfiguration metadata) {

        this.buildMetadata = metadata;
    }

    /**
     * The result page. Sets callback service and version identification and returns
     * result.html page.
     *
     * @param session   the session objec
     * @param theme     Filter on the specified filter.
     * @param publisher Filter on the specified publisher.
     * @return the result html page (or just the name of the page)
     */
    @RequestMapping(value = {"/datasets"}, produces = "text/html")
    final ModelAndView result(final HttpSession session,
                              @RequestParam(value = "id", defaultValue = "") String id,
                              @RequestParam(value = "q", defaultValue = "") String query,
                              @RequestParam(value = "theme", defaultValue = "") String theme,
                              @RequestParam(value = "publisher", defaultValue = "") String publisher) {

        Locale locale = LocaleContextHolder.getLocale();
        logger.info("users locale: " + locale.toLanguageTag());

        if ("".equals(id)) {
            ModelAndView model = new ModelAndView("searchkit");
            model.addObject("fdkparameters",
                    "var fdkSettings = fdkSettings || {\n" +
                            "'queryUrl': '" + buildMetadata.getQueryServiceExternal() + "'\n" +
                            "};"

            );

            return model;
            /*
            ModelAndView model = new ModelAndView(MODEL_RESULT);
            model.addObject("themes", getCodeLists());
            model.addObject("query", query);

            logger.debug(buildMetadata.getQueryServiceExternal());
            logger.debug(buildMetadata.getVersionInformation());

            session.setAttribute("dcatQueryService", buildMetadata.getQueryServiceExternal());
            session.setAttribute("versionInformation", buildMetadata.getVersionInformation());
            session.setAttribute("theme", theme);
            session.setAttribute("publisher", publisher);


            return model;*/
        } else {
            return getDetailsView(id);
        }
    }

    private ModelAndView getDetailsView(@RequestParam(value = "id", defaultValue = "") String id) {
        ModelAndView model = new ModelAndView("detail");

        try {
            URI uri = new URIBuilder(buildMetadata.getDetailsServiceUrl()).addParameter("id", id).build();
            HttpClient httpClient = HttpClientBuilder.create().build();

            logger.debug(String.format("Query for dataset: %s", uri.getQuery()));
            String json = httpGet(httpClient, uri);

            logger.trace(String.format("Found dataset: %s", json));
            Dataset dataset = new ElasticSearchResponse().toListOfObjects(json, Dataset.class).get(0);

            dataset = new ResponseManipulation().fillWithAlternativeLangValIfEmpty(dataset, "nb");
            model.addObject("dataset", dataset);
        } catch (Exception e) {
            logger.error(String.format("An error occured: %s", e.getMessage()), e);
            model.addObject("exceptionmessage", e.getLocalizedMessage());
            model.setViewName("error");
        }

        return model;
    }

    /**
     * Controller for getting the dataset corresponding to the provided id.
     *
     * @param id The id that identifies the dataset.
     * @return One Dataset attatched to a ModelAndView.
     */
    @RequestMapping(value = {"/detail"}, produces = "text/html")
    public ModelAndView detail(@RequestParam(value = "id", defaultValue = "") String id) {
        return getDetailsView(id);
    }

    /**
     * Controller for getting all themes loaded in elasticsearch.
     * <p/>
     * Retrieves all themes that is loaded into elasticsearch.
     * The list is sorted on theme-name and finally added to the view model.
     * <p/>
     *
     * @return A list of DataTheme attached to a ModelAndView.
     */
    @RequestMapping(value = {"/"}, produces = "text/html")
    public ModelAndView themes(final HttpSession session) {
        ModelAndView model = new ModelAndView(MODEL_THEME);
        List<DataTheme> dataThemes = new ArrayList<>();
        Locale locale = LocaleContextHolder.getLocale();
        logger.debug(locale.getLanguage());

        try {
            HttpClient httpClient = HttpClientBuilder.create().build();
            URI uri = new URIBuilder(buildMetadata.getThemeServiceUrl()).build();
            logger.debug("Query for all themes at URL: " + uri.toString());

            String json = httpGet(httpClient, uri);
            dataThemes = new ElasticSearchResponse().toListOfObjects(json, DataTheme.class);

            Map<String, BigInteger> themeCounts = getNumberOfElementsForThemes();
            dataThemes.forEach(dataTheme -> dataTheme.setNumberOfHits(themeCounts.getOrDefault(dataTheme.getCode(), BigInteger.ZERO).intValue()));
            dataThemes.forEach(dataTheme -> {
                if (themeCounts.containsKey(dataTheme.getCode())) {
                    dataTheme.setNumberOfHits(themeCounts.get(dataTheme.getCode()).intValue());
                }
            });

            Collections.sort(dataThemes, new ThemeTitleComparator(locale.getLanguage() == "en" ? "en" : "nb"));

            logger.trace(String.format("Found datathemes: %s", json));
        } catch (IOException | URISyntaxException e) {
            logger.error(String.format("An error occured: %s", e.getMessage()), e);
            model.addObject("exceptionmessage", e.getMessage());
            model.setViewName("error");
        }

        session.setAttribute("versionInformation", buildMetadata.getVersionInformation());
        session.setAttribute("dcatQueryService", buildMetadata.getQueryServiceExternal());

        model.addObject("lang", locale.getLanguage().equals("en") ? "en" : "nb");
        model.addObject("themes", dataThemes);
        model.addObject("dataitemquery", new DataitemQuery());
        return model;
    }

    private Map<String, BigInteger> getNumberOfElementsForThemes() throws URISyntaxException, IOException {
        HttpClient httpClient = HttpClientBuilder.create().build();
        URI uri = new URIBuilder(buildMetadata.getThemeCounterUrl()).build();
        logger.debug("Query for all themes at URL: " + uri.toString());

        String json = httpGet(httpClient, uri);

        Map<String, BigInteger> themeCounts = new ElasticSearchResponse().toMapOfObjects(json, "theme_count", "doc_count", BigInteger.class);
        return themeCounts;
    }

    /**
     * Controller for getting all publisher loaded in elasticsearch.
     * <p/>
     * Retrieves all publisher loaded into elasticsearch.
     * Transfrom the list into an hierarchical model where the top-publisher is added to a list
     * which is added to the modelView. The list is sorted on type of Publisher.
     *
     * @return A list of Publisher attatched to a ModelAndView.
     */
    @RequestMapping(value = {"/publisher"}, produces = "text/html")
    public ModelAndView publisher() {
        ModelAndView model = new ModelAndView(MODEL_PUBLISHER);
        List<Publisher> publisherGrouped = new ArrayList<>();
        Map<String, String> publisherDataSetCount = new HashMap<>();

        try {
            HttpClient httpClient = HttpClientBuilder.create().build();

            // Get publishers.
            URI uri = new URIBuilder(buildMetadata.getPublisherServiceUrl()).build();
            logger.debug("Query for all publisher");

            String json = httpGet(httpClient, uri);

            List<Publisher> publishersFlat = new ElasticSearchResponse().toListOfObjects(json, Publisher.class);

            // Get aggregation on dataset for publishers.
            URI uriAggPublisher = new URIBuilder(buildMetadata.getPublisherCountServiceUrl()).build();
            logger.debug("Query for all publisher count.");

            String jsonAggPublisher = httpGet(httpClient, uriAggPublisher);
            publisherDataSetCount = new ElasticSearchResponse().toMapOfStrings(jsonAggPublisher);

            // Organise publishers from flat to hierarchical.
            List<Publisher> publishersHier = TransformModel.organisePublisherHierarcally(publishersFlat);
            publisherGrouped = TransformModel.groupPublisher(publishersHier);

            // Aggregate dataset count up the hierarchy
            publisherDataSetCount = TransformModel.aggregateDataSetCount(publisherDataSetCount, publisherGrouped);

            //Sort publisher alphabetic.
            Collections.sort(publisherGrouped, new PublisherOrganisasjonsformComparator());

            logger.trace(String.format("Found publishers: %s", json));
        } catch (Exception e) {
            logger.error(String.format("An error occured: %s", e.getMessage()));
            model.addObject("exceptionmessage", e.getMessage());
            model.setViewName("error");
        }

        model.addObject("publisher", publisherGrouped);
        model.addObject("aggpublishercount", publisherDataSetCount);
        model.addObject("dataitemquery", new DataitemQuery());
        return model;
    }

    /**
     * Returns a JSON structure that contains the code-lists that the portal webapp uses.
     * The code-lists are fetched from the query service first time.
     * <p> Code lists:
     * - data-theme (EU Themes)
     * <p> TODO - add necessary codelists
     *
     * @return a JSON of the code-lists. { "data-theme" : [ {"AGRI" : {"nb": "Jord og skogbruk"}}, ...], ...}
     */
    private String getCodeLists() {
        if (codeLists == null) {
            HttpClient httpClient = HttpClientBuilder.create().build();
            try {
                URI uri = new URIBuilder(buildMetadata.getThemeServiceUrl() + "?size=50").build();

                String json = httpGet(httpClient, uri);

                codeLists = "var codeList = { \"data-themes\":" + json + "};";

            } catch (Exception e) {
                logger.error(String.format("Could not load data-themes: %s", e.getMessage()));
                codeLists = null;
            }
        }
        return codeLists;
    }

    protected String httpGet(HttpClient httpClient, URI uri) throws IOException {
        HttpEntity entity;
        HttpResponse response = null;
        String json = null;
        try {
            HttpGet getRequest = new HttpGet(uri);
            response = httpClient.execute(getRequest);

            checkStatusCode(response);

            entity = response.getEntity();

            json = EntityUtils.toString(entity, "UTF-8");

            // Release used resources.
            EntityUtils.consume(entity);
        } finally {
            // Release used resources.
            if (response != null) {
                HttpClientUtils.closeQuietly(response);
            }
        }
        return json;
    }

    private void checkStatusCode(final HttpResponse response) {
        StatusLine statusLine = response.getStatusLine();
        if (statusLine.getStatusCode() != HttpStatus.OK.value()) {
            logger.error(String.format("Query failed, http-code: %s, reason: %s", statusLine.getStatusCode(), statusLine.getReasonPhrase()));
            throw new RuntimeException(String.format("Query failed, http-code: %s, reason: %s", statusLine.getStatusCode(), statusLine.getReasonPhrase()));
        }
    }
}
