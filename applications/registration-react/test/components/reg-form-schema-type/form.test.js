import React from "react";
import {shallow} from "enzyme";
import FormType from "../../../src/components/reg-form-schema-type/form";
import helptext from "../../fixtures/helptext";
import themes from "../../fixtures/themes";

let defaultProps, wrapper;

beforeEach(() => {
  const {helptextItems} = helptext;
  const {themesItems} = themes;
  defaultProps = {
    syncErrors: {
      errorType: true
    },
    helptextItems: helptextItems,
  };
  wrapper = shallow(<FormType {...defaultProps} />);
});


test('should render FormType, { renderLandingpage  correctly', () => {
  expect(wrapper).toMatchSnapshot();
});

