import _ from 'lodash';

import informationModel from '../mock/informationmodelApiResponse.json';
import { getOwnProperties, getParentTypeRef } from './informationmodel';

const modelSchema = informationModel.schema;

test('should extract parent type ref from allOf', () => {
  const typeSchema = modelSchema.definitions.Eiendom;
  const parentTypeRef = getParentTypeRef(typeSchema);
  expect(parentTypeRef).toEqual('#/definitions/Spesifisering');
});

test('should extract own properties when type is a subtype', () => {
  const typeSchema = modelSchema.definitions.Eiendom;
  const ownProperties = getOwnProperties(typeSchema);

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
  const typeSchema = modelSchema.definitions.Enhet;
  const ownProperties = getOwnProperties(typeSchema);

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
  const typeSchema = modelSchema.definitions.Eiendom;
  const ownProperties = getOwnProperties(typeSchema);
  expect(ownProperties.bruksnummer.typeRef).toEqual('#/definitions/Tekst');
});

test('should extract parent-ref-typed property information', () => {
  const typeSchema = modelSchema.definitions.Eiendom;
  const ownProperties = getOwnProperties(typeSchema);
  expect(ownProperties.tekniskNavn.description).toEqual(
    'Feltets lovlige verdier er bestemt av kodelisten 2017_summertSkattegrunnlagForEksterne'
  );
  expect(ownProperties.tekniskNavn.typeRef).toEqual('#/definitions/Tekst');
});

test('should extract array type property attributes', () => {
  const typeSchema = modelSchema.definitions.Adresse;
  const ownProperties = getOwnProperties(typeSchema);
  expect(ownProperties.adresse.isArray).toEqual(true);
  expect(ownProperties.adresse.type).toEqual('string');
});

test('should extract array type property attributes, if using typeref', () => {
  const typeSchema = modelSchema.definitions.Organisasjonsformer;
  const ownProperties = getOwnProperties(typeSchema);
  expect(ownProperties.organisasjonsformer.isArray).toEqual(true);
  expect(ownProperties.organisasjonsformer.typeRef).toEqual(
    '#/definitions/Organisasjonsform'
  );
});

test('should extract property type alternatives from oneOf', () => {
  const typeSchema = modelSchema.definitions.SummertSkattegrunnlagsobjekt;
  const ownProperties = getOwnProperties(typeSchema);
  expect(ownProperties.spesifisering.oneOfTypeRefs).toEqual([
    '#/definitions/Eiendom',
    '#/definitions/Kjoeretoey',
    '#/definitions/Generisk'
  ]);
});

// do we have a case of nested properties, aside of array?
