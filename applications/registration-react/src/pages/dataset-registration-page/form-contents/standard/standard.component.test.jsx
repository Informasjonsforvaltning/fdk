import { shallow } from 'enzyme';
import { Standard } from './standard.component';

let wrapper;

test('should render Standard correctly', () => {
  wrapper = shallow(
    Standard({
      fields: null,
      titleLabel: '',
      linkLabel: '',
      languages: []
    })
  );
  expect(wrapper).toMatchSnapshot();
});
