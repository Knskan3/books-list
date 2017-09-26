import {
  ButtonToolbar,
  ToggleButtonGroup,
  ToggleButton,
  FormGroup,
  FormControl,
  Glyphicon,
  Well,
} from 'react-bootstrap';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import genres from '../../../book-generator/genres';

/**
 * Describes the BookFilters react component
 */
class BookFilters extends Component {
  /**
   * Handles the sort change and throws actions in order to update the state.
   *
   * @param {String} val New selection value
   */
  handleSortChange = (val) => {
    this.props.sortChange(val);
    this.props.bookRequest({ reset: true });
  }

  /**
   * Handles the order change and throws actions in order to update the state.
   *
   * @param {String} val New selection value
   */
  handleOrderChange = (val) => {
    this.props.orderChange(val);
    this.props.bookRequest({ reset: true });
  }

  /**
   * Handles the genre change and throws actions in order to update the state.
   *
   * @param {Event} e Event thrown by the select html element
   */
  handleGenreChange = (e) => {
    this.props.filterChange({
      name: 'genre',
      value: e.target.value,
      enabled: (e.target.value !== 'none'),
    });
    this.props.bookRequest({ reset: true });
  }

  /**
   * Handles the gender change and throws actions in order to update the state.
   *
   * @param {String} val New selection value
   */
  handleGenderChange = (val) => {
    this.props.filterChange({
      name: 'gender',
      value: val,
      enabled: (val !== 'none'),
    });
    this.props.bookRequest({ reset: true });
  }

  /**
   * Lifecycle component method. Renders the component.
   *
   * @returns {JSX}
   */
  render() {
    return (<div>
      <Well>
        <h3>Sort by</h3>
        <ButtonToolbar>
          <ToggleButtonGroup onChange={this.handleSortChange} type="radio" name="sort" defaultValue={'date'}>
            <ToggleButton value={'date'}>Date</ToggleButton>
            <ToggleButton value={'author'}>Author Name</ToggleButton>
            <ToggleButton value={'book'}>Book Title</ToggleButton>
          </ToggleButtonGroup>
          <ToggleButtonGroup onChange={this.handleOrderChange} type="radio" name="order" defaultValue={'dsc'}>
            <ToggleButton value={'asc'}><Glyphicon glyph={'glyphicon glyphicon-triangle-top'} /></ToggleButton>
            <ToggleButton value={'dsc'}><Glyphicon glyph={'glyphicon glyphicon-triangle-bottom'} /></ToggleButton>
          </ToggleButtonGroup>
        </ButtonToolbar>
        <h3>Filter by Author Gender</h3>
        <ButtonToolbar>
          <ToggleButtonGroup onChange={this.handleGenderChange} type="radio" name="sort" defaultValue={'none'}>
            <ToggleButton value={'none'}>All</ToggleButton>
            <ToggleButton value={'MALE'}>Male</ToggleButton>
            <ToggleButton value={'FEMALE'}>Female</ToggleButton>
          </ToggleButtonGroup>
        </ButtonToolbar>
        <h3>Filter by Book Genre</h3>
        <FormGroup>
          <FormControl onChange={this.handleGenreChange} componentClass="select" placeholder="Book Genre">
            <option value="none">None</option>
            {
              Object.keys(genres).map((key) => (
                <option key={genres[key].id} value={genres[key].id}>{genres[key].name}</option>
              ))
            }
          </FormControl>
        </FormGroup>
      </Well>
    </div>);
  }
}
/**
 * Props type validation for this component.
 *
 * @type {{sortChange: *, filterChange: *, orderChange: *, bookRequest: *}}
 */
BookFilters.propTypes = {
  sortChange: PropTypes.func,
  filterChange: PropTypes.func,
  orderChange: PropTypes.func,
  bookRequest: PropTypes.func,
};

export default BookFilters;
