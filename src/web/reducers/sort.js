import {
  SORT_CHANGE,
} from '../constants';

/**
 * Valid sort state values
 * @type {{date: string, author: string, book: string}}
 */
const validSorts = {
  date: 'date',
  author: 'author',
  book: 'book',
};

const defualtState = validSorts.date;

/**
 * Root reducer, processes all the actions focusing on those available in its aciton handlers stack.
 *
 * @param {Object} state Current app state
 * @param {Object} action Action trigger aiming to change the state.
 *
 * @returns {Object} New App state
 */
export default function (state = defualtState, action) {
  const actions = {
    [SORT_CHANGE]: () => (validSorts[action.payload] || state),
  };

  return actions[action.type] ? actions[action.type]() : state;
}
