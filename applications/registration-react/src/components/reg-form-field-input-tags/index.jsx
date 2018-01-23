// import React from 'react';
// import PropTypes from 'prop-types';
// import TagsInput from 'react-tagsinput'
// //import 'react-tagsinput/react-tagsinput.css'
// import './index.scss';
//
// export default class InputTagsField extends React.Component {
//
//   constructor(props) {
//     super();
//     this.state = {
//     }
//     this.handleChange = this.handleChange.bind(this);
//   }
//
//   handleChange(tags) {
//     this.props.input.onChange(tags);
//   }
//
//   render() {
//     const { input, label, type, meta: { touched, error, warning } } = this.props;
//     //console.log("props", JSON.stringify(this.props));
//     return (
//       <div className="pl-2">
//         <label className="fdk-form-label">{label}</label>
//         <div className="d-flex align-items-center">
//           <TagsInput {...input} className="fdk-reg-input-tags" inputProps={{placeholder: ''}} onChange={this.handleChange} />
//           {touched && !error &&
//           <i className="fa fa-check-circle fa-lg ml-2 fdk-reg-save-success"/>
//           }
//           {!touched &&
//           <i className="fa fa-check-circle fa-lg ml-2 invisible"/>
//           }
//         </div>
//         {touched && ((error &&
//         <div className="alert alert-danger mt-3">{error}</div>) || (warning && <div className="alert alert-warning mt-3">{warning}</div>))
//         }
//       </div>
//     );
//   }
// }
//
// InputTagsField.defaultProps = {
//
// };
//
// InputTagsField.propTypes = {
//
// };

import React from 'react';
import PropTypes from 'prop-types';
import TagsInput from 'react-tagsinput'
import './index.scss';

const handleChange = (props, tags) => {
  //console.log("touched", JSON.stringify(props.meta.touched));
  //console.log(JSON.stringify(tags));
  //const { input, label, type, meta: { touched, error, warning } } = props;
  props.meta.touched.true;
  props.input.onChange(tags);
  //console.log("props touched", JSON.stringify(props));
  //this.props.input.onChange(tags);
}

const InputTagsField  = (props) => {
    const { input, label, type, meta: { touched, error, warning } } = props;
    //console.log("props", JSON.stringify(props));
    return (
      <div className="pl-2">
        <label className="fdk-form-label">{label}</label>
        <div className="d-flex align-items-center">
          <TagsInput
            {...input}
            className="fdk-reg-input-tags"
            inputProps={{placeholder: ''}}
            onChange={(tags) => (handleChange(props, tags))}
          />
          {touched && !error &&
          <i className="fa fa-check-circle fa-lg ml-2 fdk-reg-save-success"/>
          }
          {!touched &&
          <i className="fa fa-check-circle fa-lg ml-2 invisible"/>
          }
        </div>
        {touched && ((error &&
         <div className="alert alert-danger mt-3">{error}</div>) || (warning && <div className="alert alert-warning mt-3">{warning}</div>))
        }
      </div>
    );
}

InputTagsField.defaultProps = {

};

InputTagsField.propTypes = {

};

export default InputTagsField;



