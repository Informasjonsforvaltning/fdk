package no.dcat.themes.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

@Component
public class ConnectionManager {
    static private final Logger logger = LoggerFactory.getLogger(LOSService.class);

    public static final String DB_SCHEMA = "fdkreference";

    @Value("${spring.datasource.url}")
    public String jdbcURL;

    @Value("${spring.datasource.username}")
    public String username;

    @Value("${spring.datasource.password}")
    public String password;

    @PostConstruct
    public void makeSureSchemaExistsSinceLiquibaseCantDoThatYet() throws SQLException {
        Connection connection = DriverManager.getConnection(jdbcURL,username,password);
        connection.setAutoCommit(false);

        try (Statement stmt = connection.createStatement()) {
            logger.info("Creating schema " + DB_SCHEMA + " if not exists");
            stmt.executeUpdate("CREATE SCHEMA IF NOT EXISTS " + DB_SCHEMA);
            connection.commit();
        } catch (Exception e) {
            logger.info("Tried to create SCHEMA "+ DB_SCHEMA + " but got exception", e);
            throw e;
        }
    }
}
