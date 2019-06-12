class ApiError extends Error {
  constructor(message, status, code) {
    super(message || 'Unknown API error');
    this.name = 'ApiError';
    this.code = code || 'unknown_error';
    this.status = status;
  }
}

const extractError = async response => {
  const { error, message } = (await response.json()) || {};
  return new ApiError(message, response.status, error);
};

export async function normalizeFetchResponse(response) {
  if (!response.ok) {
    try {
      return Promise.reject(await extractError(response));
    } catch {
      return Promise.reject(new ApiError());
    }
  }

  try {
    return await response.json();
  } catch (e) {
    return null; // e.g. empty body for delete
  }
}

export function normalizeFetchError(error) {
  return Promise.reject(
    new ApiError(error.message, undefined, 'network_error')
  );
}
