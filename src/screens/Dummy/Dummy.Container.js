import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withTranslation } from 'react-i18next';
import { compose } from 'ramda';
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

export default compose(
  withTranslation('dummy'),
  connect(mapStateToProps, mapDispatchToProps),
)(Component);
