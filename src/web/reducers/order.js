import {
  ORDER_CHANGE,
} from '../constants';

/**
 * Valid order state values
 * @type {{asc: string, dsc: string}}
 */
const validOrders = {
  asc: 'asc',
  dsc: 'dsc',
};

/**
 * Default App state, used at start
 * @type {Object}
 */
const defualtState = validOrders.dsc;

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
    [ORDER_CHANGE]: () => (validOrders[action.payload] || state),
  };

  return actions[action.type] ? actions[action.type]() : state;
}
