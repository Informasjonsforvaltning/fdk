import { shallow } from 'enzyme';
import { FormContentsComponent } from './form-contents.component';

let defaultProps;
let wrapper;

beforeEach(() => {
  defaultProps = {};
  wrapper = shallow(FormContentsComponent(defaultProps));
});

test('should render FormContentsComponent, { renderS correctly', () => {
  expect(wrapper).toMatchSnapshot();
});
