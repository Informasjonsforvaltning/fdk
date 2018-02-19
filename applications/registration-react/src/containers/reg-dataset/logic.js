import localization from '../../utils/localization';
import getTranslateText from '../../utils/translateText';

export const titleValues = values => {
  if (values) {
    let retVal = '';
    const { title, description, objective, landingPage } = values;
    if (title) {
      retVal = `${retVal} ${getTranslateText(title) ? `${getTranslateText(title)}.` : ''}`
    }
    if (description && description.nb !== '') {
      retVal = `${retVal} Beskrivelse.`
    }
    if (objective && objective.nb !== '') {
      retVal = `${retVal} Formål.`
    }
    if (landingPage && landingPage[0]) {
      retVal = `${retVal} Lenke til mer informasjon.`
    }
    if (retVal.trim().length > 0) {
      return retVal;
    }
  } return null;
}

export const accessRightsValues = values => {
  if (values) {
    const { accessRights, legalBasisForRestriction, legalBasisForProcessing, legalBasisForAccess } = values;
    let accessRightsPrefLabel = '';
    if (accessRights.uri === 'http://publications.europa.eu/resource/authority/access-right/RESTRICTED') {
      accessRightsPrefLabel = 'Begrenset tilgang.'
    } else if (accessRights.uri === 'http://publications.europa.eu/resource/authority/access-right/PUBLIC') {
      accessRightsPrefLabel = 'Offentlig.'
    } else if (accessRights.uri === 'http://publications.europa.eu/resource/authority/access-right/NON-PUBLIC') {
      accessRightsPrefLabel = 'Unntatt offentlighet.'
    }

    let hasLegalBasisForRestriction = false;
    if (legalBasisForRestriction) {
      hasLegalBasisForRestriction = (legalBasisForRestriction.filter(item => (item && item.uri && item.uri !== '')).length > 0);
    }

    let hasLegalBasisForProcessing = false;
    if (legalBasisForProcessing) {
      hasLegalBasisForProcessing = (legalBasisForProcessing.filter(item => (item && item.uri && item.uri !== '')).length > 0);
    }

    let hasLegalBasisForAccess = false;
    if (legalBasisForAccess) {
      hasLegalBasisForAccess = (legalBasisForAccess.filter(item => (item && item.uri && item.uri !== '')).length > 0);
    }

    const retVal = `${accessRightsPrefLabel} ${hasLegalBasisForRestriction ? `${localization.schema.accessRights.legalBasisForRestriction.heading}.` : ''} ${hasLegalBasisForProcessing ? `${localization.schema.accessRights.legalBasisForProcessing.heading}.` : ''} ${hasLegalBasisForAccess ? `${localization.schema.accessRights.legalBasisForAccess.heading}.` : ''}`
    if (retVal.trim().length > 0) {
      return retVal;
    }
  } return null;
}

export const themesValues = values => {
  if (values) {
    const { theme } = values;
    let retVal = '';
    retVal += theme.map(item => {
      if (item.title && item.title.nb !== '') {
        return `${getTranslateText(item.title)}.`
      }
      return '';
    });
    if (retVal.trim().length > 0) {
      return retVal;
    }
  } return null;
}

export const typeValues = values => {
  if (values) {
    let retVal = '';
    const { type } = values;
    if (type !== '') {
      retVal = type
    }
    if (retVal.trim().length > 0) {
      return retVal;
    }
  } return null;
}

export const conceptValues = values => {
  if (values) {
    let retVal = '';
    const {subject, keyword} = values;
    if (subject) {
      retVal += subject.map(item => {
        if (item.prefLabel && item.prefLabel.no !== '') {
          return `${getTranslateText(item.prefLabel)}.`
        }
        return '';
      });
    }
    if (keyword) {
      retVal += keyword.map(item => {
        if (item && item[localization.getLanguage()] !== '') {
          return `${getTranslateText(item)}.`
        }
        return '';
      });
      if (retVal.trim().length > 0) {
        return retVal;
      }
    }
  } return null;
}

export const spatialValues = values => {
  if (values) {
    let retVal = '';
    const { spatial, temporal, issued, language } = values;
    if (spatial) {
      retVal += spatial.map(item => {
        if (item.uri && item.uri !== '') {
          return `${item.uri}. `
        }
        return '';
      });
    }
    if (temporal) {
      let showTemporal = false;
      showTemporal = (temporal.filter(item => (item && JSON.stringify(item) !== '{}')).length > 0);
      if (showTemporal) {
        retVal = `${retVal} Tidsmessig avgrenset.`
      }
    }
    if (issued && issued !== '') {
      retVal = `${retVal} ${issued}.`
    }
    if (language) {
      retVal += language.map(item => `${item.code}. `);
    }
    if (retVal.trim().length > 0) {
      return retVal;
    }

  } return null;
}

export const provenanceValues = values => {
  if (values) {
    let retVal = '';
    const { provenance, modified, hasCurrentnessAnnotation, accrualPeriodicity } = values;
    if (provenance) {
      if (provenance.prefLabel) {
        retVal = `${retVal} ${getTranslateText(provenance.prefLabel)}.`
      }
    }
    if (accrualPeriodicity && accrualPeriodicity.code) {
      retVal = `${retVal} ${accrualPeriodicity.code}.`
    }
    if (modified) {
      retVal = `${retVal} ${modified}.`
    }
    if (hasCurrentnessAnnotation) {
      if (hasCurrentnessAnnotation.hasBody && hasCurrentnessAnnotation.hasBody.no !== '') {
        retVal = `${retVal} Aktualitet.`
      }
    }
    if (retVal.trim().length > 0) {
      return retVal;
    }
  } return null;
}

export const contentsValues = values => {
  if (values) {
    let retVal = '';
    const { conformsTo, hasRelevanceAnnotation, hasCompletenessAnnotation, hasAccuracyAnnotation, hasAvailabilityAnnotation } = values;
    if (conformsTo) {
      retVal += conformsTo.map(item => {
        if (item.prefLabel) {
          return `${getTranslateText(item.prefLabel) ? `${getTranslateText(item.prefLabel)}.` : ''}`
        }
        return '';
      })
    }
    if (hasRelevanceAnnotation && hasRelevanceAnnotation.hasBody && hasRelevanceAnnotation.hasBody.nb !== '') {
      retVal = `${retVal} Relevans.`
    }

    if (hasCompletenessAnnotation && hasCompletenessAnnotation.hasBody && hasCompletenessAnnotation.hasBody.nb !== '') {
      retVal = `${retVal} Kompletthet.`
    }

    if (hasAccuracyAnnotation && hasAccuracyAnnotation.hasBody && hasAccuracyAnnotation.hasBody.nb !== '') {
      retVal = `${retVal} Nøyaktighet.`
    }

    if (hasAvailabilityAnnotation && hasAvailabilityAnnotation.hasBody && hasAvailabilityAnnotation.hasBody.nb !== '') {
      retVal = `${retVal} Tilgjengelighet.`
    }

    if (retVal.trim().length > 0) {
      return retVal;
    }
  }
  return null;
}

export const informationModelValues = values => {
  if (values) {
    let retVal = '';
    const { informationModel } = values;
    if (informationModel) {
      retVal += informationModel.map(item => {
        if (item.prefLabel && item.prefLabel[localization.getLanguage()] !== '') {
          return `${getTranslateText(item.prefLabel)}.`
        }
        return '';
      })
    }
    if (retVal.trim().length > 0) {
      return retVal;
    }
  }
  return null;
}

export const referenceValues = values => {
  if (values) {
    let countReferences = 0;
    const { references } = values;
    if (references) {
      countReferences = references.filter(item => (item.source && item.source.uri !== null)).length;
    }
    if (countReferences > 0) {
      return `${countReferences} relasjoner`;
    } return null;
  }
  return null;
}

export const contactPointValues = values => {
  if (values) {
    let retVal = '';
    const { contactPoint } = values;
    if (contactPoint) {
      retVal += contactPoint.map(item => {
        let concatString = '';
        if (item.organizationUnit && item.organizationUnit !== '') {
          concatString = `${concatString} Kontaktpunkt.`
        }
        if (item.hasURL && item.hasURL !== '') {
          concatString = `${concatString} Kontaktskjema.`
        }
        if (item.email && item.email !== '') {
          concatString = `${concatString} E-post.`
        }
        if (item.hasTelephone && item.hasTelephone !== '') {
          concatString = `${concatString} Telefon.`
        }
        return concatString;
      })
    }
    if (retVal.trim().length > 0) {
      return retVal;
    }
  }
  return null;
}

export const distributionValues = values => {
  if (values) {
    let countDistributions = 0;
    const { distribution } = values;
    if (distribution) {
      countDistributions = distribution.filter(item => (item.accessURL && item.accessURL[0] !== '')).length;
    }
    if (countDistributions > 0) {
      return `${countDistributions} distribusjoner`;
    }
  }
  return null;
}

export const sampleValues = values => {
  if (values) {
    let countSamples = 0;
    const { sample } = values;
    if (sample) {
      countSamples = sample.filter(item => (item.accessURL && item.accessURL[0] !== '')).length;
    }
    if (countSamples > 0) {
      return `${countSamples} eksempeldata`;
    }
  }
  return null;
}
