import React from 'react';
import PropTypes from 'prop-types';

import localization from '../../components/localization';
import './show-more.scss'

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
        {this.props.label && (<strong>{this.props.label}: </strong>)}
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
    if (textLength < COLLAPSE_THRESHOLD) {
      return <p>{this._renderContent()}</p>;
    }

    if (!this.state.showAll) {
      return (
        <div className="p">
          <p className="show-more__cropped-box">
            {this._renderContent()}
          </p>
          <button className="fdk-button-small" onClick={this.toggleShowAll}>
            <i className="fa mr-2 fa-angle-double-down" />
            <span>{this.props.showMoreButtonText}</span>
          </button>
        </div>
      );
    }
    return (
      <div className="p">
        <div>{this._renderContent()}</div>
        <button className="fdk-button-small" onClick={this.toggleShowAll}>
          <i className="fa mr-2 fa-angle-double-up" />
          <span>{this.props.showLessButtonText}</span>
        </button>
      </div>
    );
  }
}

ShowMore.defaultProps = {
  label:'',
  contentHtml: '',
  showMoreButtonText: localization.showLess,
  showLessButtonText: localization.showLess
};

ShowMore.propTypes = {
  label:PropTypes.string,
  contentHtml: PropTypes.string,
  showMoreButtonText: PropTypes.string,
  showLessButtonText: PropTypes.string
};
