package no.dcat.bddtest.cucumber.glue;

import cucumber.api.DataTable;
import cucumber.api.java.After;
import cucumber.api.java.Before;
import cucumber.api.java.en.Given;
import cucumber.api.java.en.Then;
import org.apache.commons.lang3.StringUtils;
import org.openqa.selenium.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

import static com.thoughtworks.selenium.SeleneseTestBase.assertTrue;

/**
 * Cucumber glue class for the publisher feature.
 */
public class PublisherPage extends CommonPage {
    private final Logger logger = LoggerFactory.getLogger(PublisherPage.class);
    private final String page = "publisher";

    @Before
    public void setup() {
        setupDriver();
    }

    @After
    public void shutdown() {
        stopDriver();
    }

    @Given("^I open the Publisher page in the browser\\.$")
    public void i_open_the_Publisher_page_in_the_browser() throws Throwable {
        openPage(page);
    }

    @Then("^the following Publisher and dataset aggregation shall exist:$")
    public void shallHave(DataTable publisherAggrs) {
        WebElement element = null;
        try {
            if (openPageWaitRetry(page, "publishers", 3)) {
                List<List<String>> publisherAggrsRaw = publisherAggrs.raw();

                for (List<String> publisherAggr : publisherAggrsRaw) {
                    String publisherExp = publisherAggr.get(0);
                    String countExp = publisherAggr.get(1);

                    assertTrue(String.format("The page shall have an element with id %s", publisherExp), driver.findElement(By.id(publisherExp)).isEnabled());

                    WebElement publisherElement = driver.findElement(By.id(publisherExp));

                    WebElement publisherName = publisherElement.findElement(By.name("publisher"));
                    String publisherNameStr = publisherName.getAttribute("innerHTML");

                    assertTrue(String.format("The page shall have an element with text %s", publisherExp), publisherExp.equals(publisherNameStr));

                    WebElement publisherCount = publisherElement.findElement(By.className("badge"));
                    String count = publisherCount.getAttribute("innerHTML");

                    assertTrue(String.format("The element %s shall have %s datasets, had %s.", publisherExp, countExp, count), countExp.equals(count));
                }
            }
        } finally {
            driver.close();
        }
    }

    @Then("^(\\d+) publisher shall be present as clickable links\\.$")
    public void publisher_shall_be_present_as_clickable_links(int nrOfPublisher) throws Throwable {
        List<WebElement> publisher = driver.findElements(By.xpath("//a[contains(@href, '/result')]"));
        assertTrue(String.format("Expecting %d number of publisher.", nrOfPublisher), nrOfPublisher == publisher.size());
    }

    @Then("^a search-field shall be present\\.$")
    public void a_search_field_shall_be_present() throws Throwable {
        String inputName = driver.findElement(By.xpath("html/body/div[2]/div[1]/form/div/input")).getAttribute("name");
        assertTrue(String.format("Expecting %d number of publisher.", 1), "q".equals(inputName));
    }

    @Then("^a header and a footer shall be present\\.$")
    public void a_header_and_a_footer_shall_be_present() throws Throwable {
        String header = driver.findElement(By.xpath("html/body/div[2]/header")).getText();
        String footer = driver.findElement(By.xpath("html/footer")).getText();
        assertTrue(String.format("Expecting %d number of publisher.", 1), header.contains("Felles datakatalog"));
   }

    protected String getEnv(String env) {
        String value = System.getenv(env);

        if (StringUtils.isEmpty(value)) {
            throw new RuntimeException(String.format("Environment %s variable is not defines.", env));
        }

        return value;
    }

    protected int getEnvInt(String env) {
        return Integer.valueOf(getEnv(env));
    }
}
