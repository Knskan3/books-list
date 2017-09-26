import {
  BOOKS_RESET,
  BOOKS_REQUEST,
  BOOKS_REQUEST_COMPLETED,
  BOOKS_REQUEST_ERROR,
  BOOKS_LOADING_CHANGE,
  SORT_CHANGE,
  ORDER_CHANGE,
  FILTER_CHANGE,
} from '../constants';


export const resetBooksState = () => ({
  type: BOOKS_RESET,
});

export const bookRequest = (options) => ({
  type: BOOKS_REQUEST,
  payload: options,
});

export const bookRequestCompleted = (params) => ({
  type: BOOKS_REQUEST_COMPLETED,
  payload: params,
});

export const bookRequestError = (err) => ({
  type: BOOKS_REQUEST_ERROR,
  payload: err,
});

export const changeLoading = (loadingStatus, backwards) => ({
  type: BOOKS_LOADING_CHANGE,
  payload: {
    loadingStatus,
    backwards,
  },
});

export const sortChange = (value) => ({
  type: SORT_CHANGE,
  payload: value,
});

export const orderChange = (value) => ({
  type: ORDER_CHANGE,
  payload: value,
});

export const filterChange = (filter) => ({
  type: FILTER_CHANGE,
  payload: {
    filter,
  },
});
