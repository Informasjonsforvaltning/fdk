import React from 'react';
import { shallow } from 'enzyme';
import FormThemes from '../../../src/components/reg-form-schema-theme/form';
import helptext from '../../fixtures/helptext';
import themes from '../../fixtures/themes';
import { themeType } from '../../../src/schemaTypes';

let defaultProps;
let wrapper;

beforeEach(() => {
  const { helptextItems } = helptext;
  const { themesItems } = themes;
  defaultProps = {
    initialValues: {
      themesItems
    },
    syncErrors: {
      errorTheme: true
    },
    helptextItems
  };
  wrapper = shallow(<FormThemes {...defaultProps} />);
});

test('should render FormThemes correctly', () => {
  expect(wrapper).toMatchSnapshot();
});

test('should render FormThemes correctly with theme', () => {
  const { themesItems } = themes;
  wrapper.setProps({
    initialValues: {
      theme: themeType,
      themesItems
    }
  });
  expect(wrapper).toMatchSnapshot();
});
