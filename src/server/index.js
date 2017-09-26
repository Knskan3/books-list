require('babel-register');

/* eslint-disable import/first */
import cors from 'cors';
import express from 'express';
import path from 'path';
import mongoClient from './mongoClient';
import bookHandler, { rule as bookHandlerRule } from './booksHandler';
import config from './config';
/* eslint-enable */

const app = express();
app.use(cors());

async function start() {
  await mongoClient.connect();
  // Serving static files
  app.use(express.static('build'));

  // Home Page
  app.get('/', (req, res) => {
    res.sendFile(path.join(`${__dirname}/../../build/index.html`));
  });

  // books
  app.get(bookHandlerRule, bookHandler);

  app.listen(config.port, () => {
    console.log(`Server running at http://localhost:${config.port}/`);
  });
}

start();
