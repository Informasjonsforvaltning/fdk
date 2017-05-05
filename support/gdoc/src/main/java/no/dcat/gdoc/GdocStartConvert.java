package no.dcat.gdoc;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

/**
 * Created by dask on 19.01.2017.
 */
@Component
public class GdocStartConvert implements ApplicationListener<ApplicationReadyEvent> {

    private static final Logger logger = LoggerFactory.getLogger(GdocStartConvert.class);

    @Autowired
    private ApplicationContext context;

    public GdocController getController() {
        return context.getBean(GdocController.class);
    }

    @Override
    public void onApplicationEvent(ApplicationReadyEvent applicationReadyEvent) {

        try {
            logger.debug("Startup code get application context");

            GdocController gdoc = getController();

            if (gdoc != null) {
                logger.info("Run gdoc conversion at application startup");
                gdoc.runConvert();
            }

        } catch (Exception e) {
            logger.debug("Error starting convert gdoc at startup",e);
        }

    }
}
