import {Dataset} from "./dataset";
import {Distribution} from "./distribution/distribution";

export class Validate {

    public static validateDataset(dataset: Dataset): Dataset {
        dataset = Validate.validateObject(dataset);
        /*if (!dataset.title || !dataset.description || !dataset.accessRights || !dataset.themes) {
            return null;
        } */
        dataset = Validate.validateDistribution(dataset);
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

    private static validateDistribution(dataset: Dataset) {
        for (let i=0; i<dataset.distributions.length; i++) {
            let anyValue = false;
            for (let key in dataset.distributions[i]) {
                if (!(key == "id" || key == "type")) {
                    if (dataset.distributions[i][key]) {
                        anyValue = true;
                    }
                }
            }
            if (!anyValue) {
                dataset.distributions[i] = null;
            }
        }
        for (let i=0; i<dataset.distributions.length; i++) {
            if (dataset.distributions[i] == null) {
                dataset.distributions.splice(i, 1);
            }            
        }
        if (dataset.distributions.length == 0) {
            dataset.distributions = null;
        }
        return dataset;
    }
}