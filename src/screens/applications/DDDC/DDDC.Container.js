import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { getSharedAttributes, getProgress } from 'redux/modules/applications';
import {
  fetchPetition,
  getPetition,
  getLoading,
  getSigned,
  getError,
  getVerification,
  getCertificates,
  callCredentialIssuer,
  signPetition,
  toggleSelectedAttribute,
} from 'redux/modules/applications/dddc';
import Component from './DDDC.Component';

const mapStateToProps = createStructuredSelector({
  sharedAttributes: getSharedAttributes('dddc'),
  petition: getPetition,
  loading: getLoading,
  signed: getSigned,
  error: getError,
  verification: getVerification,
  certificates: getCertificates,
  progress: getProgress('dddc'),
});

const mapDispatchToProps = {
  fetchPetition,
  callCredentialIssuer,
  signPetition,
  toggleSelectedAttribute,
};

const ConnectedComponent = connect(mapStateToProps, mapDispatchToProps)(Component);

ConnectedComponent.navigationOptions = Component.navigationOptions;

export default ConnectedComponent;
