import React from 'react';
import PropTypes from 'prop-types';

import localization from '../../lib/localization';
import { ApiHeader } from './api-header/api-header.component';
import { ApiKeyInfo } from './api-key-info/api-key-info.component';
import { ApiEndpoints } from './api-endpoints/api-endpoints.component';
import { ShowMore } from '../../components/show-more/show-more';

export function ApiDetailsPage(props) {
  function _renderApiHeader() {
    const { apiItem } = props;
    const apiItemInfo = apiItem.info;
    return (
      <ApiHeader
        title={apiItemInfo.title}
        description={apiItemInfo.description}
        publisher={apiItem.publisher}
        harvest={apiItem.harvest}
      />
    );
  }

  // function _renderDistribution() {
  //   const { distribution, accessRights } = props.datasetItem;
  //   const { openLicenseItems } = props;
  //   if (!distribution) {
  //     return null;
  //   }
  //   return distribution.map(distribution => (
  //     <DatasetDistribution
  //       key={encodeURIComponent(distribution.uri)}
  //       title={localization.dataset.distribution.title}
  //       description={
  //         distribution.description
  //           ? getTranslateText(
  //               distribution.description,
  //               this.props.selectedLanguageCode
  //             )
  //           : null
  //       }
  //       accessUrl={distribution.accessURL}
  //       format={distribution.format}
  //       code={accessRights ? accessRights.code : null}
  //       license={distribution.license}
  //       conformsTo={distribution.conformsTo}
  //       page={distribution.page}
  //       type={distribution.type}
  //       openLicenseItems={openLicenseItems}
  //       selectedLanguageCode={this.props.selectedLanguageCode}
  //     />
  //   ));
  // }

  // function _renderSample() {
  //   const { sample } = props.datasetItem;
  //   if (!sample) {
  //     return null;
  //   }
  //   return sample.map(sample => (
  //     <DatasetDistribution
  //       key={encodeURIComponent(sample.uri)}
  //       title={localization.dataset.sample}
  //       description={
  //         sample.description
  //           ? getTranslateText(
  //               sample.description,
  //               this.props.selectedLanguageCode
  //             )
  //           : null
  //       }
  //       accessUrl={sample.accessURL}
  //       format={sample.format}
  //       code="SAMPLE"
  //       selectedLanguageCode={this.props.selectedLanguageCode}
  //     />
  //   ));
  // }

  function _renderKeyInfo() {
    const { apiItem } = props;
    const apiItemInfo = apiItem.info;
    return (
      <ApiKeyInfo
        accessRights={apiItemInfo.accessRights}
        // legalBasisForRestriction={apiItem.legalBasisForRestriction}
        // legalBasisForProcessing={apiItem.legalBasisForProcessing}
        // legalBasisForAccess={apiItem.legalBasisForAccess}
        type={apiItemInfo.type}
        format={apiItemInfo.format}
        // conformsTo={apiItem.conformsTo}
        // informationModel={apiItem.informationModel}
        // selectedLanguageCode={this.props.selectedLanguageCode}
      />
    );
  }

  function _renderApiEndpoints() {
    return <ApiEndpoints paths={props.apiItem.paths} />;
  }

  const { apiItem } = props;
  const { info } = apiItem;
  if (!apiItem) {
    return null;
  }
  return (
    <main id="content" className="container">
      <article>
        <div className="row">
          <div className="col-12 col-lg-8 offset-lg-4">
            {_renderApiHeader()}
          </div>
        </div>
        <hr />
        <div className="row">
          <nav className="col-12 col-lg-4 mt-3">[Sticky menu here]</nav>
          <section className="col-12 col-lg-8 mt-3">
            {info.description && (
              <ShowMore
                showMoreButtonText={localization.showFullDescription}
                label={localization.description}
                contentHtml={info.description}
              />
            )}
            {_renderKeyInfo()}
            {_renderApiEndpoints()}
          </section>
        </div>
      </article>
    </main>
  );
}

ApiDetailsPage.defaultProps = {
  apiItem: null
};

ApiDetailsPage.propTypes = {
  apiItem: PropTypes.object
};
