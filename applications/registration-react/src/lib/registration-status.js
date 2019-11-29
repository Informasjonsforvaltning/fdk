const REGISTRATION_STATUS_PUBLISH = 'PUBLISH';

export const isPublished = registrationStatus =>
  !!(registrationStatus === REGISTRATION_STATUS_PUBLISH);
