import React from "react";
import validate from "../../../src/components/reg-form-schema-provenance/formValidations";
import {
  titleValues,
  accessRightsValues,
  themesValues,
  typeValues,
  conceptValues,
  spatialValues,
  provenanceValues,
  contentsValues,
  informationModelValues,
  referenceValues,
  contactPointValues,
  distributionValues,
  sampleValues
} from '../../../src/containers/reg-dataset/logic';
import datasets from '../../fixtures/datasets';

it('should run titleValues without errors', () => {
  const dataset = datasets.datasetItems._embedded.datasets[0];
  expect(titleValues(dataset)).not.toBeNull();
});

it('should run accessRightsValues() without errors', () => {
  const dataset = datasets.datasetItems._embedded.datasets[0];
  expect(accessRightsValues(dataset)).not.toBeNull();
});

it('should run themesValues() without errors', () => {
  const dataset = datasets.datasetItems._embedded.datasets[0];
  expect(themesValues(dataset)).not.toBeNull();
});

/*
it('should run typeValues() without errors', () => {
  const dataset = datasets.datasetItems._embedded.datasets[0];
  expect(typeValues(dataset)).not.toBeNull();
});
*/

it('should run conceptValues() without errors', () => {
  const dataset = datasets.datasetItems._embedded.datasets[0];
  expect(conceptValues(dataset)).not.toBeNull();
});

it('should run spatialValues() without errors', () => {
  const dataset = datasets.datasetItems._embedded.datasets[0];
  expect(spatialValues(dataset)).not.toBeNull();
});

it('should run provenanceValues() without errors', () => {
  const dataset = datasets.datasetItems._embedded.datasets[0];
  expect(provenanceValues(dataset)).not.toBeNull();
});

it('should run contentsValues() without errors', () => {
  const dataset = datasets.datasetItems._embedded.datasets[0];
  expect(contentsValues(dataset)).not.toBeNull();
});

it('should run informationModelValues() without errors', () => {
  const dataset = datasets.datasetItems._embedded.datasets[0];
  expect(informationModelValues(dataset)).not.toBeNull();
});

/*
it('should run referenceValues() without errors', () => {
  const dataset = datasets.datasetItems._embedded.datasets[0];
  expect(referenceValues(dataset)).not.toBeNull();
});
*/

it('should run contactPointValues() without errors', () => {
  const dataset = datasets.datasetItems._embedded.datasets[0];
  expect(contactPointValues(dataset)).not.toBeNull();
});

it('should run distributionValues() without errors', () => {
  const dataset = datasets.datasetItems._embedded.datasets[0];
  expect(distributionValues(dataset)).not.toBeNull();
});

/*
it('should run sampleValues() without errors', () => {
  const dataset = datasets.datasetItems._embedded.datasets[0];
  expect(sampleValues(dataset)).not.toBeNull();
});
*/
