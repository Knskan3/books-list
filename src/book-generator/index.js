require('babel-register');

/* eslint-disable import/first */
import BookGenerator from './BookGenerator';
import PromisedMongoClient from '../mongo-client';
import config from './config';
/* eslint-enable */

const generator = new BookGenerator();
const mongoClient = new PromisedMongoClient();

const booksRequest = process.argv[2] || config.defaultBooksRequest;
const batchSize = Math.max(
  config.minBatchSize,
  Math.min(config.maxBatchSize, process.argv[3] || config.maxBatchSize)
);

/**
 * Calculates the remaining batch of books to process
 *
 * @param {number} total Number of books remaining to create
 *
 * @returns {*}
 */
const calculateNextBatch = (total) => {
  if (total <= 0) {
    return 0;
  }

  if (total >= batchSize) {
    return batchSize;
  }

  return total;
};

/**
 * Generates two special cases of books and populates the database with them.
 *
 * @return {Promise.<void>}
 */
async function pushSpecialCases() {
  const books = generator.generateSpecialBooks();
  await mongoClient.insertDocuments(books);
  console.log('Special Cases Inserted', books.length);
  return books.length;
}

/**
 * Generates batches of books and populates the database with them.
 * I had to disable eslint for no-await-in-loop as I didnt wanted to create
 * 1m Promises Array. In this case I find it justified.
 *
 * @return {Promise.<void>}
 */
async function populateDB(total) {
  let batch = calculateNextBatch(total);
  let counter = total;

  while (batch > 0) {
    const books = generator.generateBooks(batch);
    counter -= batch;
    // eslint-disable-next-line no-await-in-loop
    await mongoClient.insertDocuments(books);
    console.log(`${books.length} Books inserted. ${counter} Remaining.`);

    batch = calculateNextBatch(counter);
  }

  const booksNumber = await mongoClient.getNumberOfDocuments();
  console.log(`Completed with ${booksNumber} books in db`);
}

/**
 * Generator entry point. Connects to mongoDB and starts populating it.
 *
 * @return {Promise.<void>}
 */
async function start() {
  try {
    await mongoClient.connect();
    await mongoClient.removeCollection();
    const specialCasesNumber = await pushSpecialCases();
    await populateDB(booksRequest - specialCasesNumber);
  } catch (err) {
    console.log('Error populating DB', err);
  } finally {
    mongoClient.close();
  }
}

start();
