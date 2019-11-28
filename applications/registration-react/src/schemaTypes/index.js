export const textType = {};

export const accessRights = {
  uri: '',
  prefLabel: {}
};

export const languageType = {
  uri: '',
  code: '',
  prefLabel: textType
};

export const emptyArray = [''];

export const legalBasisType = {
  uri: '',
  prefLabel: textType,
  extraType: null
};

export const licenseType = {
  uri: '',
  prefLabel: textType,
  extraType: null
};

export const informationModelType = {
  uri: '',
  prefLabel: textType,
  extraType: null
};

export const contactPointType = {
  email: '',
  hasTelephone: '',
  hasURL: '',
  organizationUnit: ''
};

export const conformsToType = {
  uri: '',
  prefLabel: textType,
  extraType: null
};

export const relevanceAnnotationType = {
  inDimension: 'iso:Relevance',
  motivatedBy: 'dqv:qualityAssessment',
  hasBody: textType
};

export const accuracyAnnotationType = {
  inDimension: 'iso:Accuracy',
  motivatedBy: 'dqv:qualityAssessment',
  hasBody: textType
};

export const completenessAnnotationType = {
  inDimension: 'iso:Completeness',
  motivatedBy: 'dqv:qualityAssessment',
  hasBody: textType
};

export const availabilityAnnotationType = {
  inDimension: 'iso:Availability',
  motivatedBy: 'dqv:qualityAssessment',
  hasBody: textType
};

export const currentnessAnnotationType = {
  inDimension: 'iso:Currentness',
  motivatedBy: 'dqv:qualityAssessment',
  hasBody: textType
};
