import React from 'react';
import { shallow } from 'enzyme';
import FormInformationModel, {
  renderInformationModel
} from '../../../src/components/reg-form-schema-informationmodel/form';
import helptext from '../../fixtures/helptext';

let defaultProps;
let wrapper;

beforeEach(() => {
  const { helptextItems } = helptext;
  defaultProps = {
    helptextItems
  };
  wrapper = shallow(<FormInformationModel {...defaultProps} />);
});

test('should render FormInformationModel, { renderS correctly', () => {
  expect(wrapper).toMatchSnapshot();
});

test('should render renderInformationModel correctly', () => {
  wrapper = shallow(renderInformationModel(defaultProps));
  expect(wrapper).toMatchSnapshot();
});
