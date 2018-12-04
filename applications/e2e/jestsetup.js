import { config } from "./config";

console.log("Set jest timeout to:", config.jestTimeout);

jest.setTimeout(config.jestTimeout);
