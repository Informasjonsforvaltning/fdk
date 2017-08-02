package no.dcat.authorization;

import lombok.Data;

import java.util.List;

/**
 * Created by dask on 20.06.2017.
 */
@Data
public class TestUser {

        private int user;
        private String ssn;
        private List<Entity> entities;
}
