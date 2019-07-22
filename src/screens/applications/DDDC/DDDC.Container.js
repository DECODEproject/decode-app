import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { getSharedAttributes } from 'redux/modules/attributes';
import { fetchPetition, getPetition, getLoading, getError } from 'redux/modules/applications/dddc';
import Component from './DDDC.Component';

const mapStateToProps = createStructuredSelector({
  sharedAttributes: getSharedAttributes('dddc'),
  petition: getPetition,
  loading: getLoading,
  error: getError,
});

const mapDispatchToProps = dispatch => ({
  fetchPetition: (url, id) => dispatch(fetchPetition(url, id)),
});

const ConnectedComponent = connect(mapStateToProps, mapDispatchToProps)(Component);

ConnectedComponent.navigationOptions = Component.navigationOptions;

export default ConnectedComponent;
