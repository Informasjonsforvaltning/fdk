import React from 'react';
import { shallow } from 'enzyme';
import FormInformationModel, {
  renderInformationModel
} from './form-informationmodel.component';
import helptext from '../../../../test/fixtures/helptext';

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
