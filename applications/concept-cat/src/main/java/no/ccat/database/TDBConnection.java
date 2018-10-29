package no.ccat.database;


import org.apache.jena.query.ReadWrite;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;

@Service
@Scope("thread")
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
