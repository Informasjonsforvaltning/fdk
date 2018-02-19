import localization from '../../utils/localization';
import { getTranslateText } from '../../utils/translateText';

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
    } return null;
  }
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
      legalBasisForRestriction.map(item => {
        if (item.uri !== '') {
          hasLegalBasisForRestriction = true;
        }
      })
    }

    let hasLegalBasisForProcessing = false;
    if (legalBasisForProcessing) {
      legalBasisForProcessing.map(item => {
        if (item.uri !== '') {
          hasLegalBasisForProcessing = true;
        }
      })
    }

    let hasLegalBasisForAccess = false;
    if (legalBasisForAccess) {
      legalBasisForAccess.map(item => {
        if (item.uri !== '') {
          hasLegalBasisForAccess = true;
        }
      })
    }

    const retVal = `${accessRightsPrefLabel} ${hasLegalBasisForRestriction ? `${localization.schema.accessRights.legalBasisForRestriction.heading}.` : ''} ${hasLegalBasisForProcessing ? `${localization.schema.accessRights.legalBasisForProcessing.heading}.` : ''} ${hasLegalBasisForAccess ? `${localization.schema.accessRights.legalBasisForAccess.heading}.` : ''}`
    if (retVal.trim().length > 0) {
      return retVal;
    } return null;
  }
}

export const themesValues = values => {
  if (values) {
    const { theme } = values;
    let retVal = '';
    theme.map(item => {
      if (item.title && item.title.nb !== '') {
        retVal = `${retVal} ${getTranslateText(item.title)}.`
      }
    });
    if (retVal.trim().length > 0) {
      return retVal;
    } return null;
  }
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
    } return null;
  }
}

export const conceptValues = values => {
  if (values) {
    let retVal = '';
    const {subject, keyword} = values;
    if (subject) {
      subject.map(item => {
        if (item.prefLabel && item.prefLabel.no !== '') {
          retVal = `${retVal} ${getTranslateText(item.prefLabel)}.`
        }
      });
    }
    if (keyword) {
      keyword.map(item => {
        if (item && item[localization.getLanguage()] !== '') {
          retVal = `${retVal} ${getTranslateText(item)}.`
        }
      });
      if (retVal.trim().length > 0) {
        return retVal;
      }
      return null;
    }
  }
}

export const spatialValues = values => {
  if (values) {
    let retVal = '';
    const { spatial, temporal, issued, language } = values;
    if (spatial) {
      spatial.map(item => {
        if (item.uri && item.uri !== '') {
          retVal = `${retVal} ${item.uri}.`
        }
      });
    }
    if (temporal) {
      let showTemporal = false;
      spatial.map(item => {
        if (item && JSON.stringify(item) !== '{}') {
          showTemporal = true;
        }
      });
      if (showTemporal) {
        retVal = `${retVal} Tidsmessig avgrenset.`
      }
    }
    if (issued && issued !== '') {
      retVal = `${retVal} ${issued}.`
    }
    if (language) {
      language.map(item => {
        retVal = `${retVal} ${item.code}.`
      });
    }
    if (retVal.trim().length > 0) {
      return retVal;
    } return null;
  }
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
      let showCurrentnessAnnotation = false;
      if (hasCurrentnessAnnotation.hasBody && hasCurrentnessAnnotation.hasBody.no !== '') {
        retVal = `${retVal} Aktualitet.`
      }
    }
    if (retVal.trim().length > 0) {
      return retVal;
    } return null;
  }
}

export const contentsValues = values => {
  if (values) {
    let retVal = '';
    const { conformsTo, hasRelevanceAnnotation, hasCompletenessAnnotation, hasAccuracyAnnotation, hasAvailabilityAnnotation } = values;
    if (conformsTo) {
      conformsTo.map(item => {
        if (item.prefLabel) {
          retVal = `${retVal} ${getTranslateText(item.prefLabel) ? `${getTranslateText(item.prefLabel)}.` : ''}`
        }
      })
    }
    if (hasRelevanceAnnotation && hasRelevanceAnnotation.hasBody && hasRelevanceAnnotation.hasBody.nb !== '') {
      retVal = `${retVal} Relevans.`
    }

    if (hasCompletenessAnnotation && hasCompletenessAnnotation.hasBody && hasCompletenessAnnotation.hasBody.nb !== '') {
      retVal = `${retVal} Kompletthet.`
    }

    if (hasCompletenessAnnotation && hasCompletenessAnnotation.hasBody && hasCompletenessAnnotation.hasBody.nb !== '') {
      retVal = `${retVal} Nøyaktighet.`
    }

    if (hasAvailabilityAnnotation && hasAvailabilityAnnotation.hasBody && hasAvailabilityAnnotation.hasBody.nb !== '') {
      retVal = `${retVal} Tilgjengelighet.`
    }

    if (retVal.trim().length > 0) {
      return retVal;
    } return null;
  }
}

export const informationModelValues = values => {
  if (values) {
    let retVal = '';
    const { informationModel } = values;
    if (informationModel) {
      informationModel.map(item => {
        if (item.prefLabel && item.prefLabel[localization.getLanguage()] !== '') {
          retVal = `${retVal} ${getTranslateText(item.prefLabel)}.`
        }
      })
    }
    if (retVal.trim().length > 0) {
      return retVal;
    } return null;
  }
}

export const referenceValues = values => {
  if (values) {
    let countReferences = 0;
    const { references } = values;
    if (references) {
      references.map(item => {
        if (item.source && item.source.uri !== null) {
          countReferences = countReferences + 1;
        }
      })
    }
    if (countReferences > 0) {
      return `${countReferences} relasjoner`;
    } return null;
  }
}

export const contactPointValues = values => {
  if (values) {
    let retVal = '';
    const { contactPoint } = values;
    if (contactPoint) {
      contactPoint.map(item => {
        if (item.organizationUnit && item.organizationUnit !== '') {
          retVal = `${retVal} Kontaktpunkt.`
        }
        if (item.hasURL && item.hasURL !== '') {
          retVal = `${retVal} Kontaktskjema.`
        }
        if (item.email && item.email !== '') {
          retVal = `${retVal} E-post.`
        }
        if (item.hasTelephone && item.hasTelephone !== '') {
          retVal = `${retVal} Telefon.`
        }
      })
    }
    if (retVal.trim().length > 0) {
      return retVal;
    } return null;
  }
}

export const distributionValues = values => {
  if (values) {
    let countDistributions = 0;
    const { distribution } = values;
    if (distribution) {
      distribution.map(item => {
        if (item.accessURL && item.accessURL[0] !== '') {
          countDistributions = countDistributions + 1;
        }
      })
    }
    if (countDistributions > 0) {
      return `${countDistributions} distribusjoner`;
    } return null;
  }
}

export const sampleValues = values => {
  if (values) {
    let countSamples = 0;
    const { sample } = values;
    if (sample) {
      sample.map(item => {
        if (item.accessURL && item.accessURL[0] !== '') {
          countSamples = countSamples + 1;
        }
      })
    }
    if (countSamples > 0) {
      return `${countSamples} eksempeldata`;
    } return null;
  }
}
