import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Component from './Dummy.Component';
import {
  getTotal, getDate, getLoading, refreshStats, refreshDate,
} from '../../redux/reducers';

const mapStateToProps = createStructuredSelector({
  total: getTotal,
  loading: getLoading,
  date: getDate,
});

const mapDispatchToProps = dispatch => ({
  refresh: () => {
    dispatch(refreshStats());
    dispatch(refreshDate());
  },
});

const ConnectedComponent = connect(mapStateToProps, mapDispatchToProps)(Component);

ConnectedComponent.navigationOptions = Component.navigationOptions;

export default ConnectedComponent;
