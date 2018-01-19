// {/*
// import React from 'react';
// import { withFormik, Form, Field } from 'formik';
// import Yup from 'yup';
//
// const DatasetForm2 = ({
//   values,
//   errors,
//   touched,
//   setTouched
// }) => (
//   <div>
//     { touched.title && errors.title && <p>{errors.title}</p> }
//     <Field
//       type="text"
//       name="title"
//       placeholder="Title"
//       value={values.title}
//       onBlur={(e) => {values.onSave(e, setTouched, values, errors)}}
//     />
//   </div>
// );
//
// export class DatasetForm3 extends React.Component { // eslint-disable-line react/prefer-stateless-function
//   constructor(props) {
//     super(props);
//     this.state = ({
//       title: this.props.values.title
//     })
//   }
//
//   componentWillReceiveProps() {
//
//   }
//
//   render() {
//     const { values, errors, touched, setTouched } = this.props;
//     return (
//       <Form refs="myForm">
//         { touched.title && errors.title && <p>{errors.title}</p> }
//         <Field type="text" name="title" placeholder="Title" value={values.title} onBlur={(e) => {
//           values.onSave(e, setTouched, values, errors)
//         }}/>
//         <Field type="text" name="name" placeholder="Name" onBlur={(e) => {
//           handleBlur(e, setTouched, values, errors)
//         }}/>
//         <button>Submit</button>
//       </Form>
//     );
//   }
//
// }
//
// const DatasetForm  = (props) => {
//   const { values, errors, touched, setTouched } = props;
//
//   return (
//     <Form refs="myForm">
//       {DatasetForm2({values, errors, touched, setTouched})}
//       {DatasetForm4({values, errors, touched, setTouched})}
//     </Form>
//   );
//
// }
//
// const DatasetForm4 = ({
//   values,
//   errors,
//   touched,
//   setTouched
// }) => (
//   <div>
//     <Field type="text" name="name" placeholder="Name" onBlur={(e) => {
//       values.onSave(e, setTouched, values, errors)
//     }}/>
//     <button>Submit</button>
//   </div>
// );
//
// function handleBlur(e, setTouched, values, errors) {
//
//   /*
//   console.log('values', values);
//   console.log('errors', errors);
//   setTouched({[e.target.name]: true});
//   const saveValue = e.target.value
//   console.log("handle custom change", e.target.name + ' ' + saveValue)
//
//
//   const body = {
//     id: "e679b150-e69d-444c-bf7f-874d6999c62d",
//     uri: "http://brreg.no/catalogs/910244132/datasets/e679b150-e69d-444c-bf7f-874d6999c62d",
//     title: {
//       nb: `${saveValue}`
//     },
//     description: null,
//     objective: null,
//     publisher: {
//       uri: "http://data.brreg.no/enhetsregisteret/enhet/910244132",
//       id: "910244132",
//       name: "RAMSUND OG ROGNAN REVISJON"
//     },
//     accessRights: {
//       uri: "http://publications.europa.eu/resource/authority/access-right/RESTRICTED"
//     },
//     catalogId: "910244132",
//     _lastModified: "2018-01-12T10:58:07.524+0000",
//     registrationStatus: "DRAFT",
//     keyword: [{
//       nb: "Søkeord 3"
//     }],
//     subject: null,
//     theme: null,
//     landingPage: null,
//     identifier: null,
//     contactPoint: null,
//     conformsTo: null,
//     distribution: null,
//     sample: null,
//     language: null,
//     temporal: null,
//     legalBasisForProcessing: null,
//     legalBasisForAccess: null,
//     informationModel: null,
//     references: null,
//     issued: null,
//     modified: null,
//     type: null,
//     accrualPeriodicity: null,
//     provenance: null,
//     hasCurrentnessAnnotation: null,
//     spatial: [{
//       uri: "hurum",
//       prefLabel: null
//     }],
//     legalBasisForRestriction: [{
//       uri: null,
//       prefLabel: {
//         nb: "testerPrefLabel"
//       }
//     }]
//   }
//   const api = {
//     Authorization: "Basic " + null
//   }
//
//   axios.put(
//     '/catalogs/910244132/datasets/e679b150-e69d-444c-bf7f-874d6999c62d/',body, {headers: api}
//   )
//     .then((response) => {
//       console.log("saved!");
//
//       //console.log(JSON.stringify(response));
//     })
//     .catch((error) => {
//       console.log('feiler');
//     })
//   ;
//
//   /*
//    this.delay(() => {
//    if (this.datasetSavingEnabled) {
//    that.save.call(that);
//    }
//    }, this.saveDelay);
//    */
//
//   /*
//    saveDelay: number = 500;
//    */
//
// }
//
// /*
//  function delay(callback, ms): void {
//  clearTimeout(this.timer);
//  this.timer = setTimeout(callback, ms);
//  }
//  */
//
// export default withFormik({
//   mapPropsToValues({ title, onSave, onChange }) {
//     return {
//       title: title || '',
//       onSave
//     }
//   },
//   validationSchema: Yup.object().shape({
//     title: Yup.string().min(3, 'Mininum 3 characters or longer').required('Title is required')
//   }),
//   handleSubmit(values) {
//     console.log(values)
//   }
// })(DatasetForm)
// */}
