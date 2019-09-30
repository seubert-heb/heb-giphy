import React, { Component } from 'react';
import { Container } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

import Favorite from './Favorite.react.js';

class Favorites extends Component {
  constructor(props) {
    super(props);

    const { history } = this.props;

    let token = localStorage.getItem('token');
    if (token === '' || token === null) {
      history.push('/login');
    }

    this.state = {
      faves: [],
    };
  }

  componentDidMount() {
    this.fetchFaves();
  }

  fetchFaves() {
    const { history } = this.props;

    let token = localStorage.getItem('token');
    if (token === '') {
      history.push('/login');
    }

    fetch(`${process.env.REACT_APP_API_HOST}/favorites`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }).then(response => {
      if (response.status === 500) {
        history.push('/login');
      }
      return response.json();
    }).then(data => {
      this.setState({'faves': data.faves});
    })
  }

  categoryUpdated(faveId, newCategory) {
    let faveIndex = this.state.faves.findIndex((fave => fave.id === faveId));
    this.state.faves[faveIndex].categories.push(newCategory);
  }

  render() {
    console.log('this.state.faves');
    console.log(this.state.faves);
    return (
      <div>
        <Container className='faveList'>
          {this.state.faves.length === 0 &&
           <h2>You have no faves!</h2>}
          {this.state.faves.map((gif) =>
            <span key={gif.url}>
              <Favorite src={gif.url} categories={gif.categories} faveId={gif.id} onCategoryUpdate={this.categoryUpdated} />
            </span>
          )}
        </Container>
      </div>
    );
  }
}

export default withRouter(Favorites);
