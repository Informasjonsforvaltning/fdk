import React from "react";
import {shallow} from "enzyme";
import FormTitle from "../../../src/components/reg-form-schema-title/form";
import helptext from "../../fixtures/helptext";
import themes from "../../fixtures/themes";

let defaultProps, wrapper;

beforeEach(() => {
  const {helptextItems} = helptext;
  const {themesItems} = themes;
  defaultProps = {
    helptextItems: helptextItems,
  };
  wrapper = shallow(<FormTitle {...defaultProps} />);
});


test('should render FormTitle, { renderLandingpage  correctly', () => {
  expect(wrapper).toMatchSnapshot();
});

