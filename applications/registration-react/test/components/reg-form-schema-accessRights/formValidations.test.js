import React from "react";
import {shallow} from "enzyme";
import validate from "../../../src/components/reg-form-schema-accessRights/formValidations";

let defaultProps, wrapper, resetFields;

beforeEach(() => {
  wrapper = shallow(<FormAccessRights {...defaultProps} />);
});
