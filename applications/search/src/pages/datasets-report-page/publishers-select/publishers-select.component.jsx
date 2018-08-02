import React from 'react';
import Select from 'react-select';
import * as axios from 'axios';
import PropTypes from 'prop-types';

import localization from '../../../lib/localization';
import './publishers-select.scss';

function getPublishers(input) {
  if (!input) {
    return Promise.resolve({ options: [] });
  }

  return axios.get(`/publisher?q=${input}`).then(response => {
    const nodes = response.data.hits.hits.map(item => item._source);

    return { options: nodes };
  });
}

export function PublishersSelect(props) {
  return (
    <div className="section fdk-report-search-publishers">
      <div className="fdk-report-search-publishers__header mb-2">
        {localization.report.searchPublisher}
      </div>
      <Select.Async
        ignoreAccents={false}
        placeholder={localization.report.searchPublisherPlaceholder}
        searchPromptText={localization.report.typeToSearch}
        multi={false}
        value={props.value}
        onChange={props.onChange}
        valueKey="orgPath"
        labelKey="name"
        loadOptions={getPublishers}
        backspaceRemoves
      />
    </div>
  );
}

PublishersSelect.propTypes = {
  onSearch: PropTypes.func,
  onChange: PropTypes.func,
  value: PropTypes.string
};
