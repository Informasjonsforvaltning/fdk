import _ from 'lodash';

import { getOwnProperties, getParentTypeRef } from './informationmodel';

const eiendomSchema = {
  allOf: [
    {
      $ref: '#/definitions/Spesifisering'
    },
    {
      type: 'object',
      properties: {
        bruksnummer: {
          $ref: '#/definitions/Tekst'
        },
        gaardsnummer: {
          $ref: '#/definitions/Tekst'
        },
        kommunenummer: {
          $ref: '#/definitions/Tekst'
        },
        festenummer: {
          $ref: '#/definitions/Tekst'
        },
        seksjonsnummer: {
          $ref: '#/definitions/Tekst'
        },
        tekniskNavn: {
          description:
            'Feltets lovlige verdier er bestemt av kodelisten 2017_summertSkattegrunnlagForEksterne',
          allOf: [
            {
              $ref: '#/definitions/Tekst'
            }
          ]
        }
      }
    }
  ]
};

const enhetSchema = {
  properties: {
    organisasjonsnummer: {
      type: 'string'
    },
    navn: {
      type: 'string'
    },
    organisasjonsform: {
      $ref: '#/definitions/Organisasjonsform'
    },
    postadresse: {
      $ref: '#/definitions/Adresse'
    },
    registreringsdatoEnhetsregisteret: {
      type: 'string'
    },
    registrertIMvaregisteret: {
      type: 'boolean'
    },
    naeringskode1: {
      $ref: '#/definitions/Naeringskode'
    },
    naeringskode2: {
      $ref: '#/definitions/Naeringskode'
    },
    naeringskode3: {
      $ref: '#/definitions/Naeringskode'
    },
    antallAnsatte: {
      type: 'integer'
    },
    forretningsadresse: {
      $ref: '#/definitions/Adresse'
    },
    stiftelsedato: {
      type: 'string'
    },
    institusjonellSektorkode: {
      $ref: '#/definitions/Sektorkode'
    },
    registrertIForetaksregisteret: {
      type: 'boolean'
    },
    registrertIStiftelsesregisteret: {
      type: 'boolean'
    },
    registrertIFrivillighetsregisteret: {
      type: 'boolean'
    },
    sisteInnsendteAarsregnskap: {
      type: 'string'
    },
    konkurs: {
      type: 'boolean'
    },
    underAvvikling: {
      type: 'boolean'
    },
    underTvangsavviklingEllerTvangsopplosning: {
      type: 'boolean'
    },
    maalform: {
      type: 'string'
    },
    _links: {
      $ref: '#/definitions/Self'
    }
  }
};

const adresseSchema = {
  properties: {
    land: {
      type: 'string'
    },
    landkode: {
      type: 'string'
    },
    postnummer: {
      type: 'string'
    },
    poststed: {
      type: 'string'
    },
    adresse: {
      type: 'array',
      items: {
        type: 'string'
      }
    },
    kommune: {
      type: 'string'
    },
    kommunenummer: {
      type: 'string'
    }
  }
};

const organisasjonsformerSchema = {
  properties: {
    organisasjonsformer: {
      type: 'array',
      items: {
        $ref: '#/definitions/Organisasjonsform'
      }
    }
  }
};

const summertSkattegrunnlagsobjektSchema = {
  description:
    'Myndighetsfastsatte opplysninger om den skattepliktige, den skattepliktiges økonomi (inntekt/fradrag/formue/gjeld), innførsel, omsetning og uttak og den skattepliktiges produksjon og varehåndtering, klassifisert, verdisatt og korrekt periodisert. Den skattepliktige skal kunne observere skattegrunnlaget i sine omgivelser.',
  required: ['tekniskNavn', 'beloep'],
  type: 'object',
  properties: {
    tekniskNavn: {
      description:
        'Feltets lovlige verdier er bestemt av kodelisten 2017_summertSkattegrunnlagForEksterne',
      allOf: [
        {
          $ref: '#/definitions/Tekst'
        }
      ]
    },
    beloep: {
      $ref: '#/definitions/Beloep'
    },
    spesifisering: {
      type: 'array',
      items: {
        oneOf: [
          {
            $ref: '#/definitions/Eiendom'
          },
          {
            $ref: '#/definitions/Kjoeretoey'
          },
          {
            $ref: '#/definitions/Generisk'
          }
        ]
      },
      minItems: 0
    },
    kategori: {
      type: 'array',
      items: {
        $ref: '#/definitions/Tekst'
      },
      minItems: 0
    }
  }
};

test('should extract parent type ref from allOf', () => {
  const parentTypeRef = getParentTypeRef(eiendomSchema);
  expect(parentTypeRef).toEqual('#/definitions/Spesifisering');
});

test('should extract own properties when type is a subtype', () => {
  const ownProperties = getOwnProperties(eiendomSchema);

  const ownPropertyNames = _.keys(ownProperties);
  expect(ownPropertyNames).toEqual([
    'bruksnummer',
    'gaardsnummer',
    'kommunenummer',
    'festenummer',
    'seksjonsnummer',
    'tekniskNavn'
  ]);
});

test('should extract own properties when type is not a subtype', () => {
  const ownProperties = getOwnProperties(enhetSchema);

  const ownPropertyNames = _.keys(ownProperties);
  expect(ownPropertyNames).toEqual([
    'organisasjonsnummer',
    'navn',
    'organisasjonsform',
    'postadresse',
    'registreringsdatoEnhetsregisteret',
    'registrertIMvaregisteret',
    'naeringskode1',
    'naeringskode2',
    'naeringskode3',
    'antallAnsatte',
    'forretningsadresse',
    'stiftelsedato',
    'institusjonellSektorkode',
    'registrertIForetaksregisteret',
    'registrertIStiftelsesregisteret',
    'registrertIFrivillighetsregisteret',
    'sisteInnsendteAarsregnskap',
    'konkurs',
    'underAvvikling',
    'underTvangsavviklingEllerTvangsopplosning',
    'maalform',
    '_links'
  ]);
});

test('should extract ref-typed property information', () => {
  const ownProperties = getOwnProperties(eiendomSchema);
  expect(ownProperties.bruksnummer.typeRef).toEqual('#/definitions/Tekst');
});

test('should extract parent-ref-typed property information', () => {
  const ownProperties = getOwnProperties(eiendomSchema);
  expect(ownProperties.tekniskNavn.description).toEqual(
    'Feltets lovlige verdier er bestemt av kodelisten 2017_summertSkattegrunnlagForEksterne'
  );
  expect(ownProperties.tekniskNavn.typeRef).toEqual('#/definitions/Tekst');
});

test('should extract array type property attributes', () => {
  const ownProperties = getOwnProperties(adresseSchema);
  expect(ownProperties.adresse.isArray).toEqual(true);
  expect(ownProperties.adresse.type).toEqual('string');
});

test('should extract array type property attributes, if using typeref', () => {
  const ownProperties = getOwnProperties(organisasjonsformerSchema);
  expect(ownProperties.organisasjonsformer.isArray).toEqual(true);
  expect(ownProperties.organisasjonsformer.typeRef).toEqual(
    '#/definitions/Organisasjonsform'
  );
});

test('should extract property type alternatives from oneOf', () => {
  const ownProperties = getOwnProperties(summertSkattegrunnlagsobjektSchema);
  expect(ownProperties.spesifisering.oneOfTypeRefs).toEqual([
    '#/definitions/Eiendom',
    '#/definitions/Kjoeretoey',
    '#/definitions/Generisk'
  ]);
});

// do we have a case of nested properties, aside of array?
