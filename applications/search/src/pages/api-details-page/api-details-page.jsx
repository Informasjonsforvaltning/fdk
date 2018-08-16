import React from 'react';
import PropTypes from 'prop-types';

import localization from '../../lib/localization';
import { ApiHeader } from './api-header/api-header.component';
import { ApiKeyInfo } from './api-key-info/api-key-info.component';
import { ApiEndpoints } from './api-endpoints/api-endpoints.component';
import { ShowMore } from '../../components/show-more/show-more';
import { StickyMenu } from './sticky-menu/sticky-menu.component';
import './api-details-page.scss';

export function ApiDetailsPage(props) {
  function _renderApiHeader() {
    const { apiItem } = props;
    const apiItemInfo = apiItem.info;
    return (
      <ApiHeader
        title={apiItemInfo.title}
        publisher={apiItem.publisher}
        harvest={apiItem.harvest}
      />
    );
  }

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
    return <ApiEndpoints name="endpoints" paths={props.apiItem.paths} />;
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
        <div className="row">
          <div className="col-12 col-lg-4 ">
                <StickyMenu />
              </div>
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

                <div className="detailBox mt-5" name="lorem">
                  <p>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.

                    Why do we use it?
                    It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).
                  </p>
                </div>
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
