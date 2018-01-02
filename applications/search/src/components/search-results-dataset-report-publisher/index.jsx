import React from 'react';
import Select from 'react-select';
import * as axios from "axios";
import defaults from 'lodash/defaults';

import localization from '../localization';
import './index.scss';

export default class SearchPublishers extends React.Component {
  static getPublishers (input) {
    if (!input) {
      return Promise.resolve({ options: [] });
    }

    return axios.get(`/publisher?q=${input}`)
      .then((response) => {
        const hits = response.data.hits.hits;
        const nodes = hits.map(item => item._source);
        return { options: nodes }
      });
  }

  constructor(props) {
    super(props);
    this.state = {
      backspaceRemoves: true,
      multi: false
    };
    this.options = defaults({
      headers:{},
      searchUrlPath: "/publisher"
    });
    this.axios = axios.create({
      baseURL:this.host,
      headers:this.options.headers
    });
    this.onChange = this.onChange.bind(this);
  }

  onChange (value) {
    this.setState({
      value,
    });
    if (!value) {
      this.props.onSearch(null, '');
    } else {
      this.props.onSearch(value.name, value.orgPath);
    }
  }

  render() {
    return (
      <div className="section sk-panel">
        <div className="sk-panel__header mb-2">{localization.report.searchPublisher}</div>
        <Select.Async
          ignoreAccents={false}
          placeholder={localization.report.searchPublisherPlaceholder}
          searchPromptText={localization.report.typeToSearch}
          multi={this.state.multi}
          value={this.state.value}
          onChange={this.onChange}
          valueKey="orgPath"
          labelKey="name"
          loadOptions={SearchPublishers.getPublishers}
          backspaceRemoves={this.state.backspaceRemoves}
        />
      </div>
    );
  }
}

SearchPublishers.defaultProps = {

};

SearchPublishers.propTypes = {

};
