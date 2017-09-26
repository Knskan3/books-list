import { createSelector } from 'reselect';

const booksState = (state) => state.books;
const filtersState = (state) => state.filters;
const sortState = (state) => state.sort;
const orderState = (state) => state.order;

const booksStateSelector = createSelector(booksState, (books) => books);
const filtersStateSelector = createSelector(filtersState, (filters) => filters);
const sortStateSelector = createSelector(sortState, (sort) => sort);
const orderStateSelector = createSelector(orderState, (order) => order);

export {
  booksStateSelector,
  filtersStateSelector,
  sortStateSelector,
  orderStateSelector,
};
