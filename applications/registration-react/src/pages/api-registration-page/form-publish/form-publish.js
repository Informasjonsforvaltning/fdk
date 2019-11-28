import { compose, withProps } from 'recompose';
import { FormPublishPure } from '../../../components/form-publish/form-publish-pure.component';
import { formPublishConnector } from './form-publish-connector';
import { formPublishConfigurer } from './form-publish-configurer';

const setInitialValues = withProps(({ initialItemStatus }) => ({
  initialValues: {
    registrationStatus: initialItemStatus
  }
}));

const enhance = compose(
  setInitialValues,
  formPublishConnector,
  formPublishConfigurer
);

export const FormPublish = enhance(FormPublishPure);
