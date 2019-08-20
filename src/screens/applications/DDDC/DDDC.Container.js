import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { getSharedAttributes } from 'redux/modules/attributes';
import { fetchPetition, getPetition, getLoading, getError, getVerification, getCertificates, callCredentialIssuer } from 'redux/modules/applications/dddc';
import Component from './DDDC.Component';

const mapStateToProps = createStructuredSelector({
  sharedAttributes: getSharedAttributes('dddc'),
  petition: getPetition,
  loading: getLoading,
  error: getError,
  verification: getVerification,
  certificates: getCertificates,
});

const mapDispatchToProps = {
  fetchPetition,
  callCredentialIssuer,
};

const ConnectedComponent = connect(mapStateToProps, mapDispatchToProps)(Component);

ConnectedComponent.navigationOptions = Component.navigationOptions;

export default ConnectedComponent;
