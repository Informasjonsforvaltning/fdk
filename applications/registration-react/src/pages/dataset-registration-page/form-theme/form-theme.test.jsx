import React from 'react';
import { shallow } from 'enzyme';
import { FormThemes } from './form-theme.component';
import themes from '../../../../test/fixtures/themes';
import { themeType } from '../../../schemaTypes';

let defaultProps;
let wrapper;

beforeEach(() => {
  const { themesItems } = themes;
  defaultProps = {
    initialValues: {
      themesItems
    },
    syncErrors: {
      errorTheme: true
    }
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
