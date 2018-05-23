package no.dcat.harvester.validation;

import org.apache.jena.rdf.model.RDFNode;

public class ValidationError {
    String className;
    int ruleId = -1;
    RuleSeverity ruleSeverity;
    String ruleDescription;
    String message;
    RDFNode subject;
    RDFNode predicate;
    RDFNode object;


    public ValidationError(String className,
                           int ruleId,
                           RuleSeverity ruleSeverity,
                           String ruleDescription,
                           String message,
                           RDFNode subject,
                           RDFNode predicate,
                           RDFNode object) {
        this.className = className;
        this.ruleId = ruleId;
        this.ruleSeverity = ruleSeverity;
        this.ruleDescription = ruleDescription;
        this.message = message;
        this.subject = subject;
        this.predicate = predicate;
        this.object = object;
    }

    public boolean isError() {
        return ruleSeverity == RuleSeverity.error;
    }

    public boolean isWarning() {
        return ruleSeverity == RuleSeverity.warning;

    }

    public enum RuleSeverity {
        error, warning, ok
    }

    public String getClassName() {
        return className;
    }

    public int getRuleId() {
        return ruleId;
    }

    public RuleSeverity getRuleSeverity() {
        return ruleSeverity;
    }

    public String getRuleDescription() {
        return ruleDescription;
    }

    public String getMessage() {
        return message;
    }

    public RDFNode getSubject() {
        return subject;
    }

    public RDFNode getPredicate() {
        return predicate;
    }

    public RDFNode getObject() {
        return object;
    }

    @Override
    public String toString() {
        return "ValidationError{" +
                "className='" + className + '\'' +
                ", ruleId=" + ruleId +
                ", ruleSeverity=" + ruleSeverity +
                ", ruleDescription='" + ruleDescription + '\'' +
                ", message='" + message + '\'' +
                ", subject=" + subject +
                ", predicate=" + predicate +
                ", object=" + object +
                '}';
    }
}