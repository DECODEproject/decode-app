import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Component from './Dummy.Component';
import { getGreeting, getTotal, refreshStats } from '../../redux/reducers/index';

const mapStateToProps = createStructuredSelector({
  greeting: getGreeting,
  total: getTotal,
});

const mapDispatchToProps = {
  refreshStats,
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
