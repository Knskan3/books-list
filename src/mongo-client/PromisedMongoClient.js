import mongojs from 'mongojs';
import config from './config';

/**
 * Class Representing the Mongo Client.
 * Provides a wrapper for mongojs in a promise approach. The solution is written for our needs.
 * The catalog is defined in the config but can be overrided in the constructor
 */
class PromisedMongoClient {
  /**
   * Creates a PromisedMongoClient
   *
   * @param {Object} params The Default Values overrides.
   *
   * @public
   */
  constructor(params) {
    this.config = {
      ...config,
      ...params,
    };
    this.db = null;
    this.collection = null;
    this.connected = false;
  }

  /**
   * Handles the connection of this client to the actual mongo database.
   *
   * @returns {Promise} Promise to handle the module with await
   */
  connect() {
    return new Promise((solve, reject) => {
      console.log('Trying to connect to database, please wait...');
      this.db = mongojs(this.config.host, [this.config.collection]);

      this.db.on('connect', () => {
        console.log('Connected to database');
        this.collection = this.db.collection(this.config.collection);
        this.connected = true;
        solve();
      });

      /*
       We need this ping dua a bug in the mongojs library, not throwing the connected event till
       at least one opperation occurs
       */
      this.db.on('error', (err) => {
        console.log('Error during connection to Database', err);
        reject(err);
      });

      /**
       * Seems like the library is buggy and the connect event is not thrown
       * unless an operation is perform
       */
      this.db.runCommand({ ping: 1 });
    });
  }

  /**
   * Inserts an array of documents into the catalog. We use the bulk approach.
   * The batching is handled in another level to guarantee avoid huge requests.
   *
   * @param {Array} documents Array of objects to be insterted
   *
   * @returns {Promise}
   */
  insertDocuments(documents) {
    // Get the documents collection

    return new Promise((solve, reject) => {
      const bulk = this.collection.initializeOrderedBulkOp();

      documents.forEach((doc) => {
        bulk.insert(doc);
      });

      bulk.execute((err) => {
        if (!err) {
          solve();
        } else {
          reject(err);
        }
      });
    });
  }

  /**
   * Performs a request to the mongodb to retrieve the count of documents based on find.
   *
   * @param {skip: number, limit: number, sort: number, filters: Object} params Params needed to perform the request.
   *
   * @returns {Promise.<Array, Error>}
   */
  getDocumentsCount(params) {
    return new Promise((solve, reject) => {
      this.collection
        .find(params.filters)
        .count((err, docs) => {
          if (!err) {
            solve(docs);
          } else {
            reject(err);
          }
        });
    });
  }

  /**
   * Performs a request to the mongodb to retrieve an Array of Documents.
   *
   * @param {skip: number, limit: number, sort: number, filters: Object} params Params needed to perform the request.
   *
   * @returns {Promise.<Array, Error>}
   */
  getDocuments(params) {
    console.log('DB Reequest', params);

    return new Promise((solve, reject) => {
      this.getDocumentsCount(params)
        .then((total) => {
          this.collection
            .find(params.filters)
            .sort(params.sort)
            .skip(params.skip)
            .limit(params.limit, (err, docs) => {
              if (!err) {
                console.log('Find Request completed');
                solve({
                  docs,
                  total,
                });
              } else {
                reject(err);
              }
            });
        });
    });
  }

  /**
   * Deletes the whole collection.
   * Usefull to wipe the database before populating again.
   *
   * @returns {Promise.<Object, Error>}
   */
  removeCollection() {
    return new Promise((solve, reject) => {
      console.log('Removing whole database...');
      this.collection.remove((err, res) => {
        if (!err) {
          console.log('Database Wiped ou: ', res.n);
          solve(res);
        } else {
          reject(err);
        }
      });
    });
  }

  /**
   * Returns the number of documents inside the database
   *
   * @returns {Promise<number, Error>}
   */
  getNumberOfDocuments() {
    return new Promise((solve, reject) => {
      this.collection.runCommand('count', (err, res) => {
        if (!err) {
          solve(res.n);
        } else {
          reject(err);
        }
      });
    });
  }

  /**
   * Closes the connection with the datbase.
   */
  close() {
    console.log('Connection to DB closed');
    this.db.close();
  }
}

export default PromisedMongoClient;
