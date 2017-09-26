import genders from './genders';

/**
 * Class representing the Book Author
 */
class Author {
  /**
   * Creates an Author
   *
   * @param {Object} params The Default Values overrides.
   */
  constructor(params) {
    const defaultValues = {
      name: 'Default Author Name',
      gender: genders.FEMALE,
    };

    const authorData = {
      ...defaultValues,
      ...params,
    };

    this.name = authorData.name;
    this.gender = authorData.gender;
  }

  /**
   * Returns a JSON version of the instance data.
   *
   * @returns {{name: String, gender: String}}
   *
   * @public
   */
  toJSON() {
    return {
      name: this.name,
      gender: this.gender,
    };
  }
}

module.exports = Author;
