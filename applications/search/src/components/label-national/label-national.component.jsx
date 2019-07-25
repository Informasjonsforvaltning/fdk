import React from 'react';

import localization from '../../lib/localization';

export const LabelNational = () => (
  <div className="fdk-national-component align-self-center d-inline-flex text-white mr-2 mb-2">
    <i className="align-self-center fdk-national-component-icon mr-1" />

    <span className="align-self-center">
      {localization.search_hit.NationalBuildingBlock}
    </span>
  </div>
);
