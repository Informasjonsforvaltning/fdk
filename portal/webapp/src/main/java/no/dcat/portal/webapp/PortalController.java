package no.dcat.portal.webapp;

import com.google.gson.Gson;
import no.difi.dcat.datastore.domain.dcat.DataTheme;
import no.difi.dcat.datastore.domain.dcat.Dataset;
import no.difi.dcat.datastore.domain.dcat.Distribution;
import org.apache.http.HttpResponse;
import org.apache.http.StatusLine;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.util.EntityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpSession;
import java.net.URI;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

/**
 * Delivers html pages to support the DCAT Portal application.
 * <p>
 * <p>
 * Created by nodavsko on 12.10.2016.
 */
@Controller
public class PortalController {
    private static Logger logger = LoggerFactory.getLogger(PortalController.class);

    private final PortalConfiguration buildMetadata;

    @Autowired
    public PortalController(final PortalConfiguration metadata) {
        this.buildMetadata = metadata;
    }

    /**
     * The result page. Sets callback service and version identification and returns
     * result.html page.
     *
     * @param session the session object
     * @return the result html page (or just the name of the page)
     */
    @RequestMapping({"/"})
    final String result(final HttpSession session) {
        session.setAttribute("dcatQueryService", buildMetadata.getQueryServiceURL());

        logger.debug(buildMetadata.getQueryServiceURL());
        logger.debug(buildMetadata.getVersionInformation());

        session.setAttribute("versionInformation", buildMetadata.getVersionInformation());

        return "result"; // templates/result.html
    }

    /**
     * Controller for getting the dataset corresponding to the provided id.
     *
     * @param id The id that identifies the dataset.
     * @return ModelAndView for detail view.
     */
    @RequestMapping({"/detail"})
    public ModelAndView detail(@RequestParam(value = "id", defaultValue = "") String id) {
        ModelAndView model = new ModelAndView("detail");
        HttpClient httpClient = HttpClientBuilder.create().build();

        URI uri = null;
        try {
            uri = new URIBuilder(buildMetadata.getRetrieveDatasetServiceURL()).addParameter("id", id).build();

            logger.debug(String.format("Query for dataset: %s", uri.getQuery()));
            HttpGet getRequest = new HttpGet(uri);

            HttpResponse response = httpClient.execute(getRequest);

            checkStatusCode(response);

            String json = EntityUtils.toString(response.getEntity(), "UTF-8");

            logger.debug(String.format("Found dataset: %s", json));
            Dataset dataset = new Gson().fromJson(json, Dataset.class);

            fillWithAlternativeLangValIfEmpty(dataset, "nb");

            model.addObject("dataset", dataset);

        } catch (Exception e) {
            logger.error(String.format("An error occured: %s", e.getMessage()));
            model.addObject("exceptionmessage", e.getMessage());
            model.setViewName("error");
        }

        return model;
    }

    /**
     * Loops over all properties with a language tagg, and if the specified language is not filled out, fills it
     * with values from an other language.
     */
    private void fillWithAlternativeLangValIfEmpty(Dataset dataset, String lang) {
        fillPropWithAlternativeValIfEmpty(dataset.getTitle(), lang);
        fillPropWithAlternativeValIfEmpty(dataset.getDescription(), lang);

        if (dataset.getTheme() != null) {
            for (DataTheme dataTheme : dataset.getTheme()) {
                fillPropWithAlternativeValIfEmpty(dataTheme.getTitle(), lang);
            }
        }

        fillPropWithAlternativeValIfEmpty(dataset.getKeyword(), lang);

        if (dataset.getDistribution() != null) {
            for (Distribution distribution : dataset.getDistribution()) {
                fillPropWithAlternativeValIfEmpty(distribution.getTitle(), lang);
                fillPropWithAlternativeValIfEmpty(distribution.getDescription(), lang);
            }
        }
    }

    /**
     * If the property is not defined for the specified language, fill in with values from an other language.
     *
     */
    private void fillPropWithAlternativeValIfEmpty(Map map, String language) {
        if(map != null) {
            Object nbVal = map.get(language);
            if (nbVal == null) {
                List langs = new ArrayList<String>();
                langs.add("nb");
                langs.add("nn");
                langs.add("en");

                Object altVal = "";
                Iterator iter = langs.iterator();
                while (iter.hasNext()) {
                    altVal = map.get(iter.next());
                    if (altVal != null) break;
                }
                map.put(language, altVal);
            }
        }
    }

    private void checkStatusCode(HttpResponse response) {
        StatusLine statusLine = response.getStatusLine();
        if (statusLine.getStatusCode() != 200) {
            logger.error(String.format("Query failed, http-code: %s, reason: %s", statusLine.getStatusCode(), statusLine.getReasonPhrase()));
            throw new RuntimeException(String.format("Query failed, http-code: %s, reason: %s", statusLine.getStatusCode(), statusLine.getReasonPhrase()));
        }
    }
}
