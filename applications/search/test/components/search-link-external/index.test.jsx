import React from 'react';
import { shallow } from 'enzyme';
import LinkExternal from '../../../src/components/search-link-external';

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
