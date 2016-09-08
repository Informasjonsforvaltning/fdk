package no.difi.dcat.harvester.validation;

import org.apache.jena.query.QuerySolution;
import org.apache.jena.rdf.model.Literal;
import org.apache.jena.rdf.model.RDFNode;


public class ValidationError{
      String className;
      int ruleId = -1;
      RuleSeverity ruleSeverity;
      String ruleDescription;
      String message;
      RDFNode s;
      RDFNode p;
      RDFNode o;

      public ValidationError(QuerySolution next) {
            className = next.getLiteral("Class_Name").toString();
            ruleId = next.getLiteral("Rule_ID").getInt();
            ruleSeverity = RuleSeverity.valueOf(next.getLiteral("Rule_Severity").toString());
            ruleDescription = next.getLiteral("Rule_Description").toString();

            Literal messageLiteral = next.getLiteral("message");
            if(message != null){
                  message = messageLiteral.toString();
            }
            s = next.get("s");
            p = next.get("p");
            o = next.get("o");

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

      public RDFNode getS() {
            return s;
      }

      public RDFNode getP() {
            return p;
      }

      public RDFNode getO() {
            return o;
      }

      @Override
      public String toString() {
            return "ValidationError{" +
                        "className='" + className + '\'' +
                        ", ruleId=" + ruleId +
                        ", ruleSeverity=" + ruleSeverity +
                        ", ruleDescription='" + ruleDescription + '\'' +
                        ", message='" + message + '\'' +
                        ", s=" + s +
                        ", p=" + p +
                        ", o=" + o +
                        '}';
      }
}