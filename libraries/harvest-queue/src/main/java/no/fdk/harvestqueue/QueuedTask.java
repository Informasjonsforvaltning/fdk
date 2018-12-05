package no.fdk.harvestqueue;

public interface QueuedTask {
    public String getDescription();

    public void doIt();
}
