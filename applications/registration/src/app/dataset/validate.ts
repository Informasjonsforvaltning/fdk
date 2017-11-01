import {Dataset} from "./dataset";
import {Distribution} from "./distribution/distribution";

export class Validate {

    public static validateDataset(dataset: Dataset): Dataset {
        dataset = Validate.validateObject(dataset);
        if (dataset.title == null || dataset.description == null || dataset.accessRights == null || dataset.themes == null) {
            return null;
        } 
        dataset.distributions = Validate.distribution(dataset.distributions, ["id", "type"]);
        dataset = Validate.content(dataset);
        dataset = Validate.quality(dataset);
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
}