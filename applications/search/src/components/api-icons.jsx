import React from 'react';
import localization from '../lib/localization';

export const iconIsFree = () => (
  <span className="access-icon flex-fill fdk-color-success">
    <span className="icon2-icon-api-cost-none">
      <span className="path1" />
      <span className="path2" />
      <span className="path3" />
      <span className="path4" />
      <span className="path5" />
    </span>
    {localization.api.access.isFree}
  </span>
);

export const iconIsNotFree = () => (
  <span className="access-icon flex-fill fdk-color-danger">
    <span className="icon2-icon-api-cost">
      <span className="path1" />
      <span className="path2" />
    </span>
    {localization.api.access.isNotFree}
  </span>
);

export const iconIsOpenAccess = () => (
  <span className="access-icon flex-fill fdk-color-success">
    <span className="icon2-icon-api-access-all">
      <span className="path1" />
      <span className="path2" />
      <span className="path3" />
      <span className="path4" />
    </span>
    {localization.api.access.isOpenAccess}
  </span>
);

export const iconIsNotOpenAccess = () => (
  <span className="access-icon flex-fill fdk-color-danger">
    <span className="icon2-icon-api-access-not-limited">
      <span className="path1" />
      <span className="path2" />
    </span>
    {localization.api.access.isNotOpenAccess}
  </span>
);

export const iconIsOpenLicense = () => (
  <span className="access-icon flex-fill fdk-color-success">
    <span className="icon2-icon-api-license-open">
      <span className="path1" />
      <span className="path2" />
      <span className="path3" />
      <span className="path4" />
      <span className="path5" />
      <span className="path6" />
    </span>
    {localization.api.access.isOpenLicense}
  </span>
);
export const iconIsNotOpenLicense = () => (
  <span className="access-icon flex-fill fdk-color-danger">
    <span className="icon2-icon-api-license">
      <span className="path1" />
      <span className="path2" />
      <span className="path3" />
      <span className="path4" />
      <span className="path5" />
      <span className="path6" />
    </span>
    {localization.api.access.isNotOpenLicense}
  </span>
);
