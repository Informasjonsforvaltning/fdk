import React from 'react';

import localization from '../../lib/localization';

export const DatasetLabelNational = () => (
  <div className="fdk-national inline-block">
    <i className="fa fa-star mr-2" />
    <strong>{localization.search_hit.NationalBuildingBlock}</strong>
  </div>
);
