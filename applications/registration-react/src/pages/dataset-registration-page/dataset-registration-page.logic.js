import _ from 'lodash';
import moment from 'moment';

import localization from '../../lib/localization';
import { getTranslateText } from '../../lib/translateText';

export const titleValues = values => {
  if (values) {
    let retVal = '';
    const { title, description, objective, landingPage } = values;

    retVal += getTranslateText(title) ? `${getTranslateText(title)}. ` : '';
    retVal += getTranslateText(description)
      ? `${getTranslateText(description)}. `
      : '';
    retVal += getTranslateText(objective)
      ? `${getTranslateText(objective)}. `
      : '';
    retVal += _.get(landingPage, '[0]', '');

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
      retVal += `${localization.datasets.formValues.accessRights.restricted}. `;
    } else if (
      accessRights.uri ===
      'http://publications.europa.eu/resource/authority/access-right/PUBLIC'
    ) {
      retVal += `${localization.datasets.formValues.accessRights.publicString}. `;
    } else if (
      accessRights.uri ===
      'http://publications.europa.eu/resource/authority/access-right/NON_PUBLIC'
    ) {
      retVal += `${localization.datasets.formValues.accessRights.nonPublic}. `;
    }

    if (legalBasisForRestriction) {
      legalBasisForRestriction
        .filter(item => item && item.uri && item.uri !== '')
        .forEach(item => {
          retVal += getTranslateText(item.prefLabel)
            ? `${getTranslateText(item.prefLabel)} - `
            : '';
          retVal += _.get(item, 'uri', null)
            ? `${_.get(item, 'uri', '')} `
            : '';
        });
    }

    if (legalBasisForProcessing) {
      legalBasisForProcessing
        .filter(item => item && item.uri && item.uri !== '')
        .forEach(item => {
          retVal += getTranslateText(item.prefLabel)
            ? `${getTranslateText(item.prefLabel)} - `
            : '';
          retVal += _.get(item, 'uri', null)
            ? `${_.get(item, 'uri', '')} `
            : '';
        });
    }

    if (legalBasisForAccess) {
      legalBasisForAccess
        .filter(item => item && item.uri && item.uri !== '')
        .forEach(item => {
          retVal += getTranslateText(item.prefLabel)
            ? `${getTranslateText(item.prefLabel)} - `
            : '';
          retVal += _.get(item, 'uri', null)
            ? `${_.get(item, 'uri', '')} `
            : '';
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
      retVal += getTranslateText(item.title)
        ? `${getTranslateText(item.title)}. `
        : '';
    });
    if (retVal.trim().length > 0) {
      return retVal;
    }
  }
  return null;
};

export const losValues = (values, losItems) => {
  if (!values) {
    return null;
  }
  const { theme } = values;
  let retVal = '';
  theme.forEach(item => {
    const losItem = _.find(losItems, { uri: item.uri });
    retVal += losItem ? `${getTranslateText(_.get(losItem, 'name'))}. ` : '';
  });
  return retVal;
};

export const typeValues = values => {
  if (values) {
    let retVal = '';
    const { type } = values;
    if (type) {
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
    const { concepts, keyword } = values;
    if (concepts) {
      concepts.forEach(item => {
        retVal += getTranslateText(item.prefLabel)
          ? `${getTranslateText(item.prefLabel)}. `
          : '';
      });
    }
    if (keyword) {
      keyword.forEach(item => {
        retVal += getTranslateText(item) ? `${getTranslateText(item)}. ` : '';
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
        retVal += _.get(item, 'uri', null) ? `${_.get(item, 'uri', '')}. ` : '';
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

    retVal +=
      provenance && getTranslateText(provenance.prefLabel)
        ? `${getTranslateText(provenance.prefLabel)}. `
        : '';

    retVal += _.get(accrualPeriodicity, 'code', null)
      ? `${
          localization.schema.provenance.accrualPeriodicity[
            accrualPeriodicity.code
          ]
        }. `
      : '';

    if (modified) {
      retVal += `${moment(modified).format('DD.MM.YYYY')}. `;
    }

    retVal += getTranslateText(hasCurrentnessAnnotation.hasBody)
      ? `${getTranslateText(hasCurrentnessAnnotation.hasBody)}. `
      : '';

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
      retVal += conformsTo.map(item =>
        getTranslateText(item.prefLabel)
          ? `${getTranslateText(item.prefLabel)}. `
          : ''
      );
    }

    retVal +=
      hasRelevanceAnnotation && getTranslateText(hasRelevanceAnnotation.hasBody)
        ? `${getTranslateText(hasRelevanceAnnotation.hasBody)}. `
        : '';
    retVal +=
      hasCompletenessAnnotation &&
      getTranslateText(hasCompletenessAnnotation.hasBody)
        ? `${getTranslateText(hasCompletenessAnnotation.hasBody)}. `
        : '';
    retVal +=
      hasAccuracyAnnotation && getTranslateText(hasAccuracyAnnotation.hasBody)
        ? `${getTranslateText(hasAccuracyAnnotation.hasBody)}. `
        : '';
    retVal +=
      hasAvailabilityAnnotation &&
      getTranslateText(hasAvailabilityAnnotation.hasBody)
        ? `${getTranslateText(hasAvailabilityAnnotation.hasBody)}. `
        : '';

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
        retVal += getTranslateText(item.prefLabel)
          ? `${getTranslateText(item.prefLabel)}`
          : '';
        retVal += _.get(item, 'uri', '') ? ` - ${_.get(item, 'uri', '')} ` : '';
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
      return `${countReferences} ${localization.datasets.formValues.references}`;
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
        retVal += _.get(item, 'organizationUnit', null)
          ? `${_.get(item, 'organizationUnit', null)}. `
          : '';
        retVal += _.get(item, 'hasURL', null)
          ? `${_.get(item, 'hasURL', null)}. `
          : '';
        retVal += _.get(item, 'email', null)
          ? `${_.get(item, 'email', null)}. `
          : '';
        retVal += _.get(item, 'hasTelephone', null)
          ? `${_.get(item, 'hasTelephone', null)}. `
          : '';
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
        item =>
          item.accessURL && item.accessURL[0] !== '' && !item.accessService
      ).length;
    }
    if (countDistributions > 0) {
      return `${countDistributions} ${localization.datasets.formValues.distributions}`;
    }
  }
  return null;
};

export const distributionAPIValues = values => {
  if (values) {
    let countDistributions = 0;
    const { distribution } = values;
    if (distribution) {
      countDistributions = distribution.filter(item => item.accessService)
        .length;
    }
    if (countDistributions > 0) {
      return `${countDistributions} ${localization.datasets.formValues.distributions}`;
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
      return `${countSamples} ${localization.datasets.formValues.sample}`;
    }
  }
  return null;
};
