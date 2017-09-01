package no.dcat.factory;

import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class DatasetIdGenerator {

    public String createId() {
        return UUID.randomUUID().toString();
    }
}
