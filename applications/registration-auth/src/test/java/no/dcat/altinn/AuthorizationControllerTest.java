package no.dcat.altinn;

import org.junit.Test;
import org.springframework.http.HttpEntity;

import java.util.List;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;

/**
 * Created by dask on 02.08.2017.
 */
public class AuthorizationControllerTest {

    @Test
    public void success() throws Throwable {
        AuthorizationController controller = new AuthorizationController();

        HttpEntity<List<Entity>> response = controller.getReportees("true","02084902333", "4814", "3");

        List<Entity> entities = response.getBody();

        assertThat(entities.size(), is(3));
    }
}
