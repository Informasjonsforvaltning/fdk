import moment from 'moment';

import localization from '../../utils/localization';
import getTranslateText from '../../utils/translateText';

export const titleValues = values => {
  if (values) {
    let retVal = '';
    const { title, description, objective, landingPage } = values;
    if (title) {
      retVal = `${retVal} ${
        getTranslateText(title) ? `${getTranslateText(title)}.` : ''
      }`;
    }
    if (description) {
      retVal = `${retVal} ${
        getTranslateText(description) ? `${getTranslateText(description)}.` : ''
      }`;
    }
    if (objective) {
      retVal = `${retVal} ${
        getTranslateText(objective) ? `${getTranslateText(objective)}.` : ''
      }`;
    }
    if (landingPage && landingPage[0]) {
      retVal = `${retVal} ${landingPage[0]}`;
    }
    if (retVal.trim().length > 0) {
      return retVal;
    }
  }
  return null;
};

export const accessRightsValues = values => {
  if (values) {
    let retVal = '';
    const {
      accessRights,
      legalBasisForRestriction,
      legalBasisForProcessing,
      legalBasisForAccess
    } = values;
    if (
      accessRights.uri ===
      'http://publications.europa.eu/resource/authority/access-right/RESTRICTED'
    ) {
      retVal += 'Begrenset tilgang. ';
    } else if (
      accessRights.uri ===
      'http://publications.europa.eu/resource/authority/access-right/PUBLIC'
    ) {
      retVal += 'Offentlig. ';
    } else if (
      accessRights.uri ===
      'http://publications.europa.eu/resource/authority/access-right/NON-PUBLIC'
    ) {
      retVal += 'Unntatt offentlighet. ';
    }

    if (legalBasisForRestriction) {
      legalBasisForRestriction
        .filter(item => item && item.uri && item.uri !== '')
        .forEach(item => {
          if (item.prefLabel && item.prefLabel.nb) {
            retVal += `${getTranslateText(item.prefLabel)} - `;
          }
          retVal += `${item.uri} `;
        });
    }

    if (legalBasisForProcessing) {
      legalBasisForProcessing
        .filter(item => item && item.uri && item.uri !== '')
        .forEach(item => {
          if (item.prefLabel && item.prefLabel.nb) {
            retVal += `${getTranslateText(item.prefLabel)} - `;
          }
          retVal += `${item.uri} `;
        });
    }

    if (legalBasisForAccess) {
      legalBasisForAccess
        .filter(item => item && item.uri && item.uri !== '')
        .forEach(item => {
          if (item.prefLabel && item.prefLabel.nb) {
            retVal += `${getTranslateText(item.prefLabel)} - `;
          }
          retVal += `${item.uri} `;
        });
    }
    if (retVal.trim().length > 0) {
      return retVal;
    }
  }
  return null;
};

export const themesValues = values => {
  if (values) {
    const { theme } = values;
    let retVal = '';
    theme.forEach(item => {
      if (item.title && item.title.nb !== '') {
        retVal += `${getTranslateText(item.title)}. `;
      }
    });
    if (retVal.trim().length > 0) {
      return retVal;
    }
  }
  return null;
};

export const typeValues = values => {
  if (values) {
    let retVal = '';
    const { type } = values;
    if (type !== '') {
      retVal = type;
    }
    if (retVal.trim().length > 0) {
      return retVal;
    }
  }
  return null;
};

export const conceptValues = values => {
  if (values) {
    let retVal = '';
    const { subject, keyword } = values;
    if (subject) {
      subject.forEach(item => {
        if (item.prefLabel && item.prefLabel.no !== '') {
          retVal += `${getTranslateText(item.prefLabel)}. `;
        }
      });
    }
    if (keyword) {
      keyword.forEach(item => {
        if (item && item[localization.getLanguage()] !== '') {
          retVal += `${getTranslateText(item)}. `;
        }
      });
    }
    if (retVal.trim().length > 0) {
      return retVal;
    }
  }
  return null;
};

export const spatialValues = values => {
  if (values) {
    let retVal = '';
    const { spatial, temporal, issued, language } = values;
    if (spatial) {
      spatial.forEach(item => {
        if (item.uri && item.uri !== '') {
          retVal += `${item.uri}. `;
        }
      });
    }
    if (temporal) {
      temporal
        .filter(item => item && JSON.stringify(item) !== '{}')
        .forEach(item => {
          if (item.startDate) {
            retVal += `${moment(item.startDate).format('DD.MM.YYYY')} `;
          }
          if (item.startDate && item.endDate) {
            retVal += '- ';
          }
          if (item.endDate) {
            retVal += `${moment(item.endDate).format('DD.MM.YYYY')} `;
          }
        });
    }
    if (issued && issued !== '') {
      retVal += `${moment(issued).format('DD.MM.YYYY')}. `;
    }
    if (language) {
      language.forEach(item => {
        retVal += `${localization.lang[item.code]}. `;
      });
    }
    if (retVal.trim().length > 0) {
      return retVal;
    }
  }
  return null;
};

export const provenanceValues = values => {
  if (values) {
    let retVal = '';
    const {
      provenance,
      modified,
      hasCurrentnessAnnotation,
      accrualPeriodicity
    } = values;
    if (provenance) {
      if (
        provenance.prefLabel &&
        provenance.prefLabel[localization.getLanguage()] &&
        provenance.prefLabel[localization.getLanguage()] !== ''
      ) {
        retVal += `${getTranslateText(provenance.prefLabel)}. `;
      }
    }
    if (accrualPeriodicity && accrualPeriodicity.code) {
      retVal += `${
        localization.schema.provenance.accrualPeriodicity[
          accrualPeriodicity.code
        ]
      }. `;
    }
    if (modified) {
      retVal += `${moment(modified).format('DD.MM.YYYY')}. `;
    }
    if (hasCurrentnessAnnotation) {
      if (
        hasCurrentnessAnnotation.hasBody &&
        hasCurrentnessAnnotation.hasBody.nb !== ''
      ) {
        retVal += `${getTranslateText(hasCurrentnessAnnotation.hasBody)}. `;
      }
    }
    if (retVal.trim().length > 0) {
      return retVal;
    }
  }
  return null;
};

export const contentsValues = values => {
  if (values) {
    let retVal = '';
    const {
      conformsTo,
      hasRelevanceAnnotation,
      hasCompletenessAnnotation,
      hasAccuracyAnnotation,
      hasAvailabilityAnnotation
    } = values;
    if (conformsTo) {
      retVal += conformsTo.map(item => {
        if (item.prefLabel) {
          return `${
            getTranslateText(item.prefLabel)
              ? `${getTranslateText(item.prefLabel)}.`
              : ''
          }`;
        }
        return '';
      });
    }

    if (
      hasRelevanceAnnotation &&
      hasRelevanceAnnotation.hasBody &&
      hasRelevanceAnnotation.hasBody.nb !== ''
    ) {
      retVal += `${getTranslateText(hasRelevanceAnnotation.hasBody)}. `;
    }

    if (
      hasCompletenessAnnotation &&
      hasCompletenessAnnotation.hasBody &&
      hasCompletenessAnnotation.hasBody.nb !== ''
    ) {
      retVal += `${getTranslateText(hasCompletenessAnnotation.hasBody)}. `;
    }

    if (
      hasAccuracyAnnotation &&
      hasAccuracyAnnotation.hasBody &&
      hasAccuracyAnnotation.hasBody.nb !== ''
    ) {
      retVal += `${getTranslateText(hasAccuracyAnnotation.hasBody)}. `;
    }

    if (
      hasAvailabilityAnnotation &&
      hasAvailabilityAnnotation.hasBody &&
      hasAvailabilityAnnotation.hasBody.nb !== ''
    ) {
      retVal += `${getTranslateText(hasAvailabilityAnnotation.hasBody)}. `;
    }

    if (retVal.trim().length > 0) {
      return retVal;
    }
  }
  return null;
};

export const informationModelValues = values => {
  if (values) {
    let retVal = '';
    const { informationModel } = values;
    if (informationModel) {
      informationModel.forEach(item => {
        if (
          item.prefLabel &&
          item.prefLabel[localization.getLanguage()] !== ''
        ) {
          retVal += `${getTranslateText(item.prefLabel)}`;
        }
        if (item.uri) {
          retVal += ` - ${item.uri}.`;
        }
      });
    }
    if (retVal.trim().length > 0) {
      return retVal;
    }
  }
  return null;
};

export const referenceValues = values => {
  if (values) {
    let countReferences = 0;
    const { references } = values;
    if (references) {
      countReferences = references.filter(
        item => item.source && item.source.uri !== null
      ).length;
    }
    if (countReferences > 0) {
      return `${countReferences} relasjoner`;
    }
    return null;
  }
  return null;
};

export const contactPointValues = values => {
  if (values) {
    let retVal = '';
    const { contactPoint } = values;
    if (contactPoint) {
      contactPoint.forEach(item => {
        if (item.organizationUnit && item.organizationUnit !== '') {
          retVal += `${item.organizationUnit}. `;
        }
        if (item.hasURL && item.hasURL !== '') {
          retVal += `${item.hasURL}. `;
        }
        if (item.email && item.email !== '') {
          retVal += `${item.email}. `;
        }
        if (item.hasTelephone && item.hasTelephone !== '') {
          retVal += `${item.hasTelephone}. `;
        }
      });
    }
    if (retVal.trim().length > 0) {
      return retVal;
    }
  }
  return null;
};

export const distributionValues = values => {
  if (values) {
    let countDistributions = 0;
    const { distribution } = values;
    if (distribution) {
      countDistributions = distribution.filter(
        item => item.accessURL && item.accessURL[0] !== ''
      ).length;
    }
    if (countDistributions > 0) {
      return `${countDistributions} distribusjoner`;
    }
  }
  return null;
};

export const sampleValues = values => {
  if (values) {
    let countSamples = 0;
    const { sample } = values;
    if (sample) {
      countSamples = sample.filter(
        item => item.accessURL && item.accessURL[0] !== ''
      ).length;
    }
    if (countSamples > 0) {
      return `${countSamples} eksempeldata`;
    }
  }
  return null;
};
