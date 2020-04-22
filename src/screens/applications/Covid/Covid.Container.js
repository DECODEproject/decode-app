import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  getSk1,
  getSk2,
  getMoments,
  getEphids,
  getGeneratedSK1,
  getGeneratedSK2,
  getGeneratedEphids,
} from 'redux/modules/applications/covid';
import Component from './Covid.Component';

const mapStateToProps = createStructuredSelector({
  sk1: getSk1,
  sk2: getSk2,
  moments: getMoments,
  ephids: getEphids
});

const mapDispatchToProps = {
  getGeneratedSK1,
  getGeneratedSK2,
  getGeneratedEphids
};

const ConnectedComponent = connect(mapStateToProps, mapDispatchToProps)(Component);

ConnectedComponent.navigationOptions = Component.navigationOptions;

export default ConnectedComponent;