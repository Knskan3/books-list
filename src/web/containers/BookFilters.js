/**
 * Created by javier on 28/09/2017.
 */
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import BookFiltersComponent from '../components/BookFilters/BookFilters';
import {
  sortStateSelector,
  orderStateSelector,
} from '../selectors';
import {
  bookRequest,
  sortChange,
  filterChange,
  orderChange,
} from '../actions';

/**
 * Injects the needed state values into the component as props.
 * We are using selectors from reselect to memoize and improve performance
 * This will also allow us to access state easily form sagas.
 *
 * @param {Object} state Cureent app state
 */
const mapStateToProps = (state) => ({
  sort: sortStateSelector(state),
  order: orderStateSelector(state),
});

/**
 * Injects actions into the component class props
 *
 * @param {Function} dispatch Action dispatcher
 * @returns {Function} dispatchProps
 */
const mapDispatchToProps = (dispatch) => (
  bindActionCreators({
    bookRequest,
    sortChange,
    filterChange,
    orderChange,
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(BookFiltersComponent);

