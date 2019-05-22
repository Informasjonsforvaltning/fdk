import { connect } from 'react-redux';
import _ from 'lodash';

const mapStateToProps = state => {
  const searchHostname = _.get(
    state,
    ['config', 'searchHostname'],
    'fellesdatakatalog.brreg.no'
  );
  return {
    searchHostname
  };
};

export const connector = connect(mapStateToProps);
