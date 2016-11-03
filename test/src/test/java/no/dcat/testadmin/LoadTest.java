package no.dcat.testadmin;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.context.junit4.SpringRunner;

import javax.servlet.http.HttpSession;

/**
 * Created by nodavsko on 03.11.2016.
 */
@RunWith(SpringRunner.class)
public class LoadTest {


    @Test
    public void loadTest() {
        TestAdminController tac = new TestAdminController();

        HttpSession session = new MockHttpSession();
        ClassLoader classLoader = getClass().getClassLoader();


        String url = classLoader.getResource("dataset.ttl").getFile();

        //tac.load("dataset.ttl", session);



    }
}
