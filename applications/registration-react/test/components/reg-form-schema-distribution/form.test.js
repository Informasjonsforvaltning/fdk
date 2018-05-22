import React from "react";
import {shallow} from "enzyme";
import FormDistribution from "../../../src/components/reg-form-schema-distribution/form";
import helptext from "../../fixtures/helptext";
import openlicenses from "../../fixtures/openlicenses";
import distribution from "../../fixtures/distributions";

let defaultProps, wrapper;

beforeEach(() => {
  const {helptextItems} = helptext;
  const {openLicenseItems} = openlicenses;
  defaultProps = {
    initialValues: {
      distribution,
      openLicenseItems
    },
    helptextItems: helptextItems,
  };
  wrapper = shallow(<FormDistribution {...defaultProps} />);
});


test('should render FormDistribution correctly', () => {
  expect(wrapper).toMatchSnapshot();
});



