import _ from 'lodash';
import axios from 'axios';
import { addOrReplaceParam } from "../lib/addOrReplaceUrlParam";

export const getApis = async () => {
  const apisURL = `http://localhost:8087/acat`;
  const url = addOrReplaceParam(apisURL, 'size', '50');

  const response = await axios.get(url);

  return response.data
};
