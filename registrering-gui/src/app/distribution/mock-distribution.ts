import { Distribution} from './distribution'

export const DISTRIBUTIONS: Distribution[] = [
    {id: "dist1", format:["application/json"], description: {"nb":"Plain data"}, accessUrl: ["http://access1"], downloadUrl: ["http://download1"], license: "http://license1" },
    {id: "dist2", format:["zip"], description: {"nb":"Compressed data"}, accessUrl: ["http://access2"], downloadUrl: ["http://download2"], license: "http://license2" },
];
