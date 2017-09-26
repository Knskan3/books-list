/**
 * This module is intended to take care of the express incoming requests regarding books
 * The handler and the regex are defined here.
 */
import mongoClient from './mongoClient';

/**
 * Entry point rule to be match on the request.
 *
 * @type {string}
 */
const rule = '/books/:skip/:limit/:sort/:filters?';
// /books/0/100/author-asc/gender-FEMALE,genre-1

/**
 * Valid sort operations. Will be validated against incoming query params in the url
 *
 * @type {{date: {publishDate: number}, author: {[author.name]: number}, book: {name: number}}}
 */
const validSort = {
  date: { publishDate: 1 },
  author: { 'author.name': 1 },
  book: { name: 1 },
};

/**
 * Valid mongodb request order values. Will be validated against incoming query params in the url
 *
 * @type {{asc: number, dsc: number}}
 */
const validOrder = {
  asc: 1,
  dsc: -1,
};

/**
 * Contains the filter generators for genter and genre.
 *
 * @type {{gender: ((p1?:*)=>{[author.gender]: *}), genre: ((p1:*)=>{[genre.id]: number})}}
 */
const filterHandlers = {
  gender: (gender) => ({ 'author.gender': gender }),
  genre: (id) => ({ 'genre.id': +id }),
};

/**
 * Composes the filters in mongodb query format based on the incoming request params
 *
 * @param {String} filtersQuery String containing the filters requested
 *
 * @returns {Object}
 */
const getFilterFromQuery = (filtersQuery) => {
  let filters = {};
  const filtersArray = filtersQuery ? filtersQuery.split(',') : [];

  filtersArray.forEach((filter) => {
    const filterValues = filter.split('-');
    let newFilter = {};

    if (Object.prototype.hasOwnProperty.call(filterHandlers, filterValues[0])) {
      newFilter = filterHandlers[filterValues[0]](filterValues[1]);
      filters = {
        ...filters,
        ...newFilter,
      };
    }
  });

  return filters;
};

/**
 * Composes the sort params in mongodb query format based on the incoming request params
 *
 * @param {String} sortQuery String containing the sort options requested
 *
 * @returns {Object}
 */
const getSortFromQuery = (sortQuery) => {
  const sortValues = sortQuery.split('-');

  const sort = Object.prototype.hasOwnProperty.call(validSort, sortValues[0])
    ? validSort[sortValues[0].toLowerCase()]
    : validSort.date;

  const order = Object.prototype.hasOwnProperty.call(validOrder, sortValues[1])
    ? validOrder[sortValues[1].toLowerCase()]
    : validOrder.asc;

  sort[Object.keys(sort)[0]] = order;

  return sort;
};

/**
 * Request handler method. It's trigger once the entry point is matched in the request.
 * This will send a response back to the client containg collections from mongo db (books)
 *
 * @param {Object} req express http request object
 * @param {Object} res express http response object
 */
const bookHandler = (req, res) => {
  const skip = +req.params.skip;
  const limit = +req.params.limit;
  const filters = getFilterFromQuery(req.params.filters);
  const sort = getSortFromQuery(req.params.sort);

  getBooksFromDB({ skip, limit, sort, filters })
    .then((result) => {
      res.send(result);
    });
};

/**
 * Async wrapper to perform the books request to db
 *
 * @param {skip: number, limit: number, sort: number, filters: Object} params Params needed to perform the request.
 * @return {Promise.<{Object,Error}>} If resolved, will return an array of documents (books)
 */
async function getBooksFromDB(params) {
  let result = {};

  try {
    result = await mongoClient.getDocuments(params);
  } catch (err) {
    console.log('Error requesting Books to DB', err);
  }
  return result;
}

export { rule };

export default bookHandler;
