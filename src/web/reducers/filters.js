import {
  FILTER_CHANGE,
} from '../constants';

import genres from '../../book-generator/genres';

/**
 * Default App state, used at start
 * @type {Object}
 */
const defualtState = {
  gender: {
    enabled: false,
    value: 'FEMALE',
    query: 'gender',
  },
  genre: {
    enabled: false,
    value: genres.indeterminate,
    query: 'genre',
  },
};

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
    [FILTER_CHANGE]: () => {
      const newState = JSON.parse(JSON.stringify((state)));
      const newFilter = action.payload.filter;

      newState[newFilter.name] = {
        ...newState[newFilter.name],
        enabled: newFilter.enabled,
        value: newFilter.value,
      };

      return newState;
    },
  };

  return actions[action.type] ? actions[action.type]() : state;
}
