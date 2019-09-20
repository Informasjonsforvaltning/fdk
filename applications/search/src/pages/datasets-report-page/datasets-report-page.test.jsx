import React from 'react';
import { shallow } from 'enzyme';
import { DatasetsReportPage } from './datasets-report-page';

test('should render DatasetsReportPage correctly', () => {
  const wrapper = shallow(
    <DatasetsReportPage
      location={{ search: '' }}
      history={{ push: () => {} }}
    />
  );
  expect(wrapper).toMatchSnapshot();
});
