package no.dcat.themes.database;

public interface RequiresConnectionReturn<R> {
    R withConnection(TDBInferenceService connection);
}
