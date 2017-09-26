import moment from 'moment';
import genres from './genres';

/**
 * Class representing the Book
 */
class Book {
  /**
   * Creates a Book
   *
   * @param {Object} params The Default Values overrides.
   *
   * @public
   */
  constructor(params) {
    const defaultValues = {
      name: 'Default Book Name',
      author: {},
      genre: genres.indeterminate,
      publishDate: moment.utc([1, 1, 1]).toDate(), // year, month (zero based), day
      index: 0,
    };

    const bookData = {
      ...defaultValues,
      ...params,
    };

    this.name = bookData.name;
    this.author = bookData.author;
    this.genre = bookData.genre;
    this.publishDate = bookData.publishDate;
    this.index = bookData.index;
    this.horrorFlag = false;
    this.financeFlag = false;

    this.flagSpecialCases();
  }

  /**
   * Checks if the release date of the book is halloween
   *
   * @returns {boolean}
   * @public
   */
  publishedInHalloween() {
    // halloween case (XXXX-10-31) but month is Zero based (XXXX-09-31)
    return (this.publishDate.getMonth() === 9) && (this.publishDate.getDate() === 31);
  }

  /**
   * Checks if the publishDate occurred in the last friday of the month.
   *
   * @returns {boolean}
   * @public
   */
  publishedLastFridayOfMonth() {
    const lastFriday = moment([this.publishDate.getFullYear(), this.publishDate.getMonth()]).endOf('month');

    while (lastFriday.day() !== 5) {
      lastFriday.subtract(1, 'days');
    }
    const lastFridayDate = lastFriday.toDate();
    return (lastFridayDate.getDate() === this.publishDate.getDate()) &&
      (lastFridayDate.getMonth() === this.publishDate.getMonth()) &&
      (lastFridayDate.getFullYear() === this.publishDate.getFullYear());
  }

  /**
   * Flags two especial cases:
   * - books in the "horror" genre, published on Halloween
   * - books in the "finance" genre, published on the last Friday of any month
   *
   * @returns {void}
   * @public
   */
  flagSpecialCases() {
    if (this.publishedInHalloween() && (this.genre.id === genres.horror.id)) {
      this.horrorFlag = true;
    }

    if (this.publishedLastFridayOfMonth() && (this.genre.id === genres.finance.id)) {
      this.financeFlag = true;
    }
  }

  /**
   * Returns a JSON version of the instance data.
   *
   * @returns {{name: String, author: (Author), genre: String, publishDate: Date}}
   *
   * @public
   */
  toJSON() {
    return {
      name: this.name,
      author: this.author,
      genre: this.genre,
      publishDate: this.publishDate,
      index: this.index,
    };
  }
}

module.exports = Book;
