// Configures a thunk for executing a promise-based task and map its lifecycle events to redux FSA actions.
// Flux Standard Action: https://github.com/redux-utilities/flux-standard-action)

export function reduxFsaThunk(task, typeMap) {
  return dispatch => {
    if (typeMap.onBeforeStart) {
      dispatch(typeMap.onBeforeStart);
    }
    task()
      .then(payload => dispatch({ ...typeMap.onSuccess, payload }))
      .catch(error => dispatch({ ...typeMap.onError, error }));
  };
}
