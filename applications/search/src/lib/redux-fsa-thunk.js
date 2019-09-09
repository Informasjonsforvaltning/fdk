// Configures a thunk for executing a promise-based task and map its lifecycle events to redux FSA actions.
// Flux Standard Action: https://github.com/redux-utilities/flux-standard-action)

export function reduxFsaThunk(task, typeMap) {
  return async dispatch => {
    if (typeMap.onBeforeStart) {
      await dispatch({ ...typeMap.onBeforeStart });
    }

    try {
      const payload = await task();

      if (typeMap.onSuccess) {
        await dispatch({ ...typeMap.onSuccess, payload });
      }
    } catch (error) {
      if (typeMap.onError) {
        await dispatch({ ...typeMap.onError, payload: error, error: true });
      }
    }
  };
}
