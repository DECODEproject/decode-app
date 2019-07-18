import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { getSharedAttributes } from 'redux/modules/attributes';
import Component from './DDDC.Component';

const mapStateToProps = createStructuredSelector({
  sharedAttributes: getSharedAttributes('dddc'),
});

const ConnectedComponent = connect(mapStateToProps, null)(Component);

ConnectedComponent.navigationOptions = Component.navigationOptions;

export default ConnectedComponent;
