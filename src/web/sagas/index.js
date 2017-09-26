import { put, takeLatest, select, call } from 'redux-saga/effects';

import {
  BOOKS_REQUEST,
} from '../constants';

import {
  bookRequestCompleted,
  bookRequestError,
  changeLoading,
  resetBooksState,
} from '../actions';

import {
  booksStateSelector,
  filtersStateSelector,
  sortStateSelector,
  orderStateSelector,
} from '../selectors';

const mongoBaseURL = 'http://localhost:4000/books/';

/**
 * Composes the URL to fetch books from database.
 *
 * @param {Object} options Options needed to compose the url
 *
 * @returns {string} URL to perform the request
 */
const composeRequestURL = (options) => {
  const filterEntries = Object.entries(options.filters);
  const filters = [];
  filterEntries.forEach((entry) => {
    const filter = entry[1];
    if (filter.enabled) {
      filters.push([filter.query, filter.value].join('-'));
    }
  });

  return `${mongoBaseURL}${options.skip}/${options.limit}/${options.sort}-${options.order}/${filters.join(',')}`;
};

/**
 * Generator in charge of composing the options to perform a request.
 *
 * @param {Boolean} backwards Determinates if we are scrolling up
 *
 * @returns {{skip: number, limit: number, filters: *, sort: *, order: *}}
 */
function* getStateForRequest(backwards) {
  const books = yield select(booksStateSelector);
  const filters = yield select(filtersStateSelector);
  const sort = yield select(sortStateSelector);
  const order = yield select(orderStateSelector);
  return {
    skip: backwards ? books.first - books.batchSize : books.last,
    limit: books.batchSize,
    filters,
    sort,
    order,
  };
}

/**
 * Fetches Books from mongodb, the request is based in the current state and options.
 *
 * @param {Object} action Action containing the type and payload with options
 */
function* fetchBooks(action) {
  try {
    if (action.payload.reset) {
      yield put(resetBooksState());
    }
    yield put(changeLoading(true, action.payload.backwards));
    const options = yield call(getStateForRequest, action.payload.backwards);
    const response = yield fetch(composeRequestURL(options), { method: 'GET' });
    const json = yield response.json();
    yield put(bookRequestCompleted({
      stack: json.docs,
      total: json.total,
      skip: options.skip,
    }));
  } catch (err) {
    yield put(bookRequestError(`Error while retrieving books ${err}`));
  } finally {
    yield put(changeLoading(false, action.payload.backwards));
  }
}

/**
 * Main saga (generator), takes all the incoming actions and focuses int he book requests
 */
function* mySaga() {
  yield takeLatest(BOOKS_REQUEST, fetchBooks);
}

export default mySaga;
