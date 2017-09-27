package no.dcat.themes.database;


import org.apache.jena.query.ReadWrite;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TDBConnection {

    private TDBInferenceService tdbService;

    @Autowired
    public TDBConnection(TDBInferenceService tdbService) {
        this.tdbService = tdbService;
    }


    public <R> R inTransaction(ReadWrite readWrite, RequiresConnectionReturn<R> task) {

        tdbService.getDataset().begin(readWrite);

        try {
            return task.withConnection(tdbService);
        } finally {
            tdbService.getDataset().commit();
            if(readWrite == ReadWrite.WRITE){
                tdbService.evictCache();
            }
        }

    }
}
