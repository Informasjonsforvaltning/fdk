const REGISTRATION_STATUS_PUBLISH = 'PUBLISH';
const REGISTRATION_STATUS_APPROVE = 'APPROVE';
const REGISTRATION_STATUS_DRAFT = 'DRAFT';

export const isPublished = registrationStatus =>
  !!(registrationStatus === REGISTRATION_STATUS_PUBLISH);

export const isApproved = registrationStatus =>
  !!(registrationStatus === REGISTRATION_STATUS_APPROVE);

export const isDraft = registrationStatus =>
  !!(registrationStatus === REGISTRATION_STATUS_DRAFT);
