import React from 'react';
import { shallow } from 'enzyme';

const shallowWithStore = (component, store) => {
  const context = {
    store
  };

  /*
   It was originally:

   return shallow(component, { context });
   But with upgrade to redux-form we got error of react 16.8 new context is not implemented in enzyme

   https://github.com/airbnb/enzyme/issues/1908#issuecomment-439747826
   */
  return shallow(<component />, { context });
};

export default shallowWithStore;
