// Configures a thunk for executing a promise-based task and map its lifecycle events to redux FSA actions.
// Flux Standard Action: https://github.com/redux-utilities/flux-standard-action)

export function reduxFsaThunk(task, typeMap) {
  return async dispatch => {
    if (typeMap.onBeforeStart) {
      await dispatch(typeMap.onBeforeStart);
    }
    return task()
      .then(payload => dispatch({ ...typeMap.onSuccess, payload }))
      .catch(error =>
        dispatch({ ...typeMap.onError, payload: error, error: true })
      );
  };
}
