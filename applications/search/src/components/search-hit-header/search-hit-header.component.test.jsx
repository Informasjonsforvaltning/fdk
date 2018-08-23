import React from 'react';
import { shallow } from 'enzyme';
import { SearchHitHeader } from './search-hit-header.component';
import { header } from './__fixtures/header';
import publishers from '../../../test/fixtures/publishers';

test('should render SearchHitHeader with no props', () => {
  const wrapper = shallow(<SearchHitHeader />);
  expect(wrapper).toMatchSnapshot();
});

test('should render SearchHitHeader with harvest dates', () => {
  const wrapper = shallow(
    <SearchHitHeader {...header} publisherItems={publishers} />
  );
  expect(wrapper).toMatchSnapshot();
});
