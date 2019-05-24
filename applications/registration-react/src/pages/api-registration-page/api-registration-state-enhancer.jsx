import { compose, withHandlers, withState } from 'recompose';

export const apiRegistrationStateEnhancer = compose(
  withState(
    'showImportSpecificationButtons',
    'toggleShowImportSpecificationButtons',
    false
  ),
  withState('showImportError', 'setShowImportError', false),
  withState('showImportSuccess', 'setShowImportSuccess', false),
  withHandlers({
    onToggleShowImportSpecificationButtons: props => e => {
      if (e) {
        e.preventDefault();
      }
      props.toggleShowImportSpecificationButtons(
        !props.showImportSpecificationButtons
      );
    },
    handleShowImportError: props => value => {
      props.setShowImportError(value);
    },
    handleShowImportSuccess: props => value => {
      props.setShowImportSuccess(value);
    }
  })
);
