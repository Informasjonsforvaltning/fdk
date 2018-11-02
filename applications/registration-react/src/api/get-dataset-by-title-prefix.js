import axios from 'axios';

export const getDatasetByTitlePrefix = async (
  title = '',
  orgPath,
  aggregations = true,
  returnFields
) => {
  const queryParams = `title=${title}${orgPath ? `&orgPath=${orgPath}` : ''}${
    returnFields ? `&returnfields=${returnFields}` : ''
  }${aggregations ? '' : `&aggregations=false`}`;

  const url = `/search-api/datasets?${queryParams}`;

  const response = await axios
    .get(url)
    .catch(e => console.log(JSON.stringify(e))); // eslint-disable-line no-console

  return response && response.data;
};
