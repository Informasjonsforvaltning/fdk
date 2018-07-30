import React from 'react';
import Select from 'react-select';
import * as axios from 'axios';
import defaults from 'lodash/defaults';

import localization from '../../../lib/localization';
import './publishers-select.scss';

export class PublishersSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      backspaceRemoves: true,
      multi: false
    };
    this.options = defaults({
      headers: {},
      searchUrlPath: '/publisher'
    });
    this.axios = axios.create({
      baseURL: this.host,
      headers: this.options.headers
    });
    this.onChange = this.onChange.bind(this);
  }

  onChange(value) {
    if (!value) {
      this.props.onSearch(null, '');
    } else {
      this.props.onSearch(value.name, value.orgPath);
    }
  }

  static getPublishers(input) {
    if (!input) {
      return Promise.resolve({ options: [] });
    }

    return axios.get(`/publisher?q=${input}`).then(response => {
      const nodes = response.data.hits.hits.map(item => item._source);
      return { options: nodes };
    });
  }

  render() {
    return (
      <div className="section fdk-report-search-publishers">
        <div className="fdk-report-search-publishers__header mb-2">
          {localization.report.searchPublisher}
        </div>
        <Select.Async
          ignoreAccents={false}
          placeholder={localization.report.searchPublisherPlaceholder}
          searchPromptText={localization.report.typeToSearch}
          multi={this.state.multi}
          value={this.props.value}
          onChange={this.props.onChange}
          valueKey="orgPath"
          labelKey="name"
          loadOptions={PublishersSelect.getPublishers}
          backspaceRemoves={this.state.backspaceRemoves}
        />
      </div>
    );
  }
}

PublishersSelect.defaultProps = {};

PublishersSelect.propTypes = {};
