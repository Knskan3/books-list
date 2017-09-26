import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Label,
} from 'react-bootstrap';
import genders from '../../../book-generator/genders';
import styles from './BookList.css';
import loadingImage from '../../styles/img/loading.gif';
import maleIcon from '../../styles/img/male.png';
import femaleIcon from '../../styles/img/female.png';

/**
 * Describes the BookList react component
 */
class BookList extends Component {
  /**
   * Creates a BookList
   *
   * @param {Object} props React component props injected by connect and passed as attributes
   *
   * @public
   */
  constructor(props) {
    super(props);
    this.bottomTreshold = 70;
    this.topTreshold = 30;
    this.props.bookRequest({ reset: true });
  }

  /**
   * Lifecycle component method.
   * We use it to add a event listener and handler to the scroll event.
   */
  componentDidMount() {
    this.scrollerElement.addEventListener('scroll', this.scrollHandler);
  }

  /**
   * Lifecycle component method.
   * We use it to cheat the top appending not updating scroll
   */
  componentDidUpdate() {
    if (this.scrollerElement.scrollTop === 0) {
      this.scrollerElement.scrollTop = 1;
    }
  }

  /**
   * Formats the book date in a better readable format
   * @param {Object} book
   * @returns {string} Format date
   */
  getFormatedDate = (book) => {
    const d = new Date(book.publishDate);
    return `${d.getDate()}/${(d.getMonth() + 1)}/${d.getFullYear()}`;
  }

  /**
   * Generates a component with the author gender icon
   *
   * @param gender
   * @returns {JSX} Image component with gender icon
   */
  getAuthorGenderIcon = (gender) => {
    if (gender === genders.FEMALE) {
      return <img className={styles.genderIcon} src={femaleIcon} alt="female" />;
    }
    return <img className={styles.genderIcon} src={maleIcon} alt="male" />;
  }

  /**
   * Stores the DOM node containing the scroll
   *
   * @param {DOMElement}
   */
  captureScroller = (node) => {
    this.scrollerElement = node;
  }

  /**
   * Handles the scroll event. The idea is to request books if the scroll is situated between
   * some thresholds. Either going up or down.
   *
   * @param {Event} e Event containing scroll info
   */
  scrollHandler = (e) => {
    const node = e.srcElement;
    const scrollPer = (node.scrollTop / (node.scrollHeight - node.offsetHeight)) * 100;

    // scroll down
    if ((!this.props.books.loading) &&
      (scrollPer > this.bottomTreshold) &&
      (this.props.books.total > this.props.books.last)) {
      this.props.bookRequest({ reset: false });
    }

    // scroll up
    if ((!this.props.books.loadingBackwards) &&
      (scrollPer < this.topTreshold) &&
      (this.props.books.first > 0)) {
      this.props.bookRequest({ reset: false, backwards: true });
    }
  }

  /**
   * Lifecycle component method. Renders the component.
   *
   * @returns {JSX}
   */
  render() {
    return (<div className={styles.wrapper}>
      <div id="scroller" ref={this.captureScroller} className={styles.bookListContainer}>
        <div className={this.props.books.loadingBackwards ? '' : styles.hide}>
          <div><img className={styles.loadingImage} src={loadingImage} alt="loading" /></div>
        </div>
        {
          this.props.books.stack.map((book) => (
            // eslint-disable-next-line
            <div className={`bookItem ${styles.bookRow}`} key={book._id}>
              <div><b>{book.name}</b></div>
              <div>By: {book.author.name}</div>
              <div>On: {this.getFormatedDate(book)}</div>
              <div>
                {this.getAuthorGenderIcon(book.author.gender)}
                <Label className={styles.label} bsStyle="primary">{book.genre.name}</Label>
                {(book.horrorFlag)
                  && (<Label className={`superHorror ${styles.label}`} bsStyle="danger">Super Horror</Label>)}
                {(book.financeFlag)
                && (<Label className={`hotFinance ${styles.label}`} bsStyle="info">Hot Finance</Label>)}
              </div>
            </div>
          ))
        }
        <div className={this.props.books.loading ? '' : styles.hide}>
          <div><img className={styles.loadingImage} src={loadingImage} alt="loading" /></div>
        </div>
        <div className={(!this.props.books.loading && (this.props.books.stack.length <= 0)) ? '' : styles.hide}>
          <div className={styles.bookRow} >No Results :(</div>
        </div>
      </div>
    </div>);
  }
}

/**
 * Props type validation for this component.
 * @type {{books: *, bookRequest: *}}
 */
BookList.propTypes = {
  books: PropTypes.object,
  bookRequest: PropTypes.func,
};

export default BookList;
