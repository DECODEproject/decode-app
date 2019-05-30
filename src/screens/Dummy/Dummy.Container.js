import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Component from './Dummy.Component';
import { getGreeting } from '../../redux/reducers/index';

const mapStateToProps = createStructuredSelector({
  greeting: getGreeting,
});

export default connect(mapStateToProps)(Component);
