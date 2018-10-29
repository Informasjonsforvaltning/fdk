package no.ccat.database;

public interface RequiresConnectionReturn<R> {
    R withConnection(TDBInferenceService connection);
}
