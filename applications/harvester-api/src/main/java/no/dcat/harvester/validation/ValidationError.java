package no.dcat.harvester.validation;

import org.apache.jena.query.QuerySolution;
import org.apache.jena.rdf.model.Literal;
import org.apache.jena.rdf.model.RDFNode;

public class ValidationError{
      String className;
      int ruleId = -1;
      RuleSeverity ruleSeverity;
      String ruleDescription;
      String message;
      RDFNode subject;
      RDFNode predicate;
      RDFNode object;


      public ValidationError(QuerySolution next) {
            className = next.getLiteral("Class_Name").toString();
            ruleId = next.getLiteral("Rule_ID").getInt();
            ruleSeverity = RuleSeverity.valueOf(next.getLiteral("Rule_Severity").toString());
            ruleDescription = next.getLiteral("Rule_Description").toString();

            Literal messageLiteral = next.getLiteral("Message");

            if(messageLiteral == null) {
                  message = "Validation error: no error message supplied";
            } else {
                  message = messageLiteral.toString();
            }
            
            subject = next.get("s");
            predicate = next.get("p");
            object = next.get("o");

      }

      public boolean isError() {
            return ruleSeverity == RuleSeverity.error;
      }

      public boolean isWarning() {
            return ruleSeverity == RuleSeverity.warning;

      }

      public enum RuleSeverity{
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