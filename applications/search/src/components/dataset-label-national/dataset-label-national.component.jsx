import React from 'react';

import localization from '../../lib/localization';

export const DatasetLabelNational = () => (
  <div className="fdk-national">
    <i className="fa fa-star mr-2 fdk-color-cta" />
    <strong>{localization.search_hit.NationalBuildingBlock}</strong>
  </div>
);
