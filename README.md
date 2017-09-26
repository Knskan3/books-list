## Scrollable Book List ##

## Install

- Clone (or download) this repository
- Run `yarn install` in the folder.

Good to know:

- Made with `v6.11.3` please download if needed.
- Using `babel-node` to transpile the code in real time and get ES6 features for nodejs.

(You could also use `npm`)


## Run the application (express server)

To run the web app:

- Run: `yarn start` (Site available at `http://localhost:4000/`)
- Tests & linting: `yarn test`

The mongoDB is pre populated but you can allways do it again.

- Run `yarn generate [Total] [BatchSize]`. In our case `yarn populate 1000000 500`. 

  BatchSize is Clamped [1,300].
  
  This will take a few minutes :D.

!!Both will remove all the bocks before generating

## Local Development Environment

In this case we can use the webpack-dev-server to get the advantage of hot module replacement and nicer
development environment and also make use of your express server to get the books.

Note the site port is different now and that you will need a terminal per process.

1. Run: `yarn local` (Site available at `http://localhost:3000/`)
2. Run: `yarn server` (Server running at `http://localhost:4000/`) (CORS enabled :D)


(You could also use `npm`)

## Extra tasks implemented:

* [x] Sort by book name
* [x] Sort by author name
* [x] Sort by book genre
* [x] Sort by author gender
* [x] Indicate books in the "horror" genre, published on Halloween
* [x] Indicate books in the "finance" genre, published on the last Friday of any month

## Problem Analysis

#### 1m Books Scroll list
* Its a quite big number, I'll have to batch the generation and requests, using async/await will help.
* I'll use a secuential date to be able to have all the casuistics for special flag cases.

#### 1m Books Scroll list

* The list is too big to be just rendered in the browser.

* A infinite scroll (lazy loading as we scroll down) might be a good starting point. 

    The problem is that if we scroll too far we would be anyway loading the 1m results (sub optimal). 
    We would need to be removing previous results and recalculating the scroll as we go to avoid crazy jumps.

* Potential issues of this implementation (not being covered):
    * Window resizing could break the application, forcing us to recalculate. (I'll be using a fix size box for the list container).
    * If new books were added/removed during the execution it could lead to repeated elements. ( I assume this wont happen here so I wont be tackling this).
    * Cache of the requests to improve the performance. We could serve the content with a reverse proxy cache like Varnish, or use a distributed cache like Riak to store the responses but we are going to assume the server is good enough for 1 user. 

#### Sort and Filter

* Sorting and filtering will be implemented during mongodb fetch. Its a big thing for such amount of elements but we are not taking care of this in this solution. We could be always generating and precaching in a real env.
* I'll add indexes to the DB to make it faster.

#### Special cases of books

* The books will be flagged as special cases during generation time.
    

## Abstract Solution Architecture Proposal

The idea is to split the application in 4 parts:

- Frontend (React + Redux + Saga + reselect)
- Web Server (Express)
    - Exposes the endpoints (homepage and book retrieval API)
    - Connects to MongoDB to fetch books.
- Book generator (Written in ES6)
    - Generates book lists
    - Stores books in the database
    - This could be part of another repository but its so small thing I'll keep both together
- Database (MongoDB)
    - [mLab](https://mlab.com): I found this as a free alternative for this test.
    - ds151554.mlab.com:51554/casumo-books

## Tech Stack

Basic libraries/components I wanted to work with:

### Core

* [React](https://facebook.github.io/react/)
* [React Router](https://github.com/ReactTraining/react-router)
* [Redux](http://redux.js.org/)
* [Redux Saga](https://redux-saga.github.io/redux-saga/)
* [Reselect](https://github.com/reactjs/reselect)
* [ImmutableJS](https://facebook.github.io/immutable-js/)
* [ES6](https://www.ecma-international.org/ecma-262/6.0/)
* [Babel](https://babeljs.io/)
* [Webpack](https://webpack.js.org/)


### Server

* [Express](https://expressjs.com/)

### Database

* [MongoDB](https://www.mongodb.com/)

### Unit Testing

* [Jest](http://facebook.github.io/jest/)
* [Enzyme](http://airbnb.io/enzyme/)

### Linting

* [ESLint](http://eslint.org/)


*Note that I found already working npm modules to implement infite scroll but I guessed the exercise is about doing it :D


## License

The MIT License (MIT)

Copyright (c) 2017 Javier Cobos

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
