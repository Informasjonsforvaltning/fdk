import _ from 'lodash';
/*
  In JsonSchema, class inheritance is expressed as allOf clause,
  which literally means that object under validation must both satisfy parent class schema
  and customization schema

  We assume that if a component has "allOf", that contains one referenced schema and
  one normal schema, then referenced schema is parent class, and the normal schema declaration
  is declaration of own properties
*/

const schemaPrefix = '#/definitions/';
const schemaPrefixRegEx = new RegExp(`^${schemaPrefix}`);

export function getTypeFromTypeRef(localRef) {
  return localRef && localRef.replace(schemaPrefixRegEx, '');
}

export function getTypeSchema(type, schema) {
  const typeSchema = _.get(schema, ['definitions', type]);

  if (!typeSchema) {
    throw new Error(`Component ${type} not found in schema`);
  }
  return typeSchema;
}

export function getTypeSchemaByLocalRef(localRef, schema) {
  const type = getTypeFromTypeRef(localRef);
  return getTypeSchema(type, schema);
}

export function getParentTypeRef(schema) {
  // as convention, if object requires multiple schemas and some of them are declared
  // as reference, then these are considered parents

  const allOf = schema.allOf;

  if (!Array.isArray(allOf)) {
    return undefined;
  }

  const parentTypeRefs = _(allOf)
    .filter('$ref')
    .map('$ref')
    .value();

  if (parentTypeRefs.length > 1) {
    throw new Error(`More than one parent type references`);
  }

  return parentTypeRefs[0];
}

/*
For our rendering purpose, we simplify properties structure

properties:{
 [string]:{
  type:  - native type, e.g "string". This is not used for array, as array declaration will use items type.
  typeRef:typeRef
  oneOfTypeRefs:typeRef[],
  description: string
  isArray: boolean
???  schema - used if ad-hoc definition (i.e. not ref). not sure how to render or if it exists in wild, but nesting is allowed in JsonSchema
  }
*/

function convertPropertyFromJsonSchema(schema) {
  if (schema.type === 'array') {
    // array property attributes are actually property attributes.
    return { ...convertPropertyFromJsonSchema(schema.items), isArray: true };
  }

  const property = {};

  if (schema.type) {
    property.type = schema.type;
  }

  if (schema.description) {
    property.description = schema.description;
  }

  // typeRef can be just declared as schema reference, or in case when description is added,
  // then it is moved under allOf
  const typeRef = schema.$ref || getParentTypeRef(schema);
  if (typeRef) {
    property.typeRef = typeRef;
  }

  if (Array.isArray(schema.oneOf)) {
    // we currently ignore if oneOf includes nested ad-hoc schemas, only extract lists of referenced types
    property.oneOfTypeRefs = _(schema.oneOf)
      .filter('$ref')
      .map('$ref')
      .value();
  }

  return property;
}

export function getOwnProperties(schema) {
  // const schema = getTypeSchema(type, definitions);

  const extractedSchemasProperties = [];

  // try own declaration first
  if (schema.properties) {
    extractedSchemasProperties.push(schema.properties);
  }

  // if inheritance is used, try to get own properties from "allOf"
  if (Array.isArray(schema.allOf)) {
    // if type has parent type, then parent type is declared as refernence under, and own properties are defined
    // if there is more than one non-ref schemas, then our assumptions are not fulfilled, give error
    schema.allOf.forEach(allOfSchema => {
      if (allOfSchema.properties) {
        extractedSchemasProperties.push(allOfSchema.properties);
      }
    });
  }

  if (extractedSchemasProperties.length > 1) {
    throw new Error(`More than one own properties definitions`);
  }

  if (extractedSchemasProperties.length === 0) {
    return {};
  }

  const ownSchemaProperties = extractedSchemasProperties[0];
  return _.mapValues(ownSchemaProperties, convertPropertyFromJsonSchema);
}
