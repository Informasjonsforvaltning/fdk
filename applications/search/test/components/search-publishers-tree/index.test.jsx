import React from 'react';
import { shallow } from 'enzyme';
import SearchPublishersTree from '../../../src/components/search-publishers-tree';
import publisherHierarchy from '../../fixtures/publisherHierarchy';

let onSearch;
let defaultProps;
let wrapper;

beforeEach(() => {
  onSearch = jest.fn();

  defaultProps = {
    onSearch,
    orgPath: '/STAT/872417842/960885406'
  };
  wrapper = shallow(<SearchPublishersTree {...defaultProps} />);
  wrapper.setState({
    source: publisherHierarchy
  });
});

test('should render SearchPublishersTree correctly with props', () => {
  expect(wrapper).toMatchSnapshot();
});
