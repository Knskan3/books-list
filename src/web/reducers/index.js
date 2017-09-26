// src/reducers/index.js
import { combineReducers } from 'redux';
import books from './books';
import filters from './filters';
import sort from './sort';
import order from './order';

const rootReducer = combineReducers({
  books,
  filters,
  sort,
  order,
});

export default rootReducer;
