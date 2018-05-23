import React from "react";
import {shallow} from "enzyme";
import FormCatalogComponent, { FormCatalog } from "../../../src/components/reg-form-schema-catalog/form";
import helptext from "../../fixtures/helptext";

let defaultProps, wrapper, resetFields;

beforeEach(() => {
  resetFields = jest.fn();
  const {helptextItems} = helptext;
  defaultProps = {
    helptextItems: helptextItems,
    initialValues: {
      title: 'Title',
      publisher: 'Publisher'
    },
    values: {
      description: {
        nb: 'Beskrivelse'
      }
    }
  };
  wrapper = shallow(<FormCatalog {...defaultProps} />);
});


test('should render FormCatalog correctly', () => {
  expect(wrapper).toMatchSnapshot();
});
