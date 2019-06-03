import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Component from './Dummy.Component';
import {
  getTotal, getDate, refreshStats, refreshDate,
} from '../../redux/reducers/index';

const mapStateToProps = createStructuredSelector({
  total: getTotal,
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
