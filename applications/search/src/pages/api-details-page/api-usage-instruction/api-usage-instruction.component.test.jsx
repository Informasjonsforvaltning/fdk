import React from 'react';

import { shallow } from 'enzyme';

import ApiUsageInstruction from './api-usage-instruction.component';

import apiItem from '../../../mock/api.response.json';

test('should render api-ApiUsageInstruction correctly with no props', () => {
  expect(shallow(<ApiUsageInstruction />)).toMatchSnapshot();
});

test('should render api-ApiUsageInstruction correctly', () => {
  const {
    apiSpecification: { servers },
    apiSpecUrl,
    apiDocUrl
  } = apiItem;
  expect(
    shallow(
      <ApiUsageInstruction
        servers={servers}
        apiSpecUrl={apiSpecUrl}
        apiDocUrl={apiDocUrl}
      />
    )
  ).toMatchSnapshot();
});

test('should render api-ApiUsageInstruction correctly apiSpecUrl is not set', () => {
  const {
    apiSpecification: { servers },
    apiDocUrl
  } = apiItem;
  expect(
    shallow(<ApiUsageInstruction servers={servers} apiDocUrl={apiDocUrl} />)
  ).toMatchSnapshot();
});

test('should render api-ApiUsageInstruction correctly apiSpecUrl is not set', () => {
  const {
    apiSpecification: { servers },
    apiSpecUrl
  } = apiItem;
  expect(
    shallow(<ApiUsageInstruction servers={servers} apiSpecUrl={apiSpecUrl} />)
  ).toMatchSnapshot();
});

test('should render api-ApiUsageInstruction correctly apiSpecUrl and apiDocUrl are not set', () => {
  const {
    apiSpecification: { servers }
  } = apiItem;
  expect(shallow(<ApiUsageInstruction servers={servers} />)).toMatchSnapshot();
});
