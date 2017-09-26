import {
  Grid,
  Row,
  Col,
} from 'react-bootstrap';
import React from 'react';
import styles from './App.css';
import logo from '../../styles/img/logo.png';
import BookList from '../../containers/BookList';
import BookFilters from '../../containers/BookFilters';

/**
 * Pure react component describing our entry point in components wise
 * @constructor
 */
const App = () => (
  <Grid>
    <Row className="show-grid">
      <Col xs={10} md={6} >
        <div className={styles.wrapper}>
          <div className={styles.content}>
            <BookList />
          </div>
        </div>
      </Col>
      <Col xs={5} md={5} >
        <img className={styles.logo} src={logo} alt="React logo" />
        <BookFilters />
      </Col>
    </Row>
  </Grid>
);

export default App;
