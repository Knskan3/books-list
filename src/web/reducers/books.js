import {
  BOOKS_RESET,
  BOOKS_REQUEST_COMPLETED,
  BOOKS_LOADING_CHANGE,
} from '../constants';
import config from '../config';

/**
 * Default App state, used at start
 * @type {Object}
 */
const defaultState = {
  stack: [],
  first: 0,
  last: 0,
  total: 0, // in db without filter
  loading: true,
  loadingBackwards: false,
};

/**
 * Reducer to append books to the end of the books stacks in the state.
 *
 * @param {Object} state Current app state
 * @param {Object} action Action trigger aiming to change the state.
 *
 * @returns {{stack: [*,*], total: (number|*), first: number, last}}
 */
const appendBooksToState = (state, action) => {
  let newStack = [
    ...state.stack,
    ...action.payload.stack,
  ];
  let newFirst = state.first;

  // remove from start
  if (newStack.length >= config.books.maxConcurrent) {
    newStack = newStack.slice(config.books.batchSize, newStack.length);
    newFirst += config.books.batchSize;
  }

  return {
    ...state,
    stack: newStack,
    last: state.last + action.payload.stack.length,
    total: action.payload.total,
    first: newFirst,
  };
};

/**
 * Reducer to prepend books to the begining of the books stacks in the state.
 *
 * @param {Object} state Current app state
 * @param {Object} action Action trigger aiming to change the state.
 *
 * @returns {{stack: [*,*], total: (number|*), first: number, last}}
 */
const prependBooksToState = (state, action) => {
  let newStack = [
    ...action.payload.stack,
    ...state.stack,
  ];
  let newLast = state.last;

  // remove from end
  if (newStack.length >= config.books.maxConcurrent) {
    newStack = newStack.slice(0, newStack.length - config.books.batchSize);
    newLast -= config.books.batchSize;
  }

  return {
    ...state,
    stack: newStack,
    total: action.payload.total,
    first: state.first - action.payload.stack.length,
    last: newLast,
  };
};

/**
 * Root reducer, processes all the actions focusing on those available in its aciton handlers stack.
 *
 * @param {Object} state Current app state
 * @param {Object} action Action trigger aiming to change the state.
 *
 * @returns {Object} New App state
 */
export default function (state = defaultState, action) {
  const actions = {
    [BOOKS_RESET]: () => (defaultState),
    [BOOKS_REQUEST_COMPLETED]: () => {
      // append new books
      if (action.payload.skip >= state.first) {
        return appendBooksToState(state, action);
      }
      return prependBooksToState(state, action);
    },
    [BOOKS_LOADING_CHANGE]: () => ({
      ...state,
      loading: action.payload.backwards ? state.loading : action.payload.loadingStatus,
      loadingBackwards: action.payload.backwards ? action.payload.loadingStatus : state.loadingBackwards,
    }),
  };
  return actions[action.type] ? actions[action.type]() : state;
}
