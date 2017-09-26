import randomTitle from 'random-title';
import randomName from 'random-name';
import moment from 'moment';
import randomDate from 'random-datetime';
import Author from './Author';
import Book from './Book';
import genres from './genres';
import genders from './genders';

/**
 * Class Representing the BookGenerator.
 * Provides functionality to generate and store books in the database.
 */
class BookGenerator {
  /**
   * Creates a BookGenerator
   *
   * @param {Object} params The Default Values overrides.
   *
   * @public
   */
  constructor(params) {
    const defaultValues = {
      bookIndex: -1,
    };

    const config = {
      ...defaultValues,
      ...params,
    };

    this.genders = genders;
    this.genres = genres;
    this.bookIndex = config.bookIndex;
  }

  /**
   * Returns a random book genre from a list given in constructor.
   *
   * @returns {String}
   * @public
   */
  getRandomGenre() {
    const genreKeys = Object.keys(this.genres);
    return this.genres[genreKeys[Math.floor(Math.random() * genreKeys.length)]];
  }

  /**
   * Returns a random person gender from an object given in constructor
   *
   * @returns {String}
   * @public
   */
  getRandomGender() {
    const genderKeys = Object.keys(this.genders);
    return this.genders[genderKeys[Math.floor(Math.random() * genderKeys.length)]];
  }

  /**
   * Generates a book instance.
   * The constructor counts with a counter so the book name and auhtor are incremental.
   * The genre would be random.
   * The startDate would also be incremental
   *
   * @oaram {Object} options Default overrides
   * @returns {Book}
   *
   * @public
   */
  generateBook(options) {
    this.bookIndex = this.bookIndex + 1;
    const date = moment.utc(randomDate()).toDate();
    return new Book({
      name: `${randomTitle({ min: 1, max: 3 })}`,
      author: this.generateAuthor(),
      genre: this.getRandomGenre(),
      publishDate: date,
      index: this.bookIndex,
      ...options,
    });
  }

  /**
   * Generates an Author instance. The name would be incremental based on the generator
   * instance counter.
   * The gender is random.
   *§
   * @return {Author}
   *
   * @public
   */
  generateAuthor() {
    return new Author({
      name: `${randomName.first()} ${randomName.middle()}`,
      gender: this.getRandomGender(),
    });
  }

  /**
   * Generates two special cases books
   *
   * @returns {Array}
   *
   * @public
   */
  generateSpecialBooks() {
    const books = [];

    books.push(this.generateBook({
      name: 'Released on Friday',
      genre: genres.horror,
      publishDate: moment.utc([9000, 9, 31]).toDate(),
    }));

    books.push(this.generateBook({
      name: 'Moneeey',
      genre: genres.finance,
      publishDate: moment.utc([9001, 0, 30]).toDate(),
    }));

    return books;
  }

  /**
   * Generates an Array of books of size given
   *
   * @param {number} size Number of books to be created
   *
   * @returns {Array}
   *
   * @public
   */
  generateBooks(size) {
    const books = [];

    for (let i = 0; i < size; i += 1) {
      books.push(this.generateBook());
    }
    return books;
  }
}

export default BookGenerator;
