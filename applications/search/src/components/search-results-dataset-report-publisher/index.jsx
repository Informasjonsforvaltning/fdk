import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import * as axios from "axios";
import defaults from 'lodash/defaults';
import './index.scss';

export default class SearchPublishers extends React.Component {
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
    this.getPublishers = this.getPublishers.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onChange (value) {
    this.setState({
      value,
    });
  }

  getPublishers (input) {
    if (!input) {
      return Promise.resolve({ options: [] });
    }

    return axios.get(`/publisher?q=${input}`)
      .then((response) => {
        const hits = response.data.hits.hits;
        let nodes;
        nodes = hits.map(item => item._source);
        return { options: nodes }
      });
  }

  render() {
    const AsyncComponent = this.state.creatable
      ? Select.AsyncCreatable
      : Select.Async;
    return (
      <div className="section sk-panel">
        <div className="sk-panel__header mb-2">Velg virksomhet</div>
        <AsyncComponent
          placeholder="Søk på virksomhetsnavn..."
          searchPromptText="Skriv for å søke"
          multi={this.state.multi}
          value={this.state.value}
          onChange={this.onChange}
          valueKey="orgPath"
          labelKey="name"
          loadOptions={this.getPublishers}
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
