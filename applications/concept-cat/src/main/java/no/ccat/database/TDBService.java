package no.ccat.database;

import org.apache.jena.query.*;
import org.apache.jena.tdb.TDB;
import org.apache.jena.tdb.TDBFactory;
import org.apache.jena.tdb.base.file.Location;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;


@Service
public class TDBService {

    static private final Logger logger = LoggerFactory.getLogger(TDBService.class);

    private final Dataset dataset;

    public TDBService() {
        this("./tdb");
    }

    public TDBService(String location) {
        dataset = TDBFactory.createDataset(Location.create(location));
        TDB.getContext().set(TDB.symUnionDefaultGraph, true);
    }

    Dataset getDataset() {
        return dataset;
    }

    @CacheEvict(cacheNames = {"codes", "themes", "helptexts"}, allEntries = true)
    public void evictCache() {
        logger.debug("Cache evicted");
    }


}
