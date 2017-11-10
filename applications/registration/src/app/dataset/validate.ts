import {Dataset} from "./dataset";
import {Distribution} from "./distribution/distribution";

export class Validate {

    public static validateDataset(dataset: Dataset): Dataset {
        dataset = Validate.validateObject(dataset);
        dataset.distributions = Validate.distribution(dataset.distributions, ["id", "type"]);        
        dataset.samples = Validate.distribution(dataset.samples, ["id", "type"]);
        dataset = Validate.content(dataset);
        dataset = Validate.quality(dataset);
        dataset = Validate.remove(dataset);
        return dataset;
    }

    private static validateObject(obj: any): any {
        let nullCount = 0, count = 0;
        for(let key in obj) { 
            if (JSON.stringify(obj[key]) === "" || JSON.stringify(obj[key]) === "{}" || JSON.stringify(obj[key]) === "[]" || 
                    obj[key] == null || obj[key].toString().length === 0) {
                obj[key] = null;
                nullCount++;
            } else if (typeof obj[key] === "object") {
                obj[key] = Validate.validateObject(obj[key]);
                if (obj[key] == null) {
                    nullCount++;
                }
            }            
            count++;
        }
        if (count > nullCount) {
            return obj;
        }
        return null;
    }

    private static distribution(distributions: Distribution[], defaultFields: string[]): Distribution[] {
        for (let i=0; i<distributions.length; i++) {
            let anyValue = false;
            for (let key in distributions[i]) {
                //if (!(key == "id" || key == "type")) {
                if (defaultFields.find(field => field === key) == null) {
                    if (distributions[i][key]) {
                        anyValue = true;
                    }
                }
            }
            if (!anyValue) {
                distributions[i] = null;
            }
        }
        for (let i=0; i<distributions.length; i++) {
            if (distributions[i] == null) {
                distributions.splice(i, 1);
            }            
        }
        if (distributions.length == 0) {
            distributions = null;
        }
        return distributions;
    }
    
    private static content(dataset: Dataset): Dataset {
        if (dataset.hasAccuracyAnnotation && dataset.hasAccuracyAnnotation.hasBody == null) {
            dataset.hasAccuracyAnnotation = null;
        }
        if (dataset.hasAvailabilityAnnotation && dataset.hasAvailabilityAnnotation.hasBody == null) {
            dataset.hasAvailabilityAnnotation = null;
        }
        if (dataset.hasCompletenessAnnotation && dataset.hasCompletenessAnnotation.hasBody == null) {
            dataset.hasCompletenessAnnotation = null;
        }
        if (dataset.hasRelevanceAnnotation && dataset.hasRelevanceAnnotation.hasBody == null) {
            dataset.hasRelevanceAnnotation = null;
        }
        return dataset;
    }
    
    private static quality(dataset: Dataset): Dataset {
        if (dataset.hasCurrentnessAnnotation && dataset.hasCurrentnessAnnotation.hasBody == null) {
            dataset.hasCurrentnessAnnotation = null;
        }
        return dataset;
    }
    
    private static remove(dataset: any): Dataset {
        delete dataset.checkboxArray;        
        delete dataset.published;
        if (dataset.references) {
            for (let i=0; i<dataset.references.length; i++) {
                delete dataset.references[i].referenceTypeForm;                
                delete dataset.references[i].sourceForm;
            }
        }
        if (dataset.languages) {            
            for (let i=0; i<dataset.languages.length; i++) {
                delete dataset.languages[i].selected;
            }
        }
        if (dataset.distributions) {            
            for (let i=0; i<dataset.distributions.length; i++) {
                delete dataset.distributions[i].conformsToPrefLabel;
                delete dataset.distributions[i].conformsToUri;
            }
        }
        if (dataset.samples) {            
            for (let i=0; i<dataset.samples.length; i++) {
                delete dataset.samples[i].conformsToPrefLabel;                
                delete dataset.samples[i].conformsToUri;
            }
        }
        return dataset;
    }
}