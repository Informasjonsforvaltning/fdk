import React from 'react';
import PropTypes from 'prop-types';

import localization from '../../lib/localization';
import './show-more.scss';

export class ShowMore extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showAll: false
    };
    this.toggleShowAll = this.toggleShowAll.bind(this);
  }

  toggleShowAll() {
    this.setState({ showAll: !this.state.showAll });
  }

  _renderContent() {
    return (
      <span className="fdk-ingress">
        {this.props.label && <strong>{this.props.label}: </strong>}
        <span
          dangerouslySetInnerHTML={{
            __html: this.props.contentHtml
          }}
        />
      </span>
    );
  }

  render() {
    const textLength = this.props.contentHtml.length;
    const COLLAPSE_THRESHOLD = 300;
    let content;

    if (textLength < COLLAPSE_THRESHOLD) {
      content = this._renderContent();
    } else if (!this.state.showAll) {
      content = (
        <React.Fragment>
          <div className="show-more__cropped-box">{this._renderContent()}</div>
          <button className="fdk-button-small" onClick={this.toggleShowAll}>
            <i className="fa mr-2 fa-angle-double-down" />
            <span>{this.props.showMoreButtonText}</span>
          </button>
        </React.Fragment>
      );
    } else if (this.state.showAll) {
      content = (
        <React.Fragment>
          <div>{this._renderContent()}</div>
          <button className="fdk-button-small" onClick={this.toggleShowAll}>
            <i className="fa mr-2 fa-angle-double-up" />
            <span>{this.props.showLessButtonText}</span>
          </button>
        </React.Fragment>
      );
    }
    return (
      <div className="mb-5" name={this.props.label}>
        {content}
      </div>
    );
  }
}

ShowMore.defaultProps = {
  label: '',
  contentHtml: '',
  showMoreButtonText: localization.showLess,
  showLessButtonText: localization.showLess
};

ShowMore.propTypes = {
  label: PropTypes.string,
  contentHtml: PropTypes.string,
  showMoreButtonText: PropTypes.string,
  showLessButtonText: PropTypes.string
};
