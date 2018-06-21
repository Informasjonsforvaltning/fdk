import React from 'react';
import { shallow } from 'enzyme';
import { FilterBox } from './filter-box.component';

let onClick;
let defaultProps;
let wrapper;

beforeEach(() => {
  onClick = jest.fn();
  defaultProps = {
    title: 'Testbox',
    filter: {
      buckets: [
        { key: 'GOVE', doc_count: 104 },
        { key: 'EDUC', doc_count: 11 },
        { key: 'HEAL', doc_count: 8 },
        { key: 'Ukjent', doc_count: 7 },
        { key: 'AGRI', doc_count: 1 },
        { key: 'TEST', doc_count: 1 }
      ]
    },
    onClick,
    activeFilter: null,
    themesItems: {
      AGRI: {
        id: 'http://publications.europa.eu/resource/authority/data-theme/AGRI',
        code: 'AGRI',
        startUse: '2015-10-01',
        title: {
          pt: 'Agricultura, pesca, silvicultura e alimentação',
          bg: 'Селско стопанство, рибарство, горско стопанство и храни'
        },
        conceptSchema: {
          id: 'http://publications.europa.eu/resource/authority/data-theme',
          title: { en: 'Dataset types Named Authority List' }
        }
      }
    }
  };
  wrapper = shallow(<FilterBox {...defaultProps} />);
});

test('should render FilterBox correctly', () => {
  expect(wrapper).toMatchSnapshot();
});

test('should render FilterBox correctly with activeFilter', () => {
  wrapper.setProps({
    activeFilter: 'GOVE'
  });
  expect(wrapper).toMatchSnapshot();
});

test('should render FilterBox correctly with activeFilter', () => {
  wrapper.setProps({
    filter: {}
  });
  expect(wrapper).toMatchSnapshot();
});

test('should handle toggleFilter', () => {
  wrapper.find('button.fdk-toggleFilter').simulate('click');
  expect(wrapper.state('openFilter')).toBe(false);
});

test('should handle toggleList', () => {
  wrapper.find('button.fdk-toggleList').simulate('click');
  expect(wrapper.state('open')).toBe(true);
});
