import _ from 'lodash';

export function normalizeAxiosError(axiosError) {
  const { response } = axiosError;

  if (!response) {
    return { error: 'network_error' };
  }
  return {
    error: _.get(response, 'data.error', 'unknown_error'),
    statusCode: response.status
  };
}
