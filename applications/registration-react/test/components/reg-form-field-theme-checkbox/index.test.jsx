import React from 'react';
import { shallow } from 'enzyme';
import CheckboxFieldTheme from '../../../src/components/reg-form-field-theme-checkbox';
import themes from '../../fixtures/themes';

let defaultProps;
let wrapper;

beforeEach(() => {
  const { themesItems } = themes;
  defaultProps = {
    input: { name: 'theme', value: [] },
    label: 'label',
    themesItems
  };
  wrapper = shallow(<CheckboxFieldTheme {...defaultProps} />);
});

test('should render CheckboxFieldTheme correctly', () => {
  expect(wrapper).toMatchSnapshot();
});
