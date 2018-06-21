import React from 'react';
import { shallow } from 'enzyme';
import { LinkExternal } from './link-external.component';

let defaultProps;
let wrapper;

beforeEach(() => {
  defaultProps = {
    uri: 'uri',
    prefLabel: 'prefLabel'
  };
  wrapper = shallow(<LinkExternal {...defaultProps} />);
});

test('should render LinkExternal correctly', () => {
  expect(wrapper).toMatchSnapshot();
});
