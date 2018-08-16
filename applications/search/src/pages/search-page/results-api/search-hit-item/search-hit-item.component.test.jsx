import React from 'react';
import { shallow } from 'enzyme';
import { SearchHitItem } from './search-hit-item.component';
import apis from '../../../../../test/fixtures/apis';

let defaultProps;

test('should render api-SearchHitItem correctly', () => {
  defaultProps = {
    result: apis[0].hits[0]
  };
  const wrapper = shallow(<SearchHitItem {...defaultProps} />);
  expect(wrapper).toMatchSnapshot();
});
