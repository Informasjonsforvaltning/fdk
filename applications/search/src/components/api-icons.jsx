import React from 'react';

export const iconIsFree = () => (
  <span className="access-icon fdk-color-green-1">
    <span className="icon2-icon-api-cost-none">
      <span className="path1" />
      <span className="path2" />
      <span className="path3" />
      <span className="path4" />
      <span className="path5" />
    </span>Gratis
  </span>
);

export const iconIsNotFree = () => (
  <span className="access-icon fdk-color-red-1">
    <span className="icon2-icon-api-cost">
      <span className="path1" />
      <span className="path2" />
    </span>
    Ikke gratis å bruke
  </span>
);

export const iconIsOpenAccess = () => (
  <span className="access-icon fdk-color-green-1">
    <span className="icon2-icon-api-access-all">
      <span className="path1" />
      <span className="path2" />
      <span className="path3" />
      <span className="path4" />
    </span>
    Åpent for alle
  </span>
);

export const iconIsNotOpenAccess = () => (
  <span className="access-icon fdk-color-red-1">
    <span className="icon2-icon-api-access-not-limited">
      <span className="path1" />
      <span className="path2" />
    </span>
    Ikke åpen tilgang
  </span>
);

export const iconIsOpenLicense = () => (
  <span className="access-icon fdk-color-green-1">
    <span className="icon2-icon-api-license-open">
      <span className="path1" />
      <span className="path2" />
      <span className="path3" />
      <span className="path4" />
      <span className="path5" />
      <span className="path6" />
    </span>
    Åpen lisens
  </span>
);
export const iconIsNotOpenLicense = () => (
  <span className="access-icon fdk-color-red-1">
    <span className="icon2-icon-api-license">
      <span className="path1" />
      <span className="path2" />
      <span className="path3" />
      <span className="path4" />
      <span className="path5" />
      <span className="path6" />
    </span>
    Ikke åpen lisens
  </span>
);
