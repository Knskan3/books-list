/**
 * Defines the global web app configuration
 *
 * @type {{minBatchSize: number, maxBatchSize: number, defaultBooksRequest: number}}
 */
const config = {
  scroll: {
    bottomTreshold: 65,
    topTreshold: 35,
  },
  books: {
    batchSize: 100,
    maxConcurrent: 600,
  },
  db: {
    baseURL: 'http://localhost:4000/books/',
  },
};

export default config;
